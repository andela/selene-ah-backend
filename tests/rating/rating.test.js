import chaiHttp from 'chai-http';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import app from '../../server/index';
import UserFactory from '../mocks/factories/userFactory';
import models from '../../server/models';
import ArticleFactory from '../mocks/factories/roleArticleFactory';
import RatingController from '../../server/controllers/rating/ratingController';

import {
  SUCCESSFUL_RATING,
  SUCCESSFUL_RATING_UPDATE,
  GOT_ARTICLE_RATING_MESSAGE,
  NO_ARTICLE_RATING,
  RATE_OWN_ARTICLE_ERROR
} from '../../server/helpers/rating/responseMessage';

import {
  INVALID_ARTICLE_ID_ERROR,
  NOT_EXISTS_ARTICLE_ID_ERROR,
} from '../../server/helpers/article/responseMessage';

import {
  AUTHENTICATION_ERROR_MSG,
} from '../../server/helpers/auth/responseMessage';

import ArticleHelper
      from '../../server/helpers/article/articleHelper';

chai.use(chaiHttp);

const { Category, Article, Rating } = models;

const signUpUrl = '/api/v1/auth/signup';
const newUser1 = UserFactory.build({
  userName: 'davidshare',
  password: 'gemshare2@'
});

const newUser2 = UserFactory.build({
  userName: 'gemshare',
  password: 'ekpo@davo2'
});
const newArticle = ArticleFactory.build();
const newArticle2 = ArticleFactory.build();

describe('Rating controller', () => {
  const ratingObject = {};
  const userObject = {};

  let category;
  let article;
  let article2;
  let authorToken;
  let readerToken;
  let ratingUrl;

  before(async () => {

    /**
     * @description - inserts a new category into the database
     */
    category = await Category.create({
      title: 'technology'
    });


    /**
     * @description - inserts a new user into the database
     */
    const author = await chai.request(app)
      .post(`${signUpUrl}`)
      .send(newUser1);
      userObject.author = author.body;

    newArticle.userId = userObject.author.user.id;
    newArticle.categoryId = category.id;
    newArticle.readTime = ArticleHelper.calculateArticleReadTime(
                                        newArticle.body
                                        );
    article = await Article.create(newArticle);

    const reader = await chai.request(app)
      .post(`${signUpUrl}`)
      .send(newUser2);
      userObject.reader = reader.body;

    await Rating.create({
      articleId: newArticle.id,
      articleRating: 2,
      userId: userObject.author.user.id
    });

    newArticle2.userId = userObject.reader.user.id;
    newArticle2.categoryId = category.id;
    newArticle2.readTime = ArticleHelper.calculateArticleReadTime(
                                          newArticle2.body
                                          );
    article2 = await Article.create(newArticle2);

    ratingObject.articleId = article.id;
    ratingObject.articleRating = 5;
    authorToken = `Bearer ${userObject.author.token}`;
    readerToken = `Bearer ${userObject.reader.token}`;
    ratingUrl = `/api/v1/articles/${ratingObject.articleId}/rating`;
 });

  describe(`#POST ${ratingUrl} - Endpoint to add a rating -`,() => {
    it('should rate an article', async () => {
      const response = await chai.request(app)
      .post(`${ratingUrl}`)
      .send({'articleRating': ratingObject.articleRating})
      .set('Authorization', readerToken);
      expect(response).to.have.status(201);
      expect(response.body).to.be.an('object');
      expect(response.body.message).to.equal(SUCCESSFUL_RATING);
    });


    it('should not rate an article if the user is the author', async () => {
      const response = await chai.request(app)
      .post(`${ratingUrl}`)
      .send({'articleRating': ratingObject.articleRating})
      .set('Authorization', authorToken);
      expect(response).to.have.status(403);
      expect(response.body).to.be.an('object');
      expect(response.body.message).to.equal(RATE_OWN_ARTICLE_ERROR);
    });

    it('should not rate an article if the user is unauthenticated',
    async () => {
      const response = await chai.request(app)
        .post(ratingUrl)
        .send(ratingObject);
          expect(response).to.have.status(401);
          expect(response.body).to.be.an('object');
          expect(response.body.message).to.equal(AUTHENTICATION_ERROR_MSG);
    });

    it('should not add a rating if the articleId is invalid', async () => {
      const response = await chai.request(app)
        .post('/api/v1/articles/2/rating')
        .send({ articleId: 2, articleRating: 2 })
        .set('Authorization', readerToken);
          expect(response).to.have.status(400);
          expect(response.body).to.be.an('object');
          expect(response.body.message).to.equal(INVALID_ARTICLE_ID_ERROR);
    });

    it('should not add a rating with an articleId that does not exist',
    async () => {
      const response = await chai.request(app)
        .post('/api/v1/articles/424b5cc9-4cd3-4a17-a49e-f8b8aa97627b/rating')
        .send({
          articleId: '273da52b-b46f-48d3-b180-4eb31eec638b',
          articleRating: 2
        })
        .set('Authorization', readerToken);
          expect(response).to.have.status(404);
          expect(response.body).to.be.an('object');
          expect(response.body.message).to.equal(NOT_EXISTS_ARTICLE_ID_ERROR);
    });

    it('should return a 500 error if create action fails.', async () =>{
      const req = {};
      const res = {};
      const next = sinon.stub();

      sinon.stub(Rating, 'create').throws();
      await RatingController.rateArticle(req, res, next);
      expect(next.called).to.be.true;
      sinon.restore();
    });
  });

/**
 * @description tests for updating the rating of an article
*/
  describe(`#PUT ${ratingUrl} - Endpoint to update a rating -`,() => {
    it('should update the rating of an article', async () => {
      const response = await chai.request(app)
        .put(`${ratingUrl}`)
        .send(ratingObject)
        .set('Authorization', readerToken);
          expect(response).to.have.status(200);
          expect(response.body).to.be.an('object');
          expect(response.body.message).to.equal(SUCCESSFUL_RATING_UPDATE);
    });

    it('should not update an article\'s rating if the user is the author',
    async () => {
      const response = await chai.request(app)
      .put(`${ratingUrl}`)
      .send(ratingObject)
      .send({'articleRating': ratingObject.articleRating})
      .set('Authorization', authorToken);
      expect(response).to.have.status(403);
      expect(response.body).to.be.an('object');
      expect(response.body.message).to.equal(RATE_OWN_ARTICLE_ERROR);
    });

    it('should not update an article\'s rating if the user is unauthenticated',
    async () => {
      const response = await chai.request(app)
        .put(`${ratingUrl}`)
        .send(ratingObject);
          expect(response).to.have.status(401);
          expect(response.body).to.be.an('object');
          expect(response.body.message).to.equal(AUTHENTICATION_ERROR_MSG);
    });

    it('should not update a rating if the articleId is invalid', async () => {
      const response = await chai.request(app)
        .put('/api/v1/articles/2/rating')
        .send(ratingObject)
        .set('Authorization', readerToken);
          expect(response).to.have.status(400);
          expect(response.body).to.be.an('object');
          expect(response.body.message).to.equal(INVALID_ARTICLE_ID_ERROR);
    });

    it('should not update a rating with an articleId that does not exist',
    async () => {
      const response = await chai.request(app)
        .put('/api/v1/articles/424b5cc9-4cd3-4a17-a49e-f8b8aa97627b/rating')
        .send(ratingObject)
        .set('Authorization', readerToken);
          expect(response).to.have.status(404);
          expect(response.body).to.be.an('object');
          expect(response.body.message).to.equal(NOT_EXISTS_ARTICLE_ID_ERROR);
    });

    it('should return a 500 error if the update action fails.', async () =>{
      const req = {};
      const res = {};
      const next = sinon.stub();

      sinon.stub(Rating, 'update').throws();
      await RatingController.updateRating(req, res, next);
      expect(next.called).to.be.true;
      sinon.restore();
    });
  });
  /**
   * @description tests for getting article rating
   */
  describe(`#GET ${ratingUrl} - Endpoint to get an article's ratings -`,
  async () => {
    it('should get the rating for a specific article', async () => {
      const response = await chai.request(app)
        .get(`${ratingUrl}`);
          expect(response).to.have.status(200);
          expect(response.body).to.be.an('object');
          expect(response.body.message).to.equal(GOT_ARTICLE_RATING_MESSAGE);
    });

    it('should not get the rating if the article Id is invalid', async () => {
      const response = await chai.request(app)
        .get('/api/v1/articles/2/rating')
        .send(ratingObject);
          expect(response).to.have.status(400);
          expect(response.body).to.be.an('object');
          expect(response.body.message).to.equal(INVALID_ARTICLE_ID_ERROR);
    });

    it('should return a failure message if the article has not been rated',
    async () => {
      const response = await chai.request(app)
        .get(`/api/v1/articles/${article2.id}/rating`)
        .send(ratingObject);
          expect(response).to.have.status(404);
          expect(response.body).to.be.an('object');
          expect(response.body.message).to.equal(NO_ARTICLE_RATING);
    });

    it('should return a 500 error if it can not get an article\'s ratings.',
    async () =>{
      const req = {};
      const res = {};
      const next = sinon.stub();

      sinon.stub(Rating, 'findAll').throws();
      await RatingController.getSingleArticleRatings(req, res, next);
      expect(next.called).to.be.true;
      sinon.restore();
    });
  });

  describe(
    `#GET ${ratingUrl} Endpoint to get a user's rating for an article`,
  () => {
    it('should get the rating of a user for a specific article', async () => {
      const response = await chai.request(app)
        .get(`/api/v1/user/articles/${article.id}/rating/`)
        .set('Authorization', readerToken);
          expect(response).to.have.status(200);
          expect(response.body).to.be.an('object');
          expect(response.body.message).to.equal(GOT_ARTICLE_RATING_MESSAGE);
    });

    it('should not return a rating for an unauthenticated user',
    async () => {
      const response = await chai.request(app)
        .get(`/api/v1/user/articles/${article2.id}/rating/`)
        .send(ratingObject);
          expect(response).to.have.status(401);
          expect(response.body).to.be.an('object');
          expect(response.body.message).to.equal(AUTHENTICATION_ERROR_MSG);
    });

    it('should not get the rating if the article Id is invalid', async () => {
      const response = await chai.request(app)
        .get('/api/v1/user/articles/2/rating/')
        .send(ratingObject)
        .set('Authorization', readerToken);
          expect(response).to.have.status(400);
          expect(response.body).to.be.an('object');
          expect(response.body.message).to.equal(INVALID_ARTICLE_ID_ERROR);
    });

    it('should return a failure message if the article has not been rated',
    async () => {
      const response = await chai.request(app)
        .get(`/api/v1/user/articles/${article2.id}/rating/`)
        .send(ratingObject)
        .set('Authorization', readerToken);
          expect(response).to.have.status(404);
          expect(response.body).to.be.an('object');
          expect(response.body.message).to.equal(NO_ARTICLE_RATING);
    });

    it('should return a 500 error if it cannot get a single user\'s rating.',
    async () =>{
      const req = {};
      const res = {};
      const next = sinon.stub();

      sinon.stub(Rating, 'findOne').throws();
      await RatingController.getArticleRatingForUser(req, res, next);
      expect(next.called).to.be.true;
      sinon.restore();
    });
  });
});
