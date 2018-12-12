import chaiHttp from 'chai-http';
import chai, { expect } from 'chai';
import url from '../../server/index';
import signupFactory from '../mocks/factories/userFactory';
import userProfileFactory from '../mocks/factories/userProfileFactory';

chai.use(chaiHttp);

let userId;
const fakeId = '14dd13b2-981c-490d-879c-71edaf5d674d';
const wrongUUID = '14dd13b2-981c-490d-879c-71edaf5d674doiii';
let token;


describe('API endpoint for user pofile', () => {
  const user = signupFactory.build({
    email: 'mike@gmail.com',
    password: 'password123*'
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

  it('should update a user profile', async () => {
    const userProfile = userProfileFactory.build({
      id: userId,
      bio: 'lorem ipsum'
    });
    await chai.request(url)
      .put('/api/v1/user/profile/')
      .set('Authorization', `Bearer ${token}`)
      .send(userProfile)
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('Object');
        expect(res.body.message).to.be.equals('Updated profile successfully');
      });
  });

  it('should return a 500 error', async () => {
    const userProfile = userProfileFactory.build({
      id: wrongUUID,
    });
    await chai.request(url)
      .put('/api/v1/user/profile/')
      .set('Authorization', `Bearer ${token}`)
      .send(userProfile)
      .then((res) => {
        expect(res).to.have.status(500);
      });
  });


  it('should return user not found', async () => {
    const userProfile = userProfileFactory.build({
      id: fakeId,
      bio: 'lorem ipsum'
    });
    await chai.request(url)
      .put('/api/v1/user/profile/')
      .set('Authorization', `Bearer ${token}`)
      .send(userProfile)
      .then((res) => {
        expect(res).to.have.status(404);
        expect(res.body.message).to.be.equals('User not found');
      });
  });

  it('should get a login user profile', async () => {
    const userProfile = userProfileFactory.build({
      userId: userId,
    });
    await chai.request(url)
      .get('/api/v1/user/profile/')
      .set('Authorization', `Bearer ${token}`)
      .send(userProfile)
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('Object');
        expect(res.body.message).to.be.equals('Retrieved profile successfully');
      });
  });

  it('should return login user not found', async () => {
    const userProfile = userProfileFactory.build({
      userId: fakeId,
    });
    await chai.request(url)
      .get('/api/v1/user/profile/')
      .set('Authorization', `Bearer ${token}`)
      .send(userProfile)
      .then((res) => {
        expect(res).to.have.status(404);
        expect(res.body.message).to.be.equals('User not found');
      });
  });

  it('should return a 500 error (login user)', async () => {
    const userProfile = userProfileFactory.build({
      userId: wrongUUID,
    });
    await chai.request(url)
      .get('/api/v1/user/profile/')
      .set('Authorization', `Bearer ${token}`)
      .send(userProfile)
      .then((res) => {
        expect(res).to.have.status(500);
      });
  });

  it('should get any user profile', async () => {
    await chai.request(url)
      .get(`/api/v1/user/profile/${userId}`)
      .set('Authorization', `Bearer ${token}`)
      .send()
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('Object');
        expect(res.body.message).to.be.equals('Retrieved profile successfully');
      });
  });


  it('should return user not found', async () => {
    await chai.request(url)
      .get(`/api/v1/user/profile/${fakeId}`)
      .set('Authorization', `Bearer ${token}`)
      .send()
      .then((res) => {
        expect(res).to.have.status(404);
        expect(res).to.have.status(404);
        expect(res.body.message).to.be.equals('User not found');
      });
  });

  it('should update a 500 erro', async () => {
    await chai.request(url)
      .get(`/api/v1/user/profile/${wrongUUID}`)
      .set('Authorization', `Bearer ${token}`)
      .send()
      .then((res) => {
        expect(res).to.have.status(500);
      });
  });
});
