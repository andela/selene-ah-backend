import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import server from '../../server/index';
import userFactory from '../mocks/factories/userFactory';
import models from '../../server/models';
import followerController from '../../server/controllers/followersController';

chai.use(chaiHttp);

const { Follower } = models;
const user1 = userFactory.build({
  userName: 'gbolsgbols',
  password: 'opeyemi2018*'
});
let id1,id2,token,token2;

const user2 = userFactory.build({
  userName: 'gbolsgbolahan',
  password: 'opeyemi2318*'
});

describe('GET /followers Route', () => {
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
      token2 = response.body.token;
  });

  it('should return error if a user is unauthenticated', async () => {
    const res = await chai.request(server)
    .post('/api/v1/follow')
    .send({followerId: id1});
    expect(res).to.have.status(401);
    expect(res.body).to.be.an('object');
    expect(res.body.msg).to.be.equal(
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

  it('should return all followed user', async () => {
    const res = await chai.request(server)
    .get('/api/v1/followers')
    .set('Authorization', `Bearer ${token}`);
    expect(res).to.have.status(200);
    expect(res.body).to.be.an('object');
    expect(res.body.message).to.be.equal('Followers returned successfully');
    expect(res.body.followers.length).to.be.equal(1);
  });

  it('should give a descriptive message if follower is not found', async () => {
      const res = await chai.request(server)
      .get('/api/v1/followers')
      .set('Authorization', `Bearer ${token2}`);
      expect(res).to.have.status(200);
      expect(res.body).to.be.an('object');
      expect(res.body.message).to.be.equal('No followers found');
  });
});

describe('GET /followers/:id', () => {
  it('should give a descriptive message if follower is not found', async () => {
    const res = await chai.request(server)
    .get(`/api/v1/followers/${id2}`)
    .set('Authorization', `Bearer ${token}`);
    expect(res).to.have.status(200);
    expect(res.body).to.be.an('object');
    expect(res.body.message).to.be.equal('No followers found');
  });

  it('should return followers if a user is authenticated', async () => {
    const res = await chai.request(server)
    .get(`/api/v1/followers/${id1}`)
    .set('Authorization', `Bearer ${token}`);
    expect(res).to.have.status(200);
    expect(res.body).to.be.an('object');
    expect(res.body.message).to.be.equal('Followers returned successfully');
    expect(res.body.followers.length).to.be.greaterThan(0);
  });

  it('should return followers with length of one', async () => {
    await chai.request(server)
    .get(`/api/v1/followers/${id1}?page=1&limit=1`)
    .set('Authorization', `Bearer ${token}`)
    .then((res) => {
      expect(res).to.have.status(200);
      expect(res.body).to.be.an('object');
      expect(res.body.message).to.be.equal('Followers returned successfully');
      expect(res.body.followers.length).to.be.equals(1);
    });
  });

  it('should return no followers with page equals to 2', async () => {
    await chai.request(server)
    .get(`/api/v1/followers/${id1}?page=2&limit=3`)
    .set('Authorization', `Bearer ${token}`)
    .then((res) => {
      expect(res).to.have.status(200);
      expect(res.body).to.be.an('object');
      expect(res.body.message).to.be.equal('No followers found');
    });
  });


  it('should give error if an invalid UUID is supplied', async () => {
    const res = await chai.request(server)
    .get('/api/v1/followers/dgdgdvd-1771')
    .set('Authorization', `Bearer ${token}`);
    expect(res).to.have.status(400);
    expect(res.body).to.be.an('object');
    expect(res.body.message).to.be.equal('Invalid UUID');
  });

  it('Fake test: Mock error in getFollowers', async () => {
    const req = {
      query: {
        page: 1,
        limit: 2
      }
    };
    const res = {};
    const next = sinon.stub();
    const id=1;

    sinon.stub(Follower, 'findAll').throws();
    await followerController.getFollowers(req, res, next, id);
    expect(next.called).to.be.true;
    sinon.restore();
  });
});

describe('GET /followees Route', () => {

  it('should return all user followers', async () => {
    const res = await chai.request(server)
    .get('/api/v1/followees')
    .set('Authorization', `Bearer ${token2}`);
    expect(res).to.have.status(200);
    expect(res.body).to.be.an('object');
    expect(res.body.message).to.be.equal('Followees returned successfully');
  });

  it('should return no followers if user has none', async () => {
    const res = await chai.request(server)
    .get('/api/v1/followees')
    .set('Authorization', `Bearer ${token}`);
    expect(res).to.have.status(200);
    expect(res.body).to.be.an('object');
    expect(res.body.message).to.be.equal('No followers found');
  });

  it('Fake test: Mock error in getFollowees', async () => {
    const req = {
      query: {
        page: 1,
        query: 2
      }
    };
    const res = {};
    const next = sinon.stub();
    const id=1;

    sinon.stub(Follower, 'findAll').throws();
    await followerController.getFollowees(req, res, next, id);
    expect(next.called).to.be.true;
    sinon.restore();
  });
});

describe('GET /followees/:id Route', () => {
  it('should return another user followers', async () => {
    const res = await chai.request(server)
    .get(`/api/v1/followees/${id1}`)
    .set('Authorization', `Bearer ${token}`);
    expect(res).to.have.status(200);
    expect(res.body).to.be.an('object');
    expect(res.body.message).to.be.equal('No followers found');
  });
});
