import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import server from '../../server/index';
import userFactory from '../mocks/factories/userFactory';
import models from '../../server/models';
import userAuthentication from '../../server/middlewares/userAuthentication';
import followerController from '../../server/controllers/followersController';

chai.use(chaiHttp);

const { User, Follower } = models;
const user1 = userFactory.build({
  password: 'opeyemi2018*'
});
let id1,id2,token;
const invalidId = '98165dce-2eb3-4e28-b4e2-3ce373a2cd6e';

const user2 = userFactory.build({
  password: 'opeyemi2318*'
});

describe('GET /follow Route', () => {
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


  it('should return error is followerId is not supplied or null', async () => {
    await chai.request(server)
    .post('/api/v1/follow')
    .send({followerId: null})
    .set('Authorization', `Bearer ${token}`)
    .then((res) => {
      expect(res).to.have.status(400);
      expect(res.body).to.be.an('object');
      expect(res.body.message).to.be.equal(
        'Bad Request: followerId must be supplied');
    });
  });

  it('should give error is an invalid UUID is supplied', async () => {
    await chai.request(server)
    .post('/api/v1/follow')
    .send({followerId: 'dhdhhdh-dhhdd'})
    .set('Authorization', `Bearer ${token}`)
    .then((res) => {
      expect(res).to.have.status(400);
      expect(res.body).to.be.an('object');
      expect(res.body.message).to.be.equal('Invalid UUID');
    });
  });

  it('should give error if user does not exist', async () => {
    await chai.request(server)
    .post('/api/v1/follow')
    .send({followerId: invalidId})
    .set('Authorization', `Bearer ${token}`)
    .then((res) => {
      expect(res).to.have.status(400);
      expect(res.body).to.be.an('object');
      expect(res.body.message).to.be.equal('Bad Request: User does not exist');
    });
  });

  it('should give error if user want to follow him/herself', async () => {
    await chai.request(server)
    .post('/api/v1/follow')
    .send({followerId: id1})
    .set('Authorization', `Bearer ${token}`)
    .then((res) => {
      expect(res).to.have.status(400);
      expect(res.body).to.be.an('object');
      expect(res.body.message).to.be.equal('You can\'t follow yourself');
    });
  });

  it('should give error if user has been followed', async () => {
    await chai.request(server)
    .post('/api/v1/follow')
    .send({followerId: id2})
    .set('Authorization', `Bearer ${token}`)
    .then((res) => {
      expect(res).to.have.status(400);
      expect(res.body).to.be.an('object');
      expect(res.body.message).to.be.equal(
        'You\'ve already followed this user');
    });
  });

  it('should fake doesUserExist middleware', async () => {
    const req= {};
    const res = {};
    const next = sinon.stub();
    sinon.stub(User, 'findOne').throws();

    await userAuthentication.doesUserExist(req, res, next);
    expect(next.called).to.be.true;
    sinon.restore();
  });

  it('should fake isFollowingUser middleware', async () => {
    const req= {};
    const res = {};
    const next = sinon.stub();
    sinon.stub(User, 'findOne').throws();

    await userAuthentication.isFollowingUser(req, res, next);
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
    await chai.request(server)
    .delete(`/api/v1/unfollow/${id1}`)
    .then((res) => {
      expect(res).to.have.status(401);
      expect(res.body).to.be.an('object');
      expect(res.body.msg).to.be.equal(
        'Authentication failed: Please supply a valid token.');
    });
  });

  it('should unfollow a user if authenticated', async () => {
    await chai.request(server)
    .delete(`/api/v1/unfollow/${id2}`)
    .set('Authorization', `Bearer ${token}`)
    .then((res) => {
      expect(res).to.have.status(200);
      expect(res.body).to.be.an('object');
      expect(res.body.message).to.be.equal('You\'ve unfollow this User');
    });
  });

  it('should give error is an invalid UUID is supplied', async () => {
    await chai.request(server)
    .delete('/api/v1/unfollow/dgdgdvd-1771')
    .set('Authorization', `Bearer ${token}`)
    .then((res) => {
      expect(res).to.have.status(400);
      expect(res.body).to.be.an('object');
      expect(res.body.message).to.be.equal('Invalid UUID');
    });
  });

  it('should give error if user does not exist', async () => {
    await chai.request(server)
    .delete(`/api/v1/unfollow/${invalidId}`)
    .set('Authorization', `Bearer ${token}`)
    .then((res) => {
      expect(res).to.have.status(400);
      expect(res.body).to.be.an('object');
      expect(res.body.message).to.be.equal('Bad Request: User does not exist');
    });
  });

  it('should give a descriptive message if user is not followed', async () => {
    await chai.request(server)
    .delete(`/api/v1/unfollow/${id2}`)
    .set('Authorization', `Bearer ${token}`)
    .then((res) => {
      expect(res).to.have.status(400);
      expect(res.body).to.be.an('object');
      expect(res.body.message).to.be.equal('You are not following this User');
    });
  });

  it('should fake isNotFollowingUser middleware', async () => {
    const req= {};
    const res = {};
    const next = sinon.stub();
    sinon.stub(User, 'findOne').throws();

    await userAuthentication.isNotFollowingUser(req, res, next);
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
