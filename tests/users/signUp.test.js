import chaiHttp from 'chai-http';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chai, { expect, should } from 'chai';
import server from '../../server/index';
import signupFactory from '../mocks/factories/userFactory';
import models from '../../server/models';
import userController from '../../server/controllers/auth/userAuth';
import JWTHelper from '../../server/helpers/JWTHelper';
import sendEmail from '../../server/helpers/sendEmail';



chai.use(chaiHttp);
chai.use(sinonChai);
const { User } = models;
let userDetails;
let expiredToken;

should();


describe('API endpoint for POST auth/signup - Email Validations', () => {
  afterEach(() => sinon.restore());
  it('should register a user with a correct email', async () => {
    const user = signupFactory.build({
      email: 'opeyemidaniel@gmail.com',
      password: 'password123*'
    });
    await chai.request(server)
      .post('/api/v1/auth/signup')
      .send(user)
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('Object');
        expect(res.body.msg).to.be.equals('User created successfully');
         userDetails = { ...res.body };
         expiredToken = JWTHelper.generateToken(userDetails.user, '0.2s');
      });
  });

  it('should fail if email field is empty', async () => {
    const user = signupFactory.build({
      email: null
    });
    chai.request(server)
      .post('/api/v1/auth/signup')
      .send(user)
      .then((res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('Object');
        expect(res.body.msg).to.be.equals('Email field cannot be empty');
      });
  });

  it('should fail if user supply invalid email', (done) => {
    const user = signupFactory.build({
      email: 'danieiopeyey@djjdd'
    });
    chai.request(server)
      .post('/api/v1/auth/signup')
      .send(user)
      .then((res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('Object');
        expect(res.body.msg).to.be
          .equals('Invalid Email: supply a valid email');
          done();
      });
  });

  it('should fail if a duplicate email is found', () => {
    const user = signupFactory.build({
      email: 'opeyemidaniel@gmail.com'
    });
    chai.request(server)
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
    const req = {
      body: user
    };

    const res = {};
    const next = sinon.stub();

    sinon.stub(User, 'create').throws();
    await userController.signupUser(req, res, next);
    expect(next.called).to.be.true;
    sinon.restore();
  });
});


describe('Email Verification', () => {


  it('should verify the email address of a user', async () => {
    const { token, user: { email } } = userDetails;
    await chai.request(server)
    .get(`/api/v1/auth/verifyemail?token=${token}&email=${email}`)
    .then(res => {
      expect(res).to.have.status(200);
      expect(res.body).to.be.an('Object');
      expect(res.body.msg).to.be.equals('Email successfully confirmed');
    });
  });

  context('###', (done) => {
        it('should send email to a user with an expired token',  () => {
          const { user: { email } } = userDetails;
          const req = {
            query: {
              token: expiredToken,
              email: email
            }
           };
           const res = {
              status() {
                return this;
              },
              json(obj) {
                return obj;
              }
           };
          chai.request(server)
          .get(`/api/v1/auth/verifyemail?token=${expiredToken}&email=${email}`)
          .then(() => {
            const sendEmailStub = sinon.stub(sendEmail).returns([]);
            sinon.stub(JWTHelper, 'verifyToken').returns(true);
            sinon.stub(User, 'findOne').returns({});
            sinon.stub(JWTHelper, 'generateToken').returns({});
            const next = sinon.stub();
            userController.verifyEmail(req, res, next);
            sendEmailStub.should.have.called;
            done();
        });
      });
    });



  describe('###Fake JWT helper', async () => {
    const req = {
      query: 'jdjdnjndjjdnjd'
    };
    const res = {};
    const next = sinon.stub();

    sinon.stub(JWTHelper, 'verifyToken').throws();

    await(userController.verifyEmail(req, res, next));
    expect(next.called).to.be.true;
    sinon.restore();
  });
});
