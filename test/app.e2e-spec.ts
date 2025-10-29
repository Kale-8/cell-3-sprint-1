import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request = require('supertest');
import { AppModule } from '../src/app.module';

describe('Auth and Tasks Flow (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('Complete auth and tasks flow', async () => {
    const testUser = {
      email: `test${Date.now()}@example.com`,
      password: 'password123',
      name: 'Test User',
    };

    // 1. Register new user
    const registerResponse = await request(app.getHttpServer())
      .post('/auth/register')
      .send(testUser)
      .expect(201);

    expect(registerResponse.body).toHaveProperty('accessToken');
    expect(registerResponse.body.user).toHaveProperty('email', testUser.email);
    const accessToken = registerResponse.body.accessToken;

    // 2. Login user
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password,
      });

    expect([200, 201]).toContain(loginResponse.status);
    expect(loginResponse.body).toHaveProperty('accessToken');

    // 3. Login with invalid credentials should fail
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: testUser.email,
        password: 'wrongpassword',
      })
      .expect(401);

    // 4. Get tasks without auth should return 401
    await request(app.getHttpServer())
      .get('/tasks')
      .expect(401);

    // 5. Create a new task
    const createTaskResponse = await request(app.getHttpServer())
      .post('/tasks')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'Test Task',
        description: 'Test Description',
      })
      .expect(201);

    expect(createTaskResponse.body).toHaveProperty('id');
    expect(createTaskResponse.body).toHaveProperty('title', 'Test Task');
    expect(createTaskResponse.body).toHaveProperty('status', 'pending');
    const taskId = createTaskResponse.body.id;

    // 6. Get paginated tasks
    const getTasksResponse = await request(app.getHttpServer())
      .get('/tasks?page=1&limit=10')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(getTasksResponse.body).toHaveProperty('data');
    expect(getTasksResponse.body).toHaveProperty('meta');
    expect(Array.isArray(getTasksResponse.body.data)).toBe(true);
    expect(getTasksResponse.body.meta).toHaveProperty('page', 1);
    expect(getTasksResponse.body.meta).toHaveProperty('limit', 10);

    // 7. Get task by id
    const getTaskResponse = await request(app.getHttpServer())
      .get(`/tasks/${taskId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(getTaskResponse.body).toHaveProperty('id', taskId);
    expect(getTaskResponse.body).toHaveProperty('title', 'Test Task');

    // 8. Update task
    const updateTaskResponse = await request(app.getHttpServer())
      .patch(`/tasks/${taskId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        status: 'completed',
        title: 'Updated Task',
      })
      .expect(200);

    expect(updateTaskResponse.body).toHaveProperty('status', 'completed');
    expect(updateTaskResponse.body).toHaveProperty('title', 'Updated Task');

    // 9. Delete task
    await request(app.getHttpServer())
      .delete(`/tasks/${taskId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    // 10. Get deleted task should return 404
    await request(app.getHttpServer())
      .get(`/tasks/${taskId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(404);
  });
});
