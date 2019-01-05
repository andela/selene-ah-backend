import chaiHttp from 'chai-http';
import sinon from 'sinon';
import chai, { expect } from 'chai';
import models from '../../server/models';
import server from '../../server/index';
import signupFactory from '../mocks/factories/userFactory';
import authController from '../../server/controllers/auth/userAuthController';
import JWTHelper from '../../server/helpers/auth/JWTHelper';
import PasswordValidation
from '../../server/middlewares/validations/passwordValidation';
import { REGULAR } from '../../server/helpers/constants';

const { User } = models;
chai.use(chaiHttp);
let token;
let userDetails;
let expiredToken;

describe('API endpoint for POST Reset password ', () => {
  afterEach(() => sinon.restore());
  it('should register a user with a correct email', async () => {
    const user = signupFactory.build({
      email: 'opeyemiidaniel232323@gmail.com',
      password: 'password123*'
    });
    const res = await chai.request(server)
      .post('/api/v1/auth/signup')
      .send(user);
    expect(res).to.have.status(200);
    expect(res.body).to.be.an('Object');
    expect(res.body.message).to.be.equals('User created successfully');
    userDetails = { ...res.body };
    token = userDetails.token;
    expiredToken = JWTHelper.generateToken(userDetails.user, '0.0s');
  });

  it('should fake catch error for send reset password email', async () => {
    const req = { body: { id: 1 } };
    const res = {};
    const next = sinon.stub();
    sinon.stub(User, 'findOne').throws();
    await authController.sendResetPasswordEmail(req, res, next);
    expect(next.calledOnce).to.be.true;
  });

  it('should fake catch error for send update password', async () => {
    const req = {
      headers: { resetpasswordtoken: token},
      body: { id: 1 }
    };
    const res = {};
    const next = sinon.stub();
    sinon.stub(User, 'update').throws();
    await authController.updateUserPassword(req, res, next);
    expect(next.calledOnce).to.be.true;
  });

  it('should update the user password when given valid data', async () => {
    const userPassword = {
      password: 'danielshow2#',
      confirmPassword: 'danielshow2#'
    };
    const res = await chai.request(server)
      .post('/api/v1/auth/updatepassword')
      .set('resetPasswordToken', token)
      .send(userPassword);
    expect(res).to.have.status(200);
    expect(res.body).to.be.an('Object');
    expect(res.body.message).to.be.equals('Password updated successfully');
  });

  it('should give error when headers token is absent', async () => {
    const userPassword = {
      password: 'danielshow2#',
      confirmPassword: 'danielshow2#'
    };
    const res = await chai.request(server)
      .post('/api/v1/auth/updatepassword')
      .send(userPassword);
    expect(res).to.have.status(400);
    expect(res.body).to.be.an('Object');
    expect(res.body.message).to.be.equals('Reset password token is required');
  });

  it('should fail if a email is not in the database', async () => {
    const user = signupFactory.build({
      password: 'fdghjku',
      email: 'opeyemi@yahhhhoo.com',
      role: REGULAR
    });
    const res = await chai.request(server)
    .post('/api/v1/auth/resetpassword')
    .send(user);
    expect(res).to.have.status(400);
    expect(res.body).to.be.an('Object');
    expect(res.body.message).to.be.equals(
      'Invalid email');
  });

  it('should return error when given an expired headers token', async () => {
    const userData = {
      password: 'danielshow2#',
      confirmPassword: 'danielshow2#'
    };
    const res = await chai.request(server)
      .post('/api/v1/auth/updatepassword')
      .set('resetPasswordToken', expiredToken)
      .send(userData);
    expect(res.body.message)
    .to.be.equals('Invalid Token: Request password token has expire');
  });

  it('should return success when given valid data', async () => {
    const { email } = userDetails.user;
    const userData = { email: email };
    const res = await chai.request(server)
      .post('/api/v1/auth/resetpassword')
      .send(userData);
    expect(res.body.message)
    .to.be.equals('Reset password link has been sent to your email');
  });
  it('should fake error for confimpassword middleware', async () => {
    const req = { body: {password: 'shalayooo', confirmPassword: 'lasdjlkd'}};
    const res = { status() {}, json() {} };
    sinon.stub(res, 'status').returnsThis();
    const next = sinon.stub();
    await PasswordValidation.confirmPassword(req, res, next);
    expect(res.status).to.have.been.calledWith(400);
  });
});
