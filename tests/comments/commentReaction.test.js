import chaiHttp from 'chai-http';
import sinon from 'sinon';
import chai, { expect } from 'chai';

import server from '../../server/index';
import userFactory from '../mocks/factories/userFactory';
import articlesFactory from '../mocks/factories/articlesFactory';
import getRandomCategory from '../../server/helpers/checkCategory';
import commentReactionController from
  '../../server/controllers/CommentReactionController';
import models from '../../server/models';
import ReactionsValidation
  from '../../server/middlewares/validations/ReactionValidation';

const { CommentLikes } = models;
chai.use(chaiHttp);

const firstUser = userFactory.build({
  password: 'Password@1'
});

const secondUser = userFactory.build({
  password: 'Password@1'
});

let firstUserId, firstUserToken, firstArticleId, firstCommentId,
secondUserToken;

describe('Api endpoint for liking a comment', () => {

  afterEach(() => sinon.restore());

  it('should fake addCommentReaction catch error', async () => {
    const req = {
      body: { id: 1 }
    };
    const res = {};
    const next = sinon.stub();
    sinon.stub(CommentLikes, 'findOrCreate').throws();
    await commentReactionController.addOrRemoveCommentReaction(req, res, next);
    expect(next.calledOnce).to.be.true;
  });


describe('Test for Reaction validation middleware', () => {
  afterEach(() => sinon.restore());
  it('should check if reaction is empty or does not exist', () => {
    const req = {
      body: { id: 1 }
    };
    const res = {
      status() {},
      json() {}
    };
    const next = sinon.stub();
    sinon.stub(res, 'status').returnsThis();
    ReactionsValidation.validateCommentReaction(req, res, next);
    expect(res.status).to.have.been.calledWith(400);
  });

  it('should check if reactiontype is wrong', () => {
    const req = {
      body: { reaction: 'wrong' }
    };
    const res = {
      status() {},
      json() {}
    };
    const next = sinon.stub();
    sinon.stub(res, 'status').returnsThis();
    ReactionsValidation.validateCommentReaction(req, res, next);
    expect(res.status).to.have.been.calledWith(400);
  });

  it('should call next if valid reaction is passed', () => {
    const req = {
      body: { reaction: 'like' }
    };
    const res = {
      status() {},
      json() {}
    };
    const next = sinon.stub();
    ReactionsValidation.validateCommentReaction(req, res, next);
    expect(next).to.have.been.called;
  });

  it('should fake addCommentReaction catch error', async () => {
    const req = {
      body: { id: 1 }
    };
    const res = {};
    const next = sinon.stub();
    sinon.stub(CommentLikes, 'findOne').throws();
    await ReactionsValidation.isReactionAlreadyExist(req, res, next);
    expect(next.calledOnce).to.be.true;
  });
});

describe('', () => {
  before(async () => {
    const categoryId = await getRandomCategory();
    const firstUserResponse = await chai.request(server)
      .post('/api/v1/auth/signup')
      .send(firstUser);
    firstUserId = firstUserResponse.body.user.id;
    firstUserToken = firstUserResponse.body.token;


    const secondUserResponse = await chai.request(server)
      .post('/api/v1/auth/signup')
      .send(secondUser);
      secondUserToken = secondUserResponse.body.token;

    const articlesData = articlesFactory.build({
      categoryId: categoryId,
      body: 'Test article for comment',
      title: 'test title',
      firstUserId,
      published: true,
    });
    const firstArticleResponses = await chai.request(server)
      .post('/api/v1/article')
      .set('Authorization', `Bearer ${firstUserToken}`)
      .send(articlesData);
    firstArticleId = firstArticleResponses.body.article.id;

    const commentDetails = {
      content: 'This is a test comment'
    };
    const firstCommentResponse = await chai.request(server)
      .post(`/api/v1/article/${firstArticleId}/comment`)
      .set('Authorization', `Bearer ${secondUserToken}`)
      .send(commentDetails);
    firstCommentId = firstCommentResponse.body.comment.id;
  });

  it('should return success when given like', async () => {
    const ReactionType = {
      reaction: 'like'
    };
    const res = await chai.request(server)
      .post(`/api/v1/comment/${firstCommentId}/commentreaction`)
      .set('Authorization', `Bearer ${firstUserToken}`)
      .send(ReactionType);
    expect(res).to.have.status(201);
    expect(res).to.be.an('Object');
    expect(res.body.message).to.be.equals('Comment liked by user');
  });

  it('should return status as failed when a user already liked', async () => {
    const ReactionType = {
      reaction: 'like'
    };
    const res = await chai.request(server)
      .post(`/api/v1/comment/${firstCommentId}/commentreaction`)
      .set('Authorization', `Bearer ${firstUserToken}`)
      .send(ReactionType);
    expect(res).to.have.status(409);
    expect(res).to.be.an('Object');
    expect(res.body.message).to.be.equals('User already liked this comment');
  });

  it('should return success when user unlike after like', async () => {
    const newReactionType = {
      reaction: 'unlike'
    };
    const res = await chai.request(server)
      .post(`/api/v1/comment/${firstCommentId}/commentreaction`)
      .set('Authorization', `Bearer ${firstUserToken}`)
      .send(newReactionType);
    expect(res).to.have.status(200);
    expect(res).to.be.an('Object');
    expect(res.body.message).to.be
      .equals('Comment reaction has been successfully removed');
  });

  it('should return success when given like', async () => {
    const ReactionType = {
      reaction: 'like'
    };
    const res = await chai.request(server)
      .post(`/api/v1/comment/${firstCommentId}/commentreaction`)
      .set('Authorization', `Bearer ${firstUserToken}`)
      .send(ReactionType);
    expect(res).to.have.status(201);
    expect(res).to.be.an('Object');
    expect(res.body.message).to.be.equals('Comment liked by user');
  });
  it('should return error when user have not liked before unlike', async () => {
    const newReactionType = {
      reaction: 'unlike'
    };
    const res = await chai.request(server)
      .post(`/api/v1/comment/${firstCommentId}/commentreaction`)
      .set('Authorization', `Bearer ${secondUserToken}`)
      .send(newReactionType);
    expect(res).to.have.status(404);
    expect(res).to.be.an('Object');
    expect(res.body.message).to.be
      .equals('You cannot unlike a comment you have not liked');
  });
});
});
