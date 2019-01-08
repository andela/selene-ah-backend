import chai, { expect } from 'chai';
import sinon from 'sinon';
import server from '../../server/index';
import articleFactory from '../mocks/factories/articlesFactory';
import userFactory from '../mocks/factories/userFactory';
import getRandomCategory from '../../server/helpers/category/checkCategory';
import { INVALID_STRING_MSG } from
  '../../server/helpers/responseMessages';
import {
  ARTICLE_NOT_FOUND,
  ARTICLE_SUCESSFUL_MSG
} from '../../server/helpers/article/responseMessage';
import articleSearchController from
  '../../server/controllers/article/articleSearchController';
import models from '../../server/models';

const { Article } = models;

const ARTICLE_SEARCH_URL = '/api/v1/articles/search';
const SIGNUP_URL = '/api/v1/auth/signup';
const CREATE_ARTICLE = '/api/v1/article';

let userId, token;

describe('## Filtering Article Endpoint', () => {
  const user = userFactory.build({
    email: 'ddd567@gmail.com',
    password: 'opeyehi123*',
    userName: 'unique2233'
  });

  before(async () => {
    const res = await chai.request(server)
      .post(SIGNUP_URL)
      .send(user);
    token = res.body.token;
    userId = res.body.user.id;

    const article = articleFactory.build({
      categoryId: await getRandomCategory(),
      userId,
      tags: ['daniel', 'andela'],
      title: 'Daniel is a good boy',
      body: 'Lorem ipsum lorem ipsum'
    });

    await chai.request(server)
      .post(CREATE_ARTICLE)
      .set('Authorization', `Bearer ${token}`)
      .send(article);
  });

  it('should return error when an invalid keyword is supplied', async () => {
    const res = await chai.request(server)
      .get(`${ARTICLE_SEARCH_URL}?keyword=gh7`);
    expect(res).to.have.status(400);
    expect(res.body.message).to.be.equal(`keyword: ${INVALID_STRING_MSG}`);
  });

  it('should return error when an invalid author is supplied', async () => {
    const res = await chai.request(server)
      .get(`${ARTICLE_SEARCH_URL}?author=gh`);
    expect(res).to.have.status(400);
    expect(res.body.message).to.be.equal(`Author: ${INVALID_STRING_MSG}`);
  });

  it('should return error when an invalid tag is supplied', async () => {
    const res = await chai.request(server)
      .get(`${ARTICLE_SEARCH_URL}?tag=12f`);
    expect(res).to.have.status(400);
    expect(res.body.message).to.be.equal(`Tag: ${INVALID_STRING_MSG}`);
  });

  it('should return error when an invalid category is supplied', async () => {
    const res = await chai.request(server)
      .get(`${ARTICLE_SEARCH_URL}?category=gh55`);
    expect(res).to.have.status(400);
    expect(res.body.message).to.be.equal(`category: ${INVALID_STRING_MSG}`);
  });

  it('should return an article when an author is supplied', async () => {
    const res = await chai.request(server)
      .get(`${ARTICLE_SEARCH_URL}?author=unique2233`);
    expect(res).to.have.status(200);
    expect(res.body.message).to.be.equal(ARTICLE_SUCESSFUL_MSG);
    expect(res.body.articles.length).to.be.equal(1);
  });

  it(`should return ${ARTICLE_NOT_FOUND} when result is empty`, async () => {
    const res = await chai.request(server)
      .get(`${ARTICLE_SEARCH_URL}?author=uniue2233`);
    expect(res).to.have.status(404);
    expect(res.body.message).to.be.equal(ARTICLE_NOT_FOUND);
  });

  it(`should return ${ARTICLE_SUCESSFUL_MSG}`, async () => {
    const res = await chai.request(server)
      .get(`${ARTICLE_SEARCH_URL}?author=unique2233&keyword=Daniel`);
    expect(res).to.have.status(200);
    expect(res.body.message).to.be.equal(ARTICLE_SUCESSFUL_MSG);
    expect(res.body.articles.length).to.be.equal(1);
  });

  it(`should return ${ARTICLE_NOT_FOUND} when result is empty`, async () => {
    const res = await chai.request(server)
      .get(`${ARTICLE_SEARCH_URL}?author=unique2233&keyword=opeyemi`);
    expect(res).to.have.status(404);
    expect(res.body.message).to.be.equal(ARTICLE_NOT_FOUND);
  });

  it('should return status 500 for server error', async ()=> {
    const req = {
      query: {
        limit: 1,
        page: 3,
        keyword: 'jjj',
      }
    };
    const res = {};
    const next = sinon.stub();

    sinon.stub(Article, 'findAll').throws();
    await articleSearchController.searchArticle(req, res, next);
    expect(next.called).to.be.true;
    sinon.restore();
  });
});
