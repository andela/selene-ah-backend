import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import server from '../../server/index';
import userFactory from '../mocks/factories/userFactory';
import models from '../../server/models';
import userAuthentication from
  '../../server/middlewares/followersAuthentication';
import followerController from '../../server/controllers/followersController';

chai.use(chaiHttp);

const { User, Follower } = models;
const user1 = userFactory.build({
  firstName: 'estheries',
  username: 'gbolsbabeb',
  password: 'opeyemi2018*'
});
let id1,id2,token;
const invalidId = '98165dce-2eb3-4e28-b4e2-3ce373a2cd6e';

const user2 = userFactory.build({
  firstName: 'davidsongbols',
  userName: 'gbolsbhaah',
  password: 'opeyemi2318*'
});

describe('GET /follow Route', () => {
  before(async () => {
    const res = await chai.request(server)
    .post('/api/v1/auth/signup')
    .send(user1);
    id1 = res.body.user.id;
    token = res.body.token;

    const response = await chai.request(server)
    .post('/api/v1/auth/signup')
    .send(user2);
      id2 = response.body.user.id;
  });

  it('should return error if a user is unauthenticated', async () => {
    const res = await chai.request(server)
    .post('/api/v1/follow')
    .send({followerId: id1});
    expect(res).to.have.status(401);
    expect(res.body).to.be.an('object');
    expect(res.body.message).to.be.equal(
      'Authentication failed: Please supply a valid token.');
  });

  it('should follow a user if authenticated', async () => {
    const res = await chai.request(server)
    .post('/api/v1/follow')
    .send({followerId: id2})
    .set('Authorization', `Bearer ${token}`);
    expect(res).to.have.status(200);
    expect(res.body).to.be.an('object');
    expect(res.body.message).to.be.equal('Follow successful');
  });


  it('should return error if followerId is not supplied or null', async () => {
    const res = await chai.request(server)
    .post('/api/v1/follow')
    .send({followerId: null})
    .set('Authorization', `Bearer ${token}`);
      expect(res).to.have.status(400);
      expect(res.body).to.be.an('object');
      expect(res.body.message).to.be.equal(
        'Bad Request: followerId must be supplied');
  });

  it('should give error is an invalid UUID is supplied', async () => {
    const res = await chai.request(server)
    .post('/api/v1/follow')
    .send({followerId: 'dhdhhdh-dhhdd'})
    .set('Authorization', `Bearer ${token}`);
    expect(res).to.have.status(400);
    expect(res.body).to.be.an('object');
    expect(res.body.message).to.be.equal('Invalid UUID');
  });

  it('should give error if user does not exist', async () => {
    const res = await chai.request(server)
    .post('/api/v1/follow')
    .send({followerId: invalidId})
    .set('Authorization', `Bearer ${token}`);
    expect(res).to.have.status(404);
    expect(res.body).to.be.an('object');
    expect(res.body.message).to.be.equal('User not found');
  });

  it('should give error if user want to follow him/herself', async () => {
    const res = await chai.request(server)
    .post('/api/v1/follow')
    .send({followerId: id1})
    .set('Authorization', `Bearer ${token}`);
    expect(res).to.have.status(400);
    expect(res.body).to.be.an('object');
    expect(res.body.message).to.be.equal('You can\'t follow yourself');
  });

  it('should give error if user has been followed', async () => {
    const res = await chai.request(server)
    .post('/api/v1/follow')
    .send({followerId: id2})
    .set('Authorization', `Bearer ${token}`);
    expect(res).to.have.status(400);
    expect(res.body).to.be.an('object');
    expect(res.body.message).to.be.equal(
      'You\'ve already followed this user');
  });

  it('should fake doesUserExist middleware', async () => {
    const req= {};
    const res = {};
    const next = sinon.stub();
    sinon.stub(User, 'findOne').throws();

    await userAuthentication.checkIfUserExist(req, res, next);
    expect(next.called).to.be.true;
    sinon.restore();
  });

  it('should fake isFollowingUser middleware', async () => {
    const req= {};
    const res = {};
    const next = sinon.stub();
    sinon.stub(User, 'findOne').throws();

    await userAuthentication.checkIfUserIsFollowed(req, res, next);
    expect(next.called).to.be.true;
    sinon.restore();
  });

  it('should fake followAuther controller', async () => {
    const req= {};
    const res = {};
    const next = sinon.stub();
    sinon.stub(Follower, 'create').throws();

    await followerController.followAuthor(req, res, next);
    expect(next.called).to.be.true;
    sinon.restore();
  });
});


describe('GET /unfollow/:id route', () => {
  it('should return error if a user is unauthenticated', async () => {
    const res = await chai.request(server)
    .delete(`/api/v1/unfollow/${id1}`);
    expect(res).to.have.status(401);
    expect(res.body).to.be.an('object');
    expect(res.body.message).to.be.equal(
      'Authentication failed: Please supply a valid token.');
  });

  it('should unfollow a user if authenticated', async () => {
    const res = await chai.request(server)
    .delete(`/api/v1/unfollow/${id2}`)
    .set('Authorization', `Bearer ${token}`);
    expect(res).to.have.status(200);
    expect(res.body).to.be.an('object');
    expect(res.body.message).to.be.equal('You\'ve unfollow this User');
  });

  it('should give error is an invalid UUID is supplied', async () => {
    const res = await chai.request(server)
    .delete('/api/v1/unfollow/dgdgdvd-1771')
    .set('Authorization', `Bearer ${token}`);
    expect(res).to.have.status(400);
    expect(res.body).to.be.an('object');
    expect(res.body.message).to.be.equal('Invalid UUID');
  });

  it('should give error if user does not exist', async () => {
    const res = await chai.request(server)
    .delete(`/api/v1/unfollow/${invalidId}`)
    .set('Authorization', `Bearer ${token}`);
    expect(res).to.have.status(404);
    expect(res.body).to.be.an('object');
    expect(res.body.message).to.be.equal('User not found');
  });

  it('should give a descriptive message if user is not followed', async () => {
    const res = await chai.request(server)
    .delete(`/api/v1/unfollow/${id2}`)
    .set('Authorization', `Bearer ${token}`);
    expect(res).to.have.status(400);
    expect(res.body).to.be.an('object');
    expect(res.body.message).to.be.equal('You are not following this User');
  });

  it('should fake checkIfUserNotFollowed middleware', async () => {
    const req= {};
    const res = {};
    const next = sinon.stub();
    sinon.stub(User, 'findOne').throws();

    await userAuthentication.checkIfUserNotFollowed(req, res, next);
    expect(next.called).to.be.true;
    sinon.restore();
  });

  it('should fake unfollowAuther controller', async () => {
    const req= {};
    const res = {};
    const next = sinon.stub();
    sinon.stub(Follower, 'destroy').throws();

    await followerController.unfollowUser(req, res, next);
    expect(next.called).to.be.true;
    sinon.restore();
  });
});
