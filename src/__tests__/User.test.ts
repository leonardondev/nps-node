import request from 'supertest';
import { getConnection } from 'typeorm';
import { app } from '../app'; //raiz do projeto

import createConnection from '../database';

describe('User', () => {
  beforeAll( async() => {
    const connection = await createConnection();
    await connection.runMigrations();
  })

  afterAll( async() => {
    const connection = getConnection();
    await connection.dropDatabase();
    await connection.close();
  })

  it('should be able to create a new user', async () => {
    const response = await request(app).post('/users').send({
      name: 'User Example',
      email: 'user@example.com',
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toMatchObject({
      name: 'User Example',
      email: 'user@example.com',
    });
  });

  it('should not be able to create with exists email', async () => {
    const response = await request(app).post('/users').send({
      name: 'User Example',
      email: 'user@example.com',
    });

    expect(response.status).toBe(400);
  });

});
