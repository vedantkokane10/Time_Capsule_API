import { expect, use } from 'chai';
import chaiHttp from 'chai-http';
import { request } from 'chai-http';
import app from '../server.js';

use(chaiHttp);

let token = '';
let testEmail = '';

describe('Auth and Capsules API', () => {
  it('should register a new user and return a token', async () => {
    testEmail = `alice${Date.now()}@example.com`;

    const res = await request.execute(app)
      .post('/auth/register')
      .send({ email: testEmail, password: 'secret' });

    expect(res).to.have.status(201);
    expect(res.body).to.have.property('accessToken');
  });

  it('should allow a logged-in user to access /capsules', async () => {
    const resLogin = await request.execute(app)
      .post('/auth/login')
      .send({ email: testEmail, password: 'secret' });

      expect([200, 201]).to.include(resLogin.status);
    expect(resLogin.body).to.have.property('accessToken');

    token = resLogin.body.accessToken;

    const res = await request.execute(app)
      .get('/capsules')
      .set('Authorization', `Bearer ${token}`);

    expect(res).to.have.status(200);
    expect(res.body).to.have.property('capsules');
  });
});
