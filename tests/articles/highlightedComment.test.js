/* eslint-disable max-len */
import chaiHttp from 'chai-http';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import server from '../../server/index';
import signupFactory from '../mocks/factories/userFactory';
import getRandomCategory from '../../server/helpers/category/checkCategory';
import highlightedCommentcontroller
from '../../server/controllers/comment/highlightedComment';
import fakeResponse from '../mocks/auth/fakeResponse';
import models from '../../server/models';


chai.should();
chai.use(chaiHttp);
chai.use(sinonChai);

let userId;
let catId;
let token, dummyToken;
let articleId;
let commentId;

const { Article, HighlightedComment } = models;

describe('API endpoint for create articles', () => {
  afterEach(() => { sinon.restore(); });
    const user = signupFactory.build({
      email: 'etta@outlook.com',
      password: 'password123*'
    });
    const user2 = signupFactory.build({
      email: 'etta@hotmail.com',
      password: 'password123*'
    });

    before(async () => {
      catId = await getRandomCategory();
      const dummyUser = await chai.request(server)
        .post('/api/v1/auth/signup')
        .send(user2);
        dummyToken = dummyUser.body.token;

      const res = await chai.request(server)
        .post('/api/v1/auth/signup')
        .send(user);
      token = res.body.token;
      userId = res.body.user.id;
    });

    it('Should create an article', async () => {
        const articlesData = {
            categoryId: catId,
            body: `By the end of this tutorial, we will have created an API
             for a todo list application that will enable us to create 
             multiple todos, add list items to those todos, update the list
             items and delete them. By working through an application in which
             we implement functionality to add things, update and delete them
             from a database, this tutorial will serve as an introduction to 
             writing more advanced CRUD applications`,
            title: 'test title',
        };
        const res = await chai.request(server)
          .post('/api/v1/article/')
          .set('Authorization', `Bearer ${token}`)
          .send(articlesData);
        expect(res).to.have.status(201);
        articleId = res.body.article.id;
        expect(res.body).to.be.an('Object');
        expect(res.body.message).to.be.equals('Article created successfully');
    });

    context('### Add Highlighted Comments', () => {
        it('should add a higlighted Comment to an article', async () => {
            const theComment = {
                content: 'By working through an application in which'
            };
            const res = await chai.request(server)
              .post(`/api/v1/highlights/${articleId}`)
              .set('Authorization', `Bearer ${token}`)
              .send(theComment);
              expect(res).to.have.status(201);
              expect(res.body).to.be.an('Object');
              expect(res.body.message).
              to.be.equals('hightlighted comment successfully created');
              expect(res.body).to.haveOwnProperty('comment');
              expect(res.body).to.haveOwnProperty('userhiglights');
              commentId = res.body.comment.id;
        });

        it('shouldn\'t post comment when content is less than 15 characters',
         async () => {
            const theComment = {
                content: 'create mult'
            };
            const res = await chai.request(server)
              .post(`/api/v1/highlights/${articleId}`)
              .set('Authorization', `Bearer ${token}`)
              .send(theComment);
              expect(res).to.have.status(400);
              expect(res.body).to.be.an('Object');
              expect(res.body.message).
              to.be.equals('content can\'t contain less than 15 characters');
        });

        it('shouldn\'t post comment when content is not in article body',
         async () => {
            const theComment = {
                content: 'Sometimes it will break the code, insert more'
            };
            const res = await chai.request(server)
              .post(`/api/v1/highlights/${articleId}`)
              .set('Authorization', `Bearer ${token}`)
              .send(theComment);
              expect(res).to.have.status(400);
              expect(res.body).to.be.an('Object');
              expect(res.body.message).to.be.
              equals('highlight must be present in the body to enable comment');
        });

        it('shouldn\'t post comment on an article that doesnt exists',
         async () => {
            const theComment = {
                content: 'Sometimes it will break the code, insert more'
            };
            const res = await chai.request(server)
              .post(`/api/v1/highlights/${userId}`)
              .set('Authorization', `Bearer ${token}`)
              .send(theComment);
              expect(res).to.have.status(400);
              expect(res.body).to.be.an('Object');
              expect(res.body.message).
              to.be.equals('article not found');
        });

        it('should reach the catch block for undefined errors',async () => {
          const req = {
            user: { id: 1 },
            params: { articleId: 39 },
            body: { content: 'djadjadhkadakdhadhakhd' }
          };
          const next = sinon.stub();
          sinon.stub(Article, 'findOne').throws();
          await highlightedCommentcontroller.addComment(req, fakeResponse, next);
          next.should.have.been.called;
        });
    });

    context('### update Highlighted Comment', () => {

        it('should update a higlighted Comment to an article', async () => {
            const theComment = {
                content: 'writing more advanced CRUD applications'
            };
            const res = await chai.request(server)
              .put(`/api/v1/highlights/${commentId}/update`)
              .set('Authorization', `Bearer ${token}`)
              .send(theComment);
              expect(res).to.have.status(200);
              expect(res.body).to.be.an('Object');
              expect(res.body.message).
              to.be.equals('highlightedComment was successfully updated');
              expect(res.body).to.haveOwnProperty('updatedComment');
        });

        it('shouldn\'t update comment when content is less than 15 characters',
         async () => {
            const theComment = {
                content: 'create mult'
            };
            const res = await chai.request(server)
              .put(`/api/v1/highlights/${commentId}/update`)
              .set('Authorization', `Bearer ${token}`)
              .send(theComment);
              expect(res).to.have.status(400);
              expect(res.body).to.be.an('Object');
              expect(res.body.message).
              to.be.equals('content can\'t contain less than 15 characters');
        });

        it('shouldn\'t update a comment that doesnt exists',
         async () => {
            const theComment = {
                content: 'Sometimes it will break the code, insert more'
            };
            const res = await chai.request(server)
              .put(`/api/v1/highlights/${userId}/update`)
              .set('Authorization', `Bearer ${token}`)
              .send(theComment);
              expect(res).to.have.status(400);
              expect(res.body).to.be.an('Object');
              expect(res.body.message).
              to.be.equals('highlightedComment not found');
        });

        it('shouldn\'t update comment when content is not in article body',
         async () => {
            const theComment = {
                content: 'Sometimes it will break the code, insert more'
            };
            const res = await chai.request(server)
              .put(`/api/v1/highlights/${commentId}/update`)
              .set('Authorization', `Bearer ${token}`)
              .send(theComment);
              expect(res).to.have.status(400);
              expect(res.body).to.be.an('Object');
              expect(res.body.message).to.be.
              equals('highlight must be present in the body to enable comment');
        });

        it('shouldn\'t update comment when it wasnt created by the user',
        async () => {
           const theComment = {
               content: 'enable us to create multiple todos'
           };
           const res = await chai.request(server)
             .put(`/api/v1/highlights/${commentId}/update`)
             .set('Authorization', `Bearer ${dummyToken}`)
             .send(theComment);
             expect(res).to.have.status(404);
             expect(res.body).to.be.an('Object');
             expect(res.body.message).
             to.be.equals('you don\'t have permission to update this comment');
       });

       it('should reach the catch block for undefined errors',async () => {
        const req = {
          user: { id: 1 },
          params: { commentId: 39 },
          body: { content: 'jfhajkdhfadjhfjadhfjhadjd' }
        };
        const next = sinon.stub();
        sinon.stub(HighlightedComment, 'findOne').throws();
        await highlightedCommentcontroller.updateComment(req, fakeResponse, next);
        next.should.have.been.called;
      });
    });

    context('#### delete Highlighted Comment', async () => {
        it('shouldn\'t delete comment created by another user',
        async () => {
           const res = await chai.request(server)
             .delete(`/api/v1/highlights/${commentId}/delete`)
             .set('Authorization', `Bearer ${dummyToken}`);
             expect(res).to.have.status(404);
             expect(res.body).to.be.an('Object');
             expect(res.body.message).
             to.be.equals('you don\'t have permission to update this comment');
       });

       it('shouldn\'t delete a comment that doesnt exists',
       async () => {
          const res = await chai.request(server)
            .delete(`/api/v1/highlights/${userId}/delete`)
            .set('Authorization', `Bearer ${token}`);
            expect(res).to.have.status(400);
            expect(res.body).to.be.an('Object');
            expect(res.body.message).
            to.be.equals('highlightedComment not found');
      });

      it('should delete an higlighted Comment', async () => {
        const res = await chai.request(server)
          .delete(`/api/v1/highlights/${commentId}/delete`)
          .set('Authorization', `Bearer ${token}`);
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('Object');
          expect(res.body.message).
          to.be.equals('comment successfully deleted');
          expect(res.body).to.haveOwnProperty('deletedComment');
      });

      it('should reach the catch block for undefined errors',async () => {
        const req = {
          user: { id: 1 },
          params: { commentId: 39 }
        };
        const next = sinon.stub();
        sinon.stub(HighlightedComment, 'findOne').throws();
        await highlightedCommentcontroller.deleteComment(req, fakeResponse, next);
        next.should.have.been.called;
      });
    });
});
