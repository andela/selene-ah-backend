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
  password: 'opeyemi2018*'
});
let id1,id2,token,token2;

const user2 = userFactory.build({
  password: 'opeyemi2318*'
});

describe('GET /followers Route', () => {
  before(async () => {
    await chai.request(server)
    .post('/api/v1/auth/signup')
    .send(user1)
    .then(res => {
      id1 = res.body.user.id;
      token = res.body.token;
    });

    await chai.request(server)
    .post('/api/v1/auth/signup')
    .send(user2)
    .then(res => {
      id2 = res.body.user.id;
      token2 = res.body.token;
    });
  });

  it('should return error if a user is unauthenticated', async () => {
    await chai.request(server)
    .post('/api/v1/follow')
    .send({followerId: id1})
    .then((res) => {
      expect(res).to.have.status(401);
      expect(res.body).to.be.an('object');
      expect(res.body.msg).to.be.equal(
        'Authentication failed: Please supply a valid token.');
    });
  });

  it('should follow a user if authenticated', async () => {
    await chai.request(server)
    .post('/api/v1/follow')
    .send({followerId: id2})
    .set('Authorization', `Bearer ${token}`)
    .then((res) => {
      expect(res).to.have.status(200);
      expect(res.body).to.be.an('object');
      expect(res.body.message).to.be.equal('Follow successful');
    });
  });

  it('should return all followed user', async () => {
    await chai.request(server)
    .get('/api/v1/followers')
    .set('Authorization', `Bearer ${token}`)
    .then((res) => {
      expect(res).to.have.status(200);
      expect(res.body).to.be.an('object');
      expect(res.body.message).to.be.equal('Followers returned successfully');
      expect(res.body.followers.length).to.be.equal(1);
    });
  });

  it('should give a descriptive message if follower is not found', async () => {
      await chai.request(server)
      .get('/api/v1/followers')
      .set('Authorization', `Bearer ${token2}`)
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body.message).to.be.equal('No followers found');
      });
  });
});

describe('GET /followers/:id', () => {
  it('should give a descriptive message if follower is not found', async () => {
    await chai.request(server)
    .get(`/api/v1/followers/${id2}`)
    .set('Authorization', `Bearer ${token}`)
    .then((res) => {
      expect(res).to.have.status(200);
      expect(res.body).to.be.an('object');
      expect(res.body.message).to.be.equal('No followers found');
    });
  });

  it('should return followers if a user is authenticated', async () => {
    await chai.request(server)
    .get(`/api/v1/followers/${id1}`)
    .set('Authorization', `Bearer ${token}`)
    .then((res) => {
      expect(res).to.have.status(200);
      expect(res.body).to.be.an('object');
      expect(res.body.message).to.be.equal('Followers returned successfully');
      expect(res.body.followers.length).to.be.greaterThan(0);
    });
  });

  it('should give error if an invalid UUID is supplied', async () => {
    await chai.request(server)
    .get('/api/v1/followers/dgdgdvd-1771')
    .set('Authorization', `Bearer ${token}`)
    .then((res) => {
      expect(res).to.have.status(400);
      expect(res.body).to.be.an('object');
      expect(res.body.message).to.be.equal('Invalid UUID');
    });
  });

  it('Fake test: Mock error in getFollowers', async () => {
    const req = {};
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
    await chai.request(server)
    .get('/api/v1/followees')
    .set('Authorization', `Bearer ${token2}`)
    .then((res) => {
      expect(res).to.have.status(200);
      expect(res.body).to.be.an('object');
      expect(res.body.message).to.be.equal('Followees returned successfully');
    });
  });

  it('should return no followers if user has none', async () => {
    await chai.request(server)
    .get('/api/v1/followees')
    .set('Authorization', `Bearer ${token}`)
    .then((res) => {
      expect(res).to.have.status(200);
      expect(res.body).to.be.an('object');
      expect(res.body.message).to.be.equal('No followers found');
    });
  });

  it('Fake test: Mock error in getFollowees', async () => {
    const req = {};
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
    await chai.request(server)
    .get(`/api/v1/followees/${id1}`)
    .set('Authorization', `Bearer ${token}`)
    .then((res) => {
      expect(res).to.have.status(200);
      expect(res.body).to.be.an('object');
      expect(res.body.message).to.be.equal('No followers found');
    });
  });
});
