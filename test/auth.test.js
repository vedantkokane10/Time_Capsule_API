import { expect, use } from 'chai';
import chaiHttp from 'chai-http';
import { request } from 'chai-http';
import app from '../server.js';

use(chaiHttp);

describe('Auth and Capsules API', () => {
  it('should register a new user and return a token', async () => {
    const uniqueEmail = `alice${Date.now()}@example.com`;

    const res = await request.execute(app)
      .post('/auth/register')
      .send({ email: uniqueEmail, password: 'secret' });

    expect(res).to.have.status(201);
    expect(res.body).to.have.property('accessToken');
  });

  it('should allow an authenticated user to access /capsules', async () => {
    const resLogin = await request.execute(app)
      .post('/auth/login')
      .send({ email: 'alice@example.com', password: 'secret' });

    const token = resLogin.body.accessToken;

    const res = await request.execute(app)
      .get('/capsules')
      .set('Authorization', `Bearer ${token}`);

    expect(res).to.have.status(200);
  });
});
