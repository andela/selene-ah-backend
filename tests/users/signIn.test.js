import chaiHttp from 'chai-http';
import chai, { expect } from 'chai';
import url from '../../server/index';
import truncate from '../truncate';
import models from '../../server/models';
import valid
  from '../../server/helpers/passwordHash';
import userSeeds from '../../server/seeders/user';

chai.use(chaiHttp);

const { User } = models;
const userObject = userSeeds.signinTest;
describe('API endpoint for POST auth/signin - Email Validations', () => {
  before(async () => {
    await truncate();
  });

  beforeEach(async () => {
    await User.create({
      email: 'opeyemi@yahoo.com',
      firstName: 'Danielshow',
      lastName: 'Opeyemi',
      userName: 'shotonwaa',
      password: valid.hashPassword('danielshow2#')
    });
  });

  afterEach(async () => {
    await truncate();
  });

  after(async () => {
    await truncate();
  });

  it('should fail if password is incorrect', () => chai.request(url)
    .post('/api/v1/auth/signin')
    .send(userObject.users1)
    .then((res) => {
      expect(res).to.have.status(400);
      expect(res.body).to.be.an('Object');
      expect(res.body.msg).to.be.equals('Invalid email or password');
    }));

  it('should fail if email field is empty', () => chai.request(url)
    .post('/api/v1/auth/signin')
    .send(userObject.users2)
    .then((res) => {
      expect(res).to.have.status(400);
      expect(res.body).to.be.an('Object');
      expect(res.body.msg).to.be.equals('Email field cannot be empty');
    }));

  it('should fail if user supply invalid email', () => chai.request(url)
    .post('/api/v1/auth/signin')
    .send(userObject.users3)
    .then((res) => {
      expect(res).to.have.status(400);
      expect(res.body).to.be.an('Object');
      expect(res.body.msg).to.be.equals('Invalid Email: supply a valid email');
    }));

  it('should fail if a password is not supplied', () => chai.request(url)
    .post('/api/v1/auth/signin')
    .send(userObject.users4)
    .then((res) => {
      expect(res).to.have.status(400);
      expect(res.body).to.be.an('Object');
      expect(res.body.msg).to.be.equals('Password field cannot be empty');
    }));

  it('should fail if a password is not valid', () => chai.request(url)
    .post('/api/v1/auth/signin')
    .send(userObject.users5)
    .then((res) => {
      expect(res).to.have.status(400);
      expect(res.body).to.be.an('Object');
      expect(res.body.msg).to.be.equals(
        'Invalid Password: Password must contains a number and a symbol');
    }));

  it('should fail if password is incorrect', () => chai.request(url)
    .post('/api/v1/auth/signin')
    .send(userObject.user7)
    .then((res) => {
      expect(res).to.have.status(400);
      expect(res.body).to.be.an('Object');
      expect(res.body.msg).to.be.equals('Invalid email or password');
    }));

  it('should login with valid email and password', () => chai.request(url)
    .post('/api/v1/auth/signin')
    .send(userObject.user)
    .then((res) => {
      expect(res).to.have.status(200);
      expect(res.body).to.be.an('Object');
      expect(res.body.msg).to.be.equals('Login successful');
    }));
});


