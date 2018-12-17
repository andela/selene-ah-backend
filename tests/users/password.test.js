import chaiHttp from 'chai-http';
import chai, { expect } from 'chai';
import url from '../../server/index';
import signupFactory from '../mocks/factories/userFactory';

chai.use(chaiHttp);
describe('API endpoint for POST auth/signup - Password Validations', () => {
  it('should register a user with a valid password', async () => {
    const user = signupFactory.build({
      password: 'danielshow1#',
      userName: 'opeyeyeemib456'
    });
    const res = await chai.request(url)
    .post('/api/v1/auth/signup')
    .send(user);
    expect(res).to.have.status(200);
    expect(res.body).to.be.an('Object');
    expect(res.body.msg).to.be.equals('User created successfully');
  });

  it('should fail if password field is empty', async () => {
    const user = signupFactory.build({
      password: null
    });
    const res = await chai.request(url)
    .post('/api/v1/auth/signup')
    .send(user);
    expect(res).to.have.status(400);
    expect(res.body).to.be.an('Object');
    expect(res.body.msg).to.be.equals('Password field cannot be empty');
  });

  it('should fail for invalid password', async () => {
    const user = signupFactory.build({
      password: 'hfhfjfbhfhfjhfhkf'
    });
    const res = await chai.request(url)
    .post('/api/v1/auth/signup')
    .send(user);
    expect(res).to.have.status(400);
    expect(res.body).to.be.an('Object');
    expect(res.body.msg).to.be.equals(
      'Invalid Password: Password must contains a number and a symbol');
  });

  it('should fail for invalid password', async () => {
    const user = signupFactory.build({
      password: 'hfhfjfbhf   hfjhfhkf'
    });
    const res = await chai.request(url)
    .post('/api/v1/auth/signup')
    .send(user);
    expect(res).to.have.status(400);
    expect(res.body).to.be.an('Object');
    expect(res.body.msg).to.be.equals(
      'Invalid Password: Password must contains a number and a symbol');
  });

  it('should fail if password length is less than 8', async () => {
    const user = signupFactory.build({
      password: 'hfhfjf'
    });
    const res = await chai.request(url)
    .post('/api/v1/auth/signup')
    .send(user);
    expect(res).to.have.status(400);
    expect(res.body).to.be.an('Object');
    expect(res.body.msg).to.be.equals(
      'Password must not be less than 8 characters');
  });
});
