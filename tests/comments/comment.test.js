/* eslint-disable max-len */
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import app from '../../server/index';
import models from '../../server/models';
import userFactory from '../mocks/factories/userFactory';
import articlesFactory from '../mocks/factories/articlesFactory';
import getRandomCategory from '../../server/helpers/category/checkCategory';
import commentController
from '../../server/controllers/comment/commentController';
import checkValidCommentId
from '../../server/helpers/comment/checkValidCommentId';
import validateComments from '../../server/middlewares/validations/commentValidation';

chai.should();

chai.use(sinonChai);

chai.use(chaiHttp);

const { Comment } = models;

const user1 = userFactory.build({
  password: 'Password@1'
});
const user2 = userFactory.build({
  password: 'Password@1'
});
let user1Id, adminToken, user1Token,
  user2Token, articleId,
    articleId2, commentId,
    commentId2;

describe('Test for comments crud operations', async () => {
  afterEach(() => sinon.restore());
  before(async ()  => {
    const catId = await getRandomCategory();
    const res = await chai.request(app)
    .post('/api/v1/auth/signup')
    .send(user1);
    user1Id = res.body.user.id;
    user1Token = res.body.token;
    const response = await chai.request(app)
    .post('/api/v1/auth/signup')
    .send(user2);
    user2Token = response.body.token;
    const articlesData = articlesFactory.build({
      categoryId: catId,
      body: 'Test article for comment',
      title: 'test title',
      user1Id,
      published: true,
    });
    const responses = await chai.request(app)
      .post('/api/v1/article')
      .set('Authorization', `Bearer ${user1Token}`)
      .send(articlesData);
      articleId = responses.body.article.id;
      const articleResponse = await chai.request(app)
      .post('/api/v1/article')
      .set('Authorization', `Bearer ${user1Token}`)
      .send(articlesData);
      articleId2 = articleResponse.body.article.id;
  });

  describe('Post Comment for an article', async () => {
    it('should return status 200 if comment is posted', async () => {
      const comment = {
        content: 'test comment'
      };
      const res = await chai.request(app)
      .post(`/api/v1/article/${articleId}/comment`)
      .set('Authorization', `Bearer ${user2Token}`)
      .send(comment);
      expect(res).to.have.status(201);
      expect(res.body).to.be.an('Object');
      expect(res.body.success).to.be.equal(true);
      expect(res.body.message).to.be.equal('Comment created successfully');
      commentId = res.body.comment.id;
    });
    it('should return status 404 if comment is posted on invalid articleId',
      async () => {
        const comment = {
          content: 'test comment'
        };
        const id = '829723b5-0c75-4968-accd-e1700aabc998';
        const res = await chai.request(app)
        .post(`/api/v1/article/${id}/comment`)
        .set('Authorization', `Bearer ${user2Token}`)
        .send(comment);
        expect(res).to.have.status(404);
        expect(res.body).to.be.an('Object');
        expect(res.body.message).to.be
          .equal('No article found matching this criteria');

    });
    it('should return status 400 if comment body is empty', async () => {
      const comment = {
        content: ''
      };
      const res = await chai.request(app)
      .post(`/api/v1/article/${articleId}/comment`)
      .set('Authorization', `Bearer ${user2Token}`)
      .send(comment);
      expect(res).to.have.status(400);
      expect(res.body).to.be.an('Object');
      expect(res.body.success).to.be.equal(false);
      expect(res.body.message).to.be.equal('Cannot Post an empty Text');
    });
    it('should return 400 if comment is less than 2 or greater than 150 xters',
      async () => {
      const comment = {
        content: 'e'
      };
      const res = await chai.request(app)
      .post(`/api/v1/article/${articleId}/comment`)
      .set('Authorization', `Bearer ${user2Token}`)
      .send(comment);
      expect(res).to.have.status(400);
      expect(res.body).to.be.an('Object');
      expect(res.body.success).to.be.equal(false);
      expect(res.body.message).to.be
      .equal('Comments should be at least 2 and not more than 150 characters');
    });
  });

  describe('Get Comment Route Test', async () => {
    it('should return single comment successfully', async () => {
      const res = await chai.request(app)
      .get(`/api/v1/comment/${commentId}`);
      expect(res).to.have.status(200);
      expect(res.body.success).to.equal(true);
      expect(res.body.message).to.be.equals('Retrieved comment successfully');
    });
    it('should return all comments for an article successfully', async () => {
      const res = await chai.request(app)
      .get(`/api/v1/article/${articleId}/comments`);
      expect(res).to.have.status(200);
      expect(res.body.success).to.equal(true);
      expect(res.body.message).to.be.equals('Retrieved Comments successfully');

    });
    it('should return 404 if commentId is not found', async () => {
      const invalidCommentId = '24f61785-25d8-44d3-95e5-3a19d0f2d33e';
      const res = await chai.request(app)
      .get(`/api/v1/comment/${invalidCommentId}`);
      expect(res).to.have.status(404);
      expect(res.body.success).to.equal(false);
      expect(res.body.message).to.be.equals('No Comment found');
    });
    it('should return 404 if article has no comment', async () => {
      const res = await chai.request(app)
      .get(`/api/v1/article/${articleId2}/comments`);
      expect(res).to.have.status(200);
      expect(res.body.success).to.equal(false);
      expect(res.body.message).to.be.equals('No Comment for this Article');
    });
    it('should return all the user comments stats', async () => {
      const res = await chai.request(app)
      .get('/api/v1/comments/user/count')
      .set('Authorization', `Bearer ${user2Token}`);
      expect(res).to.have.status(200);
      expect(res.body.success).to.equal(true);
      expect(res.body.data.count).to.be.equals(1);
    });
  });

  describe('Patch Comment Route Test', async () => {
    it('should update comment successfully if user is owner', async () => {
      const comment = {
        content: 'updated test comment'
      };
      const res = await chai.request(app)
      .patch(`/api/v1/comment/${commentId}`)
      .set('Authorization', `Bearer ${user2Token}`)
      .send(comment);
      expect(res).to.have.status(200);
      expect(res.body.success).to.be.equal(true);
      expect(res.body.message).to.be.equals('Comment updated successfully');

    });
    it('should return 403 if non-owner tries to update comment', async () => {
      const comment = {
        content: 'update test comment 2'
      };
      const res = await chai.request(app)
      .patch(`/api/v1/comment/${commentId}`)
      .set('Authorization', `Bearer ${user1Token}`)
      .send(comment);
      expect(res).to.have.status(403);
      expect(res.body.success).to.be.equal(false);
      expect(res.body.message).to.be
        .equal('User is not authorized to update comment');
    });
  });

  describe('Users comment Histories', async () => {
    before(async () => {
      const comment2 = {
        content: 'test comment'
      };
      const res = await chai.request(app)
      .post(`/api/v1/article/${articleId}/comment`)
      .set('Authorization', `Bearer ${user2Token}`)
      .send(comment2);
      commentId2 = res.body.comment.id;
    });
    it('should increase comment history count by 1', async () => {
      const comment = {
        content: 'updated test comment 2'
      };
      const res = await chai.request(app)
      .patch(`/api/v1/comment/${commentId}`)
      .set('Authorization', `Bearer ${user2Token}`)
      .send(comment);
      expect(res).to.have.status(200);
      expect(res.body.success).to.be.equal(true);
      expect(res.body.message).to.be.equal('Comment updated successfully');
      expect(res.body.previousComment.commentHistory).to.be
        .equal('updated test comment');

    });
    it('should return all update histories of a comment', async () => {
      const res = await chai.request(app)
      .get(`/api/v1/comment/history/${commentId}`);
      expect(res).to.have.status(200);
      expect(res.body.success).to.equal(true);
      expect(res.body.message).to.be
        .equals('Retrieved previous Comments successfully');
      expect(res.body.commentHistory.count).to.equal(2);
    });
    it('should return 404 if there are no histories', async () => {
      const res = await chai.request(app)
      .get(`/api/v1/comment/history/${commentId2}`);
      expect(res).to.have.status(404);
      expect(res.body.success).to.equal(false);
      expect(res.body.message).to.be
        .equals('No previous comment found');
    });
    it('should return 404 if commentId is not found', async () => {
      const fakeCommentId = '1ac3dc07-f69c-4f93-aaf3-4449e6c6c4cc';
      const res = await chai.request(app)
      .get(`/api/v1/comment/history/${fakeCommentId}`);
      expect(res).to.have.status(404);
      expect(res.body.success).to.equal(false);
      expect(res.body.message).to.be
        .equals('Comment ID Not Found');
    });
    it('should throw 500 error if there is server error', async () => {
    const fakeCommentId = '1ac3dc07-f69c-4f93-aaf3-4449e6c6c4cc';
      const req={
        params: {
          commentId: fakeCommentId
        }
      };
      const res = {};
      const next = sinon.stub();
      sinon.stub(Comment, 'findOne').throws();
      await validateComments.validateCommentId(req, res, next);
      expect(next.called).to.be.true;
  });
});
  describe('Delete Comment Route Test', async () => {

    it('should return 403 if non-owner tries to delete comment', async () => {
      const res = await chai.request(app)
      .delete(`/api/v1/comment/${commentId}`)
      .set('Authorization', `Bearer ${user1Token}`);
      expect(res).to.have.status(403);
      expect(res.body.success).to.be.equal(false);
      expect(res.body.message).to.be
        .equal('User is not authorized to delete comment');
    });

    it('should delete comment successfully if user is owner', async () => {
      const res = await chai.request(app)
      .delete(`/api/v1/comment/${commentId}`)
      .set('Authorization', `Bearer ${user2Token}`);
      expect(res).to.have.status(200);
      expect(res.body.success).to.be.equal(true);
      expect(res.body.message).to.be.equals('Comment deleted successfully');

    });
  });

  context('Delete comment for SuperAdmin', async () => {
    before(async ()  => {
      const admin = {
        email: 'admin@admin.com',
        password: 'password123!',
      };
      const content = {
        content: 'test comment'
      };
      const res = await chai.request(app)
      .post('/api/v1/auth/signin')
      .send(admin);
      adminToken = res.body.token;
      const response = await chai.request(app)
      .post(`/api/v1/article/${articleId}/comment`)
      .set('Authorization', `Bearer ${user2Token}`)
      .send(content);
      commentId = response.body.comment.id;

    });
    it('should delete comment successfully if user is owner', async () => {
      const res = await chai.request(app)
      .delete(`/api/v1/comment/${commentId}`)
      .set('Authorization', `Bearer ${adminToken}`);
      expect(res).to.have.status(200);
      expect(res.body.success).to.be.equal(true);
      expect(res.body.message).to.be
        .equals('Comment deleted successfully');
    });
  });

  describe('Mocking Errors', () => {
    it('should stub error for get comment', async () => {
      const req = {
        params: {
          id: 1
        }
      };
      const res = {};
      const next = sinon.stub();
      sinon.stub(Comment, 'findOne').throws();
      await commentController.getSingleComment(req, res, next);
      expect(next.called).to.be.true;
    });
    it('should stub error for get comment history', async () => {
      const req = {
        params: {
          id: 1
        }
      };
      const res = {};
      const next = sinon.stub();
      sinon.stub(Comment, 'findAndCountAll').throws();
      await commentController.getCommentHistory(req, res, next);
      expect(next.called).to.be.true;
    });

    it('should stub error for get article comments', async () => {
      const req = {
        params: {
          articleId: 1,
        }
      };
      const res = {};
      const next = sinon.stub();
      sinon.stub(Comment, 'findOne').throws();
      await commentController.getArticleComments(req, res, next);
      expect(next.called).to.be.true;
    });

    it('should stub error for post comment', async () => {
      const req = {
        params: {
          commentId: 1
        },
        user: { id: 1 },
        body:{ comment: 'heello world' }
      };
      const res = {};
      const next = sinon.stub();
      sinon.stub(Comment, 'create').throws();
      await commentController.postComment(req, res, next);
      expect(next.called).to.be.true;
    });

    it('should stub error for update comment', async () => {
      const req = {
        params: {
          commentId: 1,
        },
        user: { id: 1 },
        body: { comment: 'heello world' }
      };
      const res = {};
      const next = sinon.stub();
      sinon.stub(Comment, 'update').throws();
      await commentController.updateComment(req, res, next);
      expect(next.called).to.be.true;
    });

    it('should stub error for delete comment', async () => {
      const req = {
        params: {
          commentId: 1,
        },
        user: {
          id: 3,
          role: true,
          ownerId: 4
        }
      };
      const res = {};
      const next = sinon.stub();
      sinon.stub(Comment, 'update').throws();
      await commentController.deleteComment(req, res, next);
      expect(next.called).to.be.true;
    });

    it('should stub error to check Valid CommentId', async () => {
      const id = 8;
      const error = sinon.stub();
      sinon.stub(Comment, 'findOne').throws();
      await checkValidCommentId(id);
      expect(error.called).to.be.false;
    });
    it(  'should stub error for get users comment', async () => {
      const req = {
        user: {
          id: 3,
          role: true,
          ownerId: 4
        }
      };
      const res = {};
      const next = sinon.stub();
      sinon.stub(Comment, 'findAndCountAll').throws();
      await commentController.getUserComment(req, res, next);
      expect(next.called).to.be.true;
    });
  });
  context('Check valid comment Test', () => {
    it('should reach the else block', async () => {
      sinon.stub(Comment, 'findOne').returns({});
      await checkValidCommentId(29371);
    });
  });

});
