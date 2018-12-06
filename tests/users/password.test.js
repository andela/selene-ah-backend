import chaiHttp from 'chai-http';
import chai, { expect } from 'chai';
import url from '../../server/index';
import truncate from '../truncate';
import testFile from '../../server/seeders/user';

const userObject = testFile.passwordTest;
chai.use(chaiHttp);
describe('API endpoint for POST auth/signup - Password Validations', () => {
  before(async () => {
    await truncate();
  });

  after(async () => {
    await truncate();
  });

  it('should register a user with a correct password', () => chai.request(url)
    .post('/api/v1/auth/signup')
    .send(userObject.users1)
    .then((res) => {
      expect(res).to.have.status(200);
      expect(res.body).to.be.an('Object');
      expect(res.body.msg).to.be.equals('User created successfully');
    }));

  it('should gives an error if password field is empty', () => chai.request(url)
    .post('/api/v1/auth/signup')
    .send(userObject.users2)
    .then((res) => {
      expect(res).to.have.status(400);
      expect(res.body).to.be.an('Object');
      expect(res.body.msg).to.be.equals('Password field cannot be empty');
    }));

  it('should gives error for invalid password', () => chai.request(url)
    .post('/api/v1/auth/signup')
    .send(userObject.users3)
    .then((res) => {
      expect(res).to.have.status(400);
      expect(res.body).to.be.an('Object');
      expect(res.body.msg).to.be.equals(
        'Invalid Password: Password must contains a number and a symbol');
    }));

  it('should give error for invalid password', () => chai.request(url)
    .post('/api/v1/auth/signup')
    .send(userObject.users4)
    .then((res) => {
      expect(res).to.have.status(400);
      expect(res.body).to.be.an('Object');
      expect(res.body.msg).to.be.equals(
        'Invalid Password: Password must contains a number and a symbol');
    }));

  it('should give error if password is less than 8', () => chai.request(url)
    .post('/api/v1/auth/signup')
    .send(userObject.users5)
    .then((res) => {
      expect(res).to.have.status(400);
      expect(res.body).to.be.an('Object');
      expect(res.body.msg).to.be.equals(
        'Password must not be less than 8 characters');
    }));
});


