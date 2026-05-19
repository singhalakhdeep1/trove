import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '@/app.module';

describe('Auth API (e2e)', () => {
    let app: INestApplication;
    let authToken: string;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe());
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    describe('POST /auth/register', () => {
        it('should register a new user', () => {
            return request(app.getHttpServer())
                .post('/api/v1/auth/register')
                .send({
                    email: 'test@example.com',
                    password: 'password123',
                    name: 'Test User',
                })
                .expect(201)
                .expect((res) => {
                    expect(res.body).toHaveProperty('user');
                    expect(res.body).toHaveProperty('token');
                    expect(res.body.user.email).toBe('test@example.com');
                    authToken = res.body.token;
                });
        });

        it('should return 400 for invalid email', () => {
            return request(app.getHttpServer())
                .post('/api/v1/auth/register')
                .send({
                    email: 'invalid-email',
                    password: 'password123',
                    name: 'Test User',
                })
                .expect(400);
        });

        it('should return 400 for short password', () => {
            return request(app.getHttpServer())
                .post('/api/v1/auth/register')
                .send({
                    email: 'test2@example.com',
                    password: '123',
                    name: 'Test User',
                })
                .expect(400);
        });
    });

    describe('POST /auth/login', () => {
        it('should login with valid credentials', () => {
            return request(app.getHttpServer())
                .post('/api/v1/auth/login')
                .send({
                    email: 'test@example.com',
                    password: 'password123',
                })
                .expect(200)
                .expect((res) => {
                    expect(res.body).toHaveProperty('user');
                    expect(res.body).toHaveProperty('token');
                });
        });

        it('should return 401 for invalid credentials', () => {
            return request(app.getHttpServer())
                .post('/api/v1/auth/login')
                .send({
                    email: 'test@example.com',
                    password: 'wrongpassword',
                })
                .expect(401);
        });
    });

    describe('GET /auth/profile', () => {
        it('should get user profile with valid token', () => {
            return request(app.getHttpServer())
                .get('/api/v1/auth/profile')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200)
                .expect((res) => {
                    expect(res.body).toHaveProperty('id');
                    expect(res.body).toHaveProperty('email');
                    expect(res.body.email).toBe('test@example.com');
                });
        });

        it('should return 401 without token', () => {
            return request(app.getHttpServer())
                .get('/api/v1/auth/profile')
                .expect(401);
        });

        it('should return 401 with invalid token', () => {
            return request(app.getHttpServer())
                .get('/api/v1/auth/profile')
                .set('Authorization', 'Bearer invalid-token')
                .expect(401);
        });
    });

    describe('POST /auth/logout', () => {
        it('should logout user', () => {
            return request(app.getHttpServer())
                .post('/api/v1/auth/logout')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200)
                .expect((res) => {
                    expect(res.body.message).toBe('Logged out successfully');
                });
        });
    });
});
