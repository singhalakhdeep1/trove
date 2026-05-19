import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import * as compression from 'compression';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        cors: {
            origin: process.env.FRONTEND_URL || 'http://localhost:3000',
            credentials: true,
        },
    });

    const configService = app.get(ConfigService);

    // Security
    app.use(helmet());
    app.use(cookieParser());
    app.use(compression());

    // Validation
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }),
    );

    // API prefix
    app.setGlobalPrefix('api/v1');

    // Swagger documentation
    const config = new DocumentBuilder()
        .setTitle('Marketplace Super App API')
        .setDescription('Comprehensive marketplace API with 1,200+ features')
        .setVersion('1.0')
        .addBearerAuth()
        .addTag('Auth', 'Authentication and Authorization')
        .addTag('Users', 'User management')
        .addTag('Products', 'Product catalog')
        .addTag('Orders', 'Order management')
        .addTag('Payments', 'Payment processing')
        .addTag('Sellers', 'Seller dashboard')
        .addTag('Services', 'Service marketplace')
        .addTag('Food', 'Food delivery')
        .addTag('Travel', 'Travel bookings')
        .addTag('Admin', 'Admin operations')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);

    const port = configService.get('PORT') || 4000;
    await app.listen(port);

    console.log(`🚀 Server running on http://localhost:${port}`);
    console.log(`📚 API Docs available at http://localhost:${port}/api/docs`);
    console.log(`🎮 GraphQL Playground at http://localhost:${port}/graphql`);
}

bootstrap();
