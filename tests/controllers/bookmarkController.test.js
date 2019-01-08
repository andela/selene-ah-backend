import chai, { expect, should } from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import BookmarkController
from '../../server/controllers/bookmark/bookmarkController';
import ArticleFactory from '../mocks/factories/articlesFactory';
import UserFactory from '../mocks/factories/userFactory';
import getCategory from '../../server/helpers/category/checkCategory';
import server from '../../server';
import fakeResponse from '../mocks/auth/fakeResponse';
import models from '../../server/models';
import {
  BOOKMARK_SUCCESSFUL_MSG,
  BOOKMARK_FOUND_MSG,
  NO_BOOKMARK_MSG
} from '../../server/helpers/bookmark/responseMessage';


chai.use(chaiHttp);
chai.use(sinonChai);
should();
const { Bookmark } = models;

const BOOKMARK_ROUTE_URL = '/api/v1/bookmark';
const SIGNUP_ROUTE_URL = '/api/v1/auth/signup';
const ARTICLE_ROUTE_URL = '/api/v1/article';

let token;
let articleId;

describe('BookmarkController Test', () => {
  afterEach(() => { sinon.restore(); });
  before(async () => {
    const user = UserFactory.build({
      password: 'passioe$82!'
    });

    const signupResponse = await chai.request(server)
          .post(SIGNUP_ROUTE_URL)
          .send(user);

          token = signupResponse.body.token;

    const categoryId = await getCategory();
    const article = ArticleFactory.build({
      categoryId,
    });
    const articleResponse = await chai.request(server)
          .post(ARTICLE_ROUTE_URL)
          .set('Authorization', `Bearer ${token}`)
          .send(article);
    articleId = articleResponse.body.article.id;
  });

  context('function tests', () => {
    it('should have a function called bookmarkArticle', () => {
      expect(BookmarkController.bookmarkArticle).to.exist;
      expect(BookmarkController.bookmarkArticle).to.be.a('function');
    });
  });

  context(`POST ${BOOKMARK_ROUTE_URL}/:articleId`, () => {
    it(`should return ${BOOKMARK_SUCCESSFUL_MSG} when valid article is passed`,
    async() => {
      const response = await chai.request(server)
            .post(`${BOOKMARK_ROUTE_URL}/${articleId}`)
            .set('Authorization', `Bearer ${token}`)
            .send(articleId);
      expect(response.body).to.have.property('message');
      expect(response.body.message).to.equal(BOOKMARK_SUCCESSFUL_MSG);
    });
  });

  context(`GET ${BOOKMARK_ROUTE_URL}`, () => {
    it(`should return ${BOOKMARK_FOUND_MSG} when user has a bookmarked article`,
    async() => {
      const response = await chai.request(server)
            .get(BOOKMARK_ROUTE_URL)
            .set('Authorization', `Bearer ${token}`);
      expect(200);
      expect(response.body).to.have.property('message');
      expect(response.body).to.have.property('data');
      expect(response.body.message).to.equal(BOOKMARK_FOUND_MSG);
    });

    // eslint-disable-next-line max-len
    it(`should return ${NO_BOOKMARK_MSG} when user has does not have a bookmarked article`,
    async() => {
      sinon.stub(Bookmark, 'findAll').returns(false);
      const req = { user: { id: 1 }};
      const response = await BookmarkController
                      .getUsersBookmarks(req, fakeResponse);
      expect(200);
      expect(response).to.have.property('message');
      expect(response.message).to.equal(NO_BOOKMARK_MSG);
    });
  });
});
