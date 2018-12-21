import chaiHttp from 'chai-http';
import chai, { expect } from 'chai';
import server from '../../server/index';
import signupFactory from '../mocks/factories/userFactory';

chai.use(chaiHttp);
let token;

describe('##Pagination validation', () => {
  const user = signupFactory.build({
    email: 'oyggoppuii@gmail.com',
    password: 'password123*'
  });

  before(async () => {
    const res = await chai.request(server)
      .post('/api/v1/auth/signup')
      .send(user);
    token = res.body.token;
  });

  it('Should return error if string is passed to limit', async () => {
    const res = await chai.request(server)
      .get('/api/v1/articles?limit=kkk')
      .set('Authorization', `Bearer ${token}`);
      expect(res).to.have.status(400);
      expect (res.body).to.be.an('Object');
      expect(res.body.message).to.be.equals('limit can only be an Integer');
  });


  it('Should return error if string is passed to page', async () => {
    const res = await chai.request(server)
      .get('/api/v1/articles?page=kkk')
      .set('Authorization', `Bearer ${token}`);
      expect(res).to.have.status(400);
      expect (res.body).to.be.an('Object');
      expect(res.body.message).to.be.equals('page can only be an Integer');
  });

  it('Should return error if limit is negative', async () => {
    const res = await chai.request(server)
      .get('/api/v1/articles?limit=-1')
      .set('Authorization', `Bearer ${token}`);
      expect(res).to.have.status(400);
      expect (res.body).to.be.an('Object');
      expect(res.body.message).to.be.equals('limit must not be negative');
  });


  it('Should return error if page is negative', async () => {
    const res = await chai.request(server)
      .get('/api/v1/articles?page=-1')
      .set('Authorization', `Bearer ${token}`);
      expect(res).to.have.status(400);
      expect (res.body).to.be.an('Object');
      expect(res.body.message).to.be.equals('page must not be negative');
  });
});
