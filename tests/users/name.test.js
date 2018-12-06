import chaiHttp from 'chai-http';
import chai, { expect } from 'chai';
import url from '../../server/index';
import truncate from '../truncate';
import testFile from '../../server/seeders/user';

const userObject = testFile.testName;

chai.use(chaiHttp);
describe('API endpoint for POST auth/signup - Name Validations', () => {
  before(async () => {
    await truncate();
  });

  after(async () => {
    await truncate();
  });

  it('should register a user with a correct firstname', () => chai.request(url)
    .post('/api/v1/auth/signup')
    .send(userObject.users1)
    .then((res) => {
      expect(res).to.have.status(200);
      expect(res.body).to.be.an('Object');
      expect(res.body.msg).to.be.equals('User created successfully');
    }));

  it('Invalid route should give 404', () => chai.request(url)
    .get('/api/v1/au')
    .then((res) => {
      expect(res).to.have.status(404);
      expect(res.body).to.be.an('Object');
      expect(res.body.errors.message).to.be.equals('Not Found');
    }));

  it('should gives an error if firstname field is null', () => chai.request(url)
    .post('/api/v1/auth/signup')
    .send(userObject.users2)
    .then((res) => {
      expect(res).to.have.status(400);
      expect(res.body).to.be.an('Object');
      expect(res.body.msg).to.be.equals('Firstname must be supplied');
    }));

  it('should gives an error if firstname is a number', () => chai.request(url)
    .post('/api/v1/auth/signup')
    .send(userObject.users2_5)
    .then((res) => {
      expect(res).to.have.status(400);
      expect(res.body).to.be.an('Object');
      expect(res.body.msg).to.be.equals(
        'Invalid Firstname: Supply a valid firstname');
    }));
});

describe('API endpoint for POST auth/signup - Lastname Validations', () => {
  before(async () => {
    await truncate();
  });

  after(async () => {
    await truncate();
  });

  it('should register a user with a valid lastname', () => chai.request(url)
    .post('/api/v1/auth/signup')
    .send(userObject.users3)
    .then((res) => {
      expect(res).to.have.status(200);
      expect(res.body).to.be.an('Object');
      expect(res.body.msg).to.be.equals('User created successfully');
    }));

  it('should gives an error if lastname field is null', () => chai.request(url)
    .post('/api/v1/auth/signup')
    .send(userObject.users4)
    .then((res) => {
      expect(res).to.have.status(400);
      expect(res.body).to.be.an('Object');
      expect(res.body.msg).to.be.equals('Lastname must be supplied');
    }));

  it('should gives an error if lastname is a number', () => chai.request(url)
    .post('/api/v1/auth/signup')
    .send(userObject.users5)
    .then((res) => {
      expect(res).to.have.status(400);
      expect(res.body).to.be.an('Object');
      expect(res.body.msg).to.be.equals(
        'Invalid Lastname: Supply a valid lastname');
    }));
});

describe('API endpoint for POST auth/signup - UserName Validations', () => {
  before(async () => {
    await truncate();
  });

  after(async () => {
    await truncate();
  });

  it('should register a user with a valid username', () => chai.request(url)
    .post('/api/v1/auth/signup')
    .send(userObject.users6)
    .then((res) => {
      expect(res).to.have.status(200);
      expect(res.body).to.be.an('Object');
      expect(res.body.msg).to.be.equals('User created successfully');
    }));

  it('should gives an error if username field is null', () => chai.request(url)
    .post('/api/v1/auth/signup')
    .send(userObject.users7)
    .then((res) => {
      expect(res).to.have.status(400);
      expect(res.body).to.be.an('Object');
      expect(res.body.msg).to.be.equals('Username must be supplied');
    }));

  it('should gives error if username is invalid', () => chai.request(url)
    .post('/api/v1/auth/signup')
    .send(userObject.users8)
    .then((res) => {
      expect(res).to.have.status(400);
      expect(res.body).to.be.an('Object');
      expect(res.body.msg).to.be.equals(
        'Invalid Username: supply a valid username');
    }));

  it('should gives error if username is less than 3', () => chai.request(url)
    .post('/api/v1/auth/signup')
    .send(userObject.users9)
    .then((res) => {
      expect(res).to.have.status(400);
      expect(res.body).to.be.an('Object');
      expect(res.body.msg).to.be.equals(
        'Invalid Username: Username length must not be less than 3');
    }));

  it('should give error if username already exists', () => chai.request(url)
    .post('/api/v1/auth/signup')
    .send(userObject.users10)
    .then((res) => {
      expect(res).to.have.status(400);
      expect(res.body).to.be.an('Object');
      expect(res.body.msg).to.be.equals('Username already exist, Try another');
    }));
});
