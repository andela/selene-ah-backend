import chaiHttp from 'chai-http';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import url from '../../server/index';
import userFactory from '../mocks/factories/userFactory';
import models from '../../server/models';
import UserController from '../../server/controllers/userController';
import { REGULAR } from '../../server/helpers/constants';


const user = userFactory.build({
  password: 'daniel.shotonwa12',
  role: REGULAR,
  userName: 'opeyeyy676'
});


chai.use(chaiHttp);

const { User } = models;
let token;
describe('GET List Users', () => {
  before( async ()=>{
    const res = await chai.request(url)
    .post('/api/v1/auth/signup')
    .send(user);
    token = res.body.token;
  });

  it('should list all users if a user is authenticated', async ()=> {
    const res = await chai.request(url)
      .get('/api/v1/users')
      .set('Authorization', `Bearer ${token}`);
    expect(res).to.have.status(200);
    expect(res.body).to.be.an('object');
    expect(res.body.users).to.be.an('Array');
    expect(res.body.msg).to.be.equal('User(s) returned successfully');
  });

  it('should give error if Token is not supplied', async () => {
    const res = await chai.request(url)
      .get('/api/v1/users');
      expect(res).to.have.status(401);
      expect(res.body).to.be.an('object');
      expect(res.body.message).to.be
        .equals('Authentication failed: Please supply a valid token.');
  });

  it('should return a user with length of 1', async () => {
    const res = await chai.request(url)
    .get('/api/v1/users?page=1&limit=1')
    .set('Authorization', `Bearer ${token}`);
    expect(res).to.have.status(200);
    expect(res.body).to.be.an('object');
    expect(res.body.msg).to.be.equal('User(s) returned successfully');
    expect(res.body.users.length).to.be.equals(1);
  });

  it('should return 3 users with limit equals to 3', async () => {
    const res = await chai.request(url)
    .get('/api/v1/users?page=1&limit=3')
    .set('Authorization', `Bearer ${token}`);
    expect(res).to.have.status(200);
    expect(res.body).to.be.an('object');
    expect(res.body.msg).to.be.equal('User(s) returned successfully');
    expect(res.body.users.length).to.be.equals(3);
  });

  it('should return no user with page equals to 50', async () => {
    const res = await chai.request(url)
    .get('/api/v1/users?page=50&limit=10')
    .set('Authorization', `Bearer ${token}`);
    expect(res).to.have.status(404);
    expect(res.body).to.be.an('object');
    expect(res.body.msg).to.be.equal('No User returned');
  });

  it('should give error if Token is Invalid',  async ()=> {
    const res = await chai.request(url)
      .get('/api/v1/users')
      .set('Authorization', 'Bearer invalidTOKEN');
    expect(res).to.have.status(401);
    expect(res.body).to.be.an('object');
    expect(res.body.message).to.be
      .equals('Authentication failed: Please supply a valid token.');
  });

  it('fake test: should return 500 error', async () => {
    const req= {
      query: {
        page: 1,
        limit: 2
      }
    };
    const res = {};
    const next = sinon.stub();

    sinon.stub(User, 'findAll').throws();
    await UserController.getAllUsers(req, res, next);
    expect(next.called).to.be.true;
    sinon.restore();
  });
});
