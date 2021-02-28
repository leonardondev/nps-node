import request from 'supertest';
import { getConnection } from 'typeorm';
import { app } from '../app'; //raiz do projeto

import createConnection from '../database';

describe('Surveys', () => {
  beforeAll( async() => {
    const connection = await createConnection();
    await connection.runMigrations();
  })

  afterAll( async() => {
    const connection = getConnection();
    await connection.dropDatabase();
    await connection.close();
  })

  it('should be able to create a new survey', async () => {
    const response = await request(app).post('/surveys').send({
      title: 'Title Example',
      description: 'Description Example',
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toMatchObject({
      title: 'Title Example',
      description: 'Description Example',
    });
  });

  it('should be able to get all surveys', async () => {
    await request(app).post('/surveys').send({
      title: 'Title Exampl2',
      description: 'Description Example2',
    });
    await request(app).post('/surveys').send({
      title: 'Title Example3',
      description: 'Description Example3',
    });

    const response = await request(app).get('/surveys');

    expect(response.body.length).toBe(3);
  })


});
