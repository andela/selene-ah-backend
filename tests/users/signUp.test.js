import chaiHttp from 'chai-http';
import sinon from 'sinon';
import chai, { expect } from 'chai';
import url from '../../server/index';
import signupFactory from '../mocks/factories/userFactory';
import models from '../../server/models';
import userController from '../../server/controllers/auth/userAuth';


chai.use(chaiHttp);
const { User } = models;

describe('API endpoint for POST auth/signup - Email Validations', () => {
  it('should register a user with a correct email', async () => {
    const user = signupFactory.build({
      email: 'opeyemidaniel@gmail.com',
      password: 'password123*'
    });
    await chai.request(url)
    .post('/api/v1/auth/signup')
    .send(user)
    .then((res) => {
      expect(res).to.have.status(200);
      expect(res.body).to.be.an('Object');
      expect(res.body.msg).to.be.equals('User created successfully');
    });
  });

  it('should fail if email exist in the database', async () => {
    const user = signupFactory.build({
      email: 'opeyemidaniel@gmail.com',
      password: 'password123*'
    });
    await chai.request(url)
    .post('/api/v1/auth/signup')
    .send(user)
    .then((res) => {
      expect(res).to.have.status(400);
      expect(res.body).to.be.an('Object');
      expect(res.body.msg).to.be.equals('Email already exist, Login');
    });
  });

  it('should fail if email field is empty', () => {
    const user = signupFactory.build({
      email: null
    });
    chai.request(url)
    .post('/api/v1/auth/signup')
    .send(user)
    .then((res) => {
      expect(res).to.have.status(400);
      expect(res.body).to.be.an('Object');
      expect(res.body.msg).to.be.equals('Email field cannot be empty');
    });
  });

  it('should fail if user supply invalid email', () => {
    const user = signupFactory.build({
      email: 'danieiopeyey@djjdd'
    });
    chai.request(url)
    .post('/api/v1/auth/signup')
    .send(user)
    .then((res) => {
      expect(res).to.have.status(400);
      expect(res.body).to.be.an('Object');
      expect(res.body.msg).to.be.equals('Invalid Email: supply a valid email');
    });
  });

  it('should fail if a duplicate email is found', () => {
    const user = signupFactory.build({
      email: 'opeyemidaniel@gmail.com'
    });
    chai.request(url)
    .post('/api/v1/auth/signup')
    .send(user)
    .then((res) => {
      expect(res).to.have.status(400);
      expect(res.body).to.be.an('Object');
      expect(res.body.msg).to.be.equals('Email already exist, Login');
    });
  });

  it('fake test: should throw 500 error ', async () => {
    const user = signupFactory.build();
    const req= {
      body: user
    };

    const res = {};
    const next = sinon.stub();

    sinon.stub(User, 'create').throws();
    await userController.signupUser(req, res, next);
    expect(next.called).to.be.true;
  });
});
