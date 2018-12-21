import chai, { expect, should } from 'chai';
import sinonChai from 'sinon-chai';
import sinon from 'sinon';
import ArticleValidator
from '../../server/middlewares/articleValidation';
import models from '../../server/models';
import {
  ARTICLE_NOT_FOUND
} from '../../server/helpers/responseMessages';

const { Article } = models;
should();
chai.use(sinonChai);


describe('#ArticleValidator test', () => {
  afterEach(() => { sinon.restore(); });
  context('function test', () => {
    it('should have a function called articleExistInDatabase', () => {
      expect(ArticleValidator.articleExistInDatabase).to.exist;
    });

    it('should be a funtion articleExistInDatabase', () => {
      expect(ArticleValidator.articleExistInDatabase).to.be.a('function');
    });
  });

  context('articleExistInDatabase tests', () => {
    it('should return the next block', async () => {
      const req = {
        params: {
          articleId: 847198474813
        }
      };

      const res = {
        status() {
          return this;
        },
        json(obj) {
          return obj;
        }
      };

      const next = sinon.stub();
      sinon.stub(Article, 'findOne').returns([]);
      await ArticleValidator.articleExistInDatabase(req, res, next);
      next.should.have.been.called;
    });

    it(`should return ${ARTICLE_NOT_FOUND} when article is not found`,
    async () => {
      const req = {
        params: {
          articleId: 847198474813
        }
      };

      const res = {
        status() {
          return this;
        },
        json(obj) {
          return obj;
        }
      };

      const next = sinon.stub();
      sinon.stub(Article, 'findOne').returns(false);
      const dbResponse = await ArticleValidator
                          .articleExistInDatabase(req, res, next);
      expect(dbResponse.message).to.equal(ARTICLE_NOT_FOUND);
    });

    it('should hit the catch block for unexpected errors', async () => {
      const req = {
        params: {
          articleId: 847198474813
        }
      };

      const res = {
        status() {
          return this;
        },
        json(obj) {
          return obj;
        }
      };

      const next = sinon.stub();
      sinon.stub(Article, 'findOne').throws();
      await ArticleValidator.articleExistInDatabase(req, res, next);
      next.should.have.been.called;
    });
  });
});
