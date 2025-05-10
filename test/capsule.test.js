import { expect, use } from 'chai';
import chaiHttp from 'chai-http';
import { request } from 'chai-http';
import app from '../server.js';

use(chaiHttp);

let token = '';

describe('Capsule API', () => {
  before(async () => {
    const email = `test${Date.now()}@gmail.com`;

    await request.execute(app)
      .post('/auth/register')
      .send({ email, password: 'pass123' });

    const loginRes = await request.execute(app)
      .post('/auth/login')
      .send({ email, password: 'pass123' });

    token = loginRes.body.accessToken;
  });

  it('should create a new capsule', async () => {
    const res = await request.execute(app)
      .post('/capsules')
      .set('Authorization', `Bearer ${token}`)
      .send({
        message: 'Hello future!',
        unlock_at: '2025-12-31T23:59:59Z'
      });

    expect(res).to.have.status(201);
    expect(res.body).to.have.property('id');
    expect(res.body).to.have.property('unlock_code');
  });

  it('should not allow access to capsule before unlock time', async () => {
    const resCreate = await request.execute(app)
      .post('/capsules')
      .set('Authorization', `Bearer ${token}`)
      .send({
        message: 'Future capsule',
        unlock_at: new Date(Date.now() + 10 * 60 * 1000).toISOString()
      });

    const { id, unlock_code } = resCreate.body;

    const res = await request.execute(app)
      .get(`/capsules/${id}?code=${unlock_code}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res).to.have.status(403);
  });

  it('should return 401 if unlock code is missing for unlocked capsule', async () => {
    const resCreate = await request.execute(app)
      .post('/capsules')
      .set('Authorization', `Bearer ${token}`)
      .send({
        message: 'Unlocked capsule',
        unlock_at: new Date(Date.now() - 2 * 60 * 1000).toISOString()
      });

    const { id } = resCreate.body;

    const res = await request.execute(app)
      .get(`/capsules/${id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res).to.have.status(401);
  });

  it('should return list of user capsules with metadata', async () => {
    const res = await request.execute(app)
      .get('/capsules')
      .set('Authorization', `Bearer ${token}`);

    expect(res).to.have.status(200);
    expect(res.body).to.have.property('capsules');
  });

  it('should update the capsule before unlock time', async () => {
    const resCreate = await request.execute(app)
      .post('/capsules')
      .set('Authorization', `Bearer ${token}`)
      .send({
        message: 'Update me',
        unlock_at: '2026-01-01T00:00:00Z'
      });

    const { id, unlock_code } = resCreate.body;

    const res = await request.execute(app)
      .put(`/capsules/${id}?code=${unlock_code}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        message: 'Updated!',
        unlock_at: '2026-12-01T00:00:00Z'
      });

    expect(res).to.have.status(200);
    expect(res.body.updated).to.be.true;
  });

  it('should not update capsule with wrong code', async () => {
    const resCreate = await request.execute(app)
      .post('/capsules')
      .set('Authorization', `Bearer ${token}`)
      .send({
        message: 'Wrong code test',
        unlock_at: '2026-01-01T00:00:00Z'
      });

    const { id } = resCreate.body;

    const res = await request.execute(app)
      .put(`/capsules/${id}?code=wrongcode`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        message: 'Hacked!',
        unlock_at: '2026-12-01T00:00:00Z'
      });

    expect(res).to.have.status(401);
  });

  it('should delete the capsule before unlock time with valid code', async () => {
    const resCreate = await request.execute(app)
      .post('/capsules')
      .set('Authorization', `Bearer ${token}`)
      .send({
        message: 'Delete me',
        unlock_at: '2025-12-31T23:59:59Z'
      });

    const { id, unlock_code } = resCreate.body;

    const res = await request.execute(app)
      .delete(`/capsules/${id}?code=${unlock_code}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res).to.have.status(204);
  });

  it('should not delete capsule with wrong code', async () => {
    const resCreate = await request.execute(app)
      .post('/capsules')
      .set('Authorization', `Bearer ${token}`)
      .send({
        message: 'Attempt wrong delete',
        unlock_at: '2025-12-31T23:59:59Z'
      });

    const { id } = resCreate.body;

    const res = await request.execute(app)
      .delete(`/capsules/${id}?code=invalidcode`)
      .set('Authorization', `Bearer ${token}`);

    expect(res).to.have.status(401);
  });
});
