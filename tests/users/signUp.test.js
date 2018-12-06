import chaiHttp from 'chai-http';
import chai, { expect } from 'chai';
import url from '../../server/index';
import truncate from '../truncate';
import testFile from '../../server/seeders/user';

chai.use(chaiHttp);

const userObject = testFile.signUpTest;
describe('API endpoint for POST auth/signup - Email Validations', () => {
  before(async () => {
    await truncate();
  });

  after(async () => {
    await truncate();
  });

  it('should register a user with a correct email', () => chai.request(url)
    .post('/api/v1/auth/signup')
    .send(userObject.users1)
    .then((res) => {
      expect(res).to.have.status(200);
      expect(res.body).to.be.an('Object');
      expect(res.body.msg).to.be.equals('User created successfully');
    }));

  it('should gives error if email field is empty', () => chai.request(url)
    .post('/api/v1/auth/signup')
    .send(userObject.users2)
    .then((res) => {
      expect(res).to.have.status(400);
      expect(res.body).to.be.an('Object');
      expect(res.body.msg).to.be.equals('Email field cannot be empty');
    }));

  it('should gives error if user supply invalid email', () => chai.request(url)
    .post('/api/v1/auth/signup')
    .send(userObject.users3)
    .then((res) => {
      expect(res).to.have.status(400);
      expect(res.body).to.be.an('Object');
      expect(res.body.msg).to.be.equals('Invalid Email: supply a valid email');
    }));

  it('should give error if a duplicate email is found', () => chai.request(url)
    .post('/api/v1/auth/signup')
    .send(userObject.users1)
    .then((res) => {
      expect(res).to.have.status(400);
      expect(res.body).to.be.an('Object');
      expect(res.body.msg).to.be.equals('Email already exist, Login');
    }));
});


