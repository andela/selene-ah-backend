import chaiHttp from 'chai-http';
import chai, { expect } from 'chai';
import url from '../../server/index';
import signupFactory from '../mocks/factories/userFactory';

chai.use(chaiHttp);
describe('API endpoint for POST auth/signup - Name Validations', () => {
  it('should register a user with a valid firstName', () => {
    const user = signupFactory.build({
      password: 'opeyemi2018*'
    });
    chai.request(url)
    .post('/api/v1/auth/signup')
    .send(user)
    .then((res) => {
      expect(res).to.have.status(200);
      expect(res.body).to.be.an('Object');
      expect(res.body.msg).to.be.equals('User created successfully');
    });
  });

  it('should return a 404 status for invalid routes', () => chai.request(url)
    .get('/api/v1/au')
    .then((res) => {
      expect(res).to.have.status(404);
      expect(res.body).to.be.an('Object');
      expect(res.body.errors.message).to.be.equals('Not Found');
    }));

  it('should return an error if the firstName is null', () => {
    const user = signupFactory.build({
      password: 'opeyemi20*',
      firstName: null
    });
    chai.request(url)
    .post('/api/v1/auth/signup')
    .send(user)
    .then((res) => {
      expect(res).to.have.status(400);
      expect(res.body).to.be.an('Object');
      expect(res.body.msg).to.be.equals('Firstname must be supplied');
    });
  });

  it('should return an error if firstName is a number', () => {
    const user = signupFactory.build({
      password: 'opeyemi20*',
      firstName: '56789'
    });
    chai.request(url)
    .post('/api/v1/auth/signup')
    .send(user)
    .then((res) => {
      expect(res).to.have.status(400);
      expect(res.body).to.be.an('Object');
      expect(res.body.msg).to.be.equals(
        'Invalid Firstname: Supply a valid firstName');
    });
  });
});

describe('API endpoint for POST auth/signup - Lastname Validations', () => {
  it('should return an error if lastName field is null', () => {
    const user = signupFactory.build({
      password: 'opeyemi20*',
      lastName: null
    });
    chai.request(url)
    .post('/api/v1/auth/signup')
    .send(user)
    .then((res) => {
      expect(res).to.have.status(400);
      expect(res.body).to.be.an('Object');
      expect(res.body.msg).to.be.equals('Lastname must be supplied');
    });
  });

  it('should register a user with a valid lastName', () => {
    const user = signupFactory.build({
      password: 'opeyemi20*',
    });
    chai.request(url)
    .post('/api/v1/auth/signup')
    .send(user)
    .then((res) => {
      expect(res).to.have.status(200);
      expect(res.body).to.be.an('Object');
      expect(res.body.msg).to.be.equals('User created successfully');
    });
  });

  it('should return an error if lastName is a number', () => {
    const user = signupFactory.build({
      password: 'opeyemi20*',
      lastName: '5678987654'
    });
    chai.request(url)
    .post('/api/v1/auth/signup')
    .send(user)
    .then((res) => {
      expect(res).to.have.status(400);
      expect(res.body).to.be.an('Object');
      expect(res.body.msg).to.be.equals(
        'Invalid Lastname: Supply a valid lastName');
    });
  });
});

describe('API endpoint for POST auth/signup - UserName Validations', () => {
  it('should register a user with a valid userName', () => {
    const user = signupFactory.build({
      email: 'danielopeyemi2018@gmail.com',
      userName: 'danielshow',
      password: 'opeyemi20q8*'
    });
    chai.request(url)
    .post('/api/v1/auth/signup')
    .send(user)
    .then((res) => {
      expect(res).to.have.status(200);
      expect(res.body).to.be.an('Object');
      expect(res.body.msg).to.be.equals('User created successfully');
    });
  });

  it('should return an error if userName field is null', () => {
    const user = signupFactory.build({
      password: 'opeyemi20*',
      userName: null
    });
    chai.request(url)
    .post('/api/v1/auth/signup')
    .send(user)
    .then((res) => {
      expect(res).to.have.status(400);
      expect(res.body).to.be.an('Object');
      expect(res.body.msg).to.be.equals('Username must be supplied');
    });
  });

  it('should return an error if userName is invalid', () => {
    const user = signupFactory.build({
      password: 'opeyemi20*',
      userName: 'gddggd dgtdg'
    });
    chai.request(url)
    .post('/api/v1/auth/signup')
    .send(user)
    .then((res) => {
      expect(res).to.have.status(400);
      expect(res.body).to.be.an('Object');
      expect(res.body.msg).to.be.equals(
        'Invalid Username: supply a valid userName');
    });
  });

  it('should fail if userName length is less than 3', () => {
    const user = signupFactory.build({
      password: 'opeyemi20*',
      userName: 'gd'
    });
    chai.request(url)
    .post('/api/v1/auth/signup')
    .send(user)
    .then((res) => {
      expect(res).to.have.status(400);
      expect(res.body).to.be.an('Object');
      expect(res.body.msg).to.be.equals(
        'Invalid Username: Username length must not be less than 3');
    });
  });

  it('should fail if userName already exists', () => {
    const user = signupFactory.build({
      userName: 'danielshow',
      password: 'opeyebheh223#'
    });
    chai.request(url)
    .post('/api/v1/auth/signup')
    .send(user)
    .then((res) => {
      expect(res).to.have.status(400);
      expect(res.body).to.be.an('Object');
      expect(res.body.msg).to.be.equals('Username already exist, Try another');
    });
  });
});
