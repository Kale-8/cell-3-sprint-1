import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../../Sprint-1/src/app.module';
import { DataSource } from 'typeorm';

describe('App (e2e)', () => {
  let app: INestApplication;
  let httpServer: any;
  const email = `test${Date.now()}@example.com`;
  const password = 'password';

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
    httpServer = app.getHttpServer();
  });

  afterAll(async () => {
    // drop database (only for sqlite in dev)
    const ds = app.get(DataSource);
    await ds.dropDatabase();
    await app.close();
  });

  it('register, login, create task, list tasks', async () => {
    // register
    await request(httpServer)
      .post('/auth/register')
      .send({ username: 'tester', email, password })
      .expect(201);

    // login
    const loginRes = await request(httpServer)
      .post('/auth/login')
      .send({ email, password })
      .expect(201);

    const token = loginRes.body.access_token;
    expect(token).toBeDefined();

    // create task
    const createRes = await request(httpServer)
      .post('/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'My first task', description: 'desc' })
      .expect(201);

    expect(createRes.body.id).toBeDefined();

    // list tasks
    const listRes = await request(httpServer)
      .get('/tasks?page=1&limit=10')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(listRes.body).toHaveProperty('data');
    expect(Array.isArray(listRes.body.data)).toBe(true);
  });
});

