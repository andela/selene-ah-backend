import chaiHttp from 'chai-http';
import chai, { expect } from 'chai';
import url from '../../server/index';
import signupFactory from '../mocks/factories/userFactory';

chai.use(chaiHttp);
describe('API endpoint for POST auth/signup - Password Validations', () => {
  it('should register a user with a valid password', () => {
    const user = signupFactory.build({
      password: 'danielshow1#'
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

  it('should fail if password field is empty', () => {
    const user = signupFactory.build({
      password: null
    });
    chai.request(url)
    .post('/api/v1/auth/signup')
    .send(user)
    .then((res) => {
      expect(res).to.have.status(400);
      expect(res.body).to.be.an('Object');
      expect(res.body.msg).to.be.equals('Password field cannot be empty');
    });
  });

  it('should fail for invalid password', () => {
    const user = signupFactory.build({
      password: 'hfhfjfbhfhfjhfhkf'
    });
    chai.request(url)
    .post('/api/v1/auth/signup')
    .send(user)
    .then((res) => {
      expect(res).to.have.status(400);
      expect(res.body).to.be.an('Object');
      expect(res.body.msg).to.be.equals(
        'Invalid Password: Password must contains a number and a symbol');
    });
  });

  it('should fail for invalid password', () => {
    const user = signupFactory.build({
      password: 'hfhfjfbhf   hfjhfhkf'
    });
    chai.request(url)
    .post('/api/v1/auth/signup')
    .send(user)
    .then((res) => {
      expect(res).to.have.status(400);
      expect(res.body).to.be.an('Object');
      expect(res.body.msg).to.be.equals(
        'Invalid Password: Password must contains a number and a symbol');
    });
  });

  it('should fail if password length is less than 8', () => {
    const user = signupFactory.build({
      password: 'hfhfjf'
    });
    chai.request(url)
    .post('/api/v1/auth/signup')
    .send(user)
    .then((res) => {
      expect(res).to.have.status(400);
      expect(res.body).to.be.an('Object');
      expect(res.body.msg).to.be.equals(
        'Password must not be less than 8 characters');
    });
  });
});
