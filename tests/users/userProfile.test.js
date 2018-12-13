import chaiHttp from 'chai-http';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import url from '../../server/index';
import signupFactory from '../mocks/factories/userFactory';
import userProfileFactory from '../mocks/factories/userProfileFactory';
import userProfile from '../../server/controllers/userProfileController';
import models from '../../server/models';

chai.should();
chai.use(chaiHttp);
chai.use(sinonChai);

const { Profile } = models;

let userId;
const fakeId = '14dd13b2-981c-490d-879c-71edaf5d674d';
let token;


describe('API endpoint for user pofile', () => {
  const user = signupFactory.build({
    email: 'mikolo@gmail.com',
    password: 'password123*',
  });

  before(async () => {
    await chai.request(url)
      .post('/api/v1/auth/signup')
      .send(user)
      .then(res => {
        token = res.body.token;
        userId = res.body.user.id;
      });
  });

  it('should update a user profile',  (done) => {
    const userData = userProfileFactory.build({
      userId: userId,
    });
    chai.request(url)
      .put('/api/v1/user/profile/')
      .set('Authorization', `Bearer ${token}`)
      .send(userData)
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('Object');
        expect(res.body.message).to.be.equals('Updated profile successfully');
        done();
      });
  });

  it('should return user not found', (done) => {
    const userData = userProfileFactory.build({
      userId: fakeId,
      bio: 'lorem ipsum'
    });
    chai.request(url)
      .put('/api/v1/user/profile/')
      .set('Authorization', `Bearer ${token}`)
      .send(userData)
      .then((res) => {
        expect(res).to.have.status(404);
        expect(res.body.message).to.be.equals('User not found');
        done();
      });
  });

  it('should get a login user profile', (done) => {
    const userData = userProfileFactory.build({
      userId: userId,
    });
      chai.request(url)
      .get('/api/v1/user/profile/')
      .set('Authorization', `Bearer ${token}`)
      .send(userData)
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('Object');
        expect(res.body.message).to.be.equals('Retrieved profile successfully');
        done();
      });
  });

  it('should return login user not found', (done) => {
    const userData = userProfileFactory.build({
      userId: fakeId,
    });
    chai.request(url)
      .get('/api/v1/user/profile/')
      .set('Authorization', `Bearer ${token}`)
      .send(userData)
      .then((res) => {
        expect(res).to.have.status(404);
        expect(res.body.message).to.be.equals('User not found');
        done();
      });
  });


  it('should get any user profile', (done) => {
    chai.request(url)
      .get(`/api/v1/user/profile/${userId}`)
      .set('Authorization', `Bearer ${token}`)
      .send()
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('Object');
        expect(res.body.message).to.be.equals('Retrieved profile successfully');
        done();
      });
  });


  it('should return user not found', (done) => {
    chai.request(url)
      .get(`/api/v1/user/profile/${fakeId}`)
      .set('Authorization', `Bearer ${token}`)
      .send()
      .then((res) => {
        expect(res).to.have.status(404);
        expect(res).to.have.status(404);
        expect(res.body.message).to.be.equals('User not found');
        done();
      });
  });


  it('should fake error', async () => {
    const req = {
      body: {
        id: 1
      }
    };

    const res = {};
    const next = sinon.stub();

    sinon.stub(Profile, 'findOne').throws();

    await userProfile.updateUserProfile(req, res, next);

    expect(next.calledOnce).to.be.true;
    sinon.restore();
  });

  it('should fake error', async () => {
    const req = {
      body: {
        id: 1
      }
    };

    const res = {};
    const next = sinon.stub();

    sinon.stub(Profile, 'findOne').throws();

    await userProfile.getLoginUser(req, res, next);

    expect(next.calledOnce).to.be.true;
    sinon.restore();
  });

});
