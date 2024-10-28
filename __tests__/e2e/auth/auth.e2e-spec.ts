import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { DatabaseModule } from '../../../src/database/database.module';
import { UsersModule } from '../../../src/users/users.module';
import { AuthModule } from '../../../src/auth/auth.module';

describe('Auth E2E Tests', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [UsersModule, AuthModule, DatabaseModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/users/register (POST) - should register a new user', async () => {
    const response = await request(app.getHttpServer())
      .post('/users/register')
      .send({
        username: 'testuser',
        password: 'pwd123',
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
  });

  it('/auth/login (POST) - should login with correct credentials', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        username: 'testuser',
        password: 'pwd123',
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('access_token');
  });

  afterAll(async () => {
    await app.close();
  });
});
