import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule } from '@nestjs/throttler';
import { join } from 'path';

// Core modules
import { PrismaModule } from './prisma/prisma.module';
import { RedisModule } from './redis/redis.module';
import { ElasticsearchModule } from './elasticsearch/elasticsearch.module';

// Feature modules
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ProductsModule } from './modules/products/products.module';
import { OrdersModule } from './modules/orders/orders.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { ShippingModule } from './modules/shipping/shipping.module';
import { SellersModule } from './modules/sellers/sellers.module';
import { ServicesModule } from './modules/services/services.module';
import { FoodModule } from './modules/food/food.module';
import { TravelModule } from './modules/travel/travel.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { SearchModule } from './modules/search/search.module';
import { RecommendationsModule } from './modules/recommendations/recommendations.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { AdminModule } from './modules/admin/admin.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { WishlistModule } from './modules/wishlist/wishlist.module';
import { ChatModule } from './modules/chat/chat.module';
import { InventoryModule } from './modules/inventory/inventory.module';

@Module({
    imports: [
        // Configuration
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),

        // GraphQL
        GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
            sortSchema: true,
            playground: true,
            context: ({ req, res }) => ({ req, res }),
        }),

        // Scheduling
        ScheduleModule.forRoot(),

        // Rate limiting
        ThrottlerModule.forRoot([
            {
                ttl: 60000,
                limit: 100,
            },
        ]),

        // Core
        PrismaModule,
        RedisModule,
        ElasticsearchModule,

        // Features
        AuthModule,
        UsersModule,
        ProductsModule,
        OrdersModule,
        PaymentsModule,
        ShippingModule,
        SellersModule,
        ServicesModule,
        FoodModule,
        TravelModule,
        NotificationsModule,
        SearchModule,
        RecommendationsModule,
        AnalyticsModule,
        AdminModule,
        ReviewsModule,
        WishlistModule,
        ChatModule,
        InventoryModule,
    ],
})
export class AppModule { }
