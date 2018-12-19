import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import BookmarkController from '../../server/controllers/bookmarkController';
import ArticleFactory from '../mocks/factories/articlesFactory';
import UserFactory from '../mocks/factories/userFactory';
import getCategory from '../../server/helpers/checkCategory';
import server from '../../server';
import {
  BOOKMARK_SUCCESSFUL_MSG,
  BOOKMARK_FOUND_MSG
} from '../../server/helpers/responseMessages';


chai.use(chaiHttp);

const BOOKMARK_ROUTE_URL = '/api/v1/bookmark';
const SIGNUP_ROUTE_URL = '/api/v1/auth/signup';
const ARTICLE_ROUTE_URL = '/api/v1/article';

let token;
let articleId;

describe('BookmarkController Test', () => {
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
  });
});
