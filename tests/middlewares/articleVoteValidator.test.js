import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chai, { expect, should } from 'chai';
import ArticleVoteValidator
from '../../server/middlewares/validations/articleVoteValidator';
import {
  VOTE_BAD_REQUEST_MSG,
  VOTE_REQUIRED_MSG
} from '../../server/helpers/vote/responseMessage';

chai.use(sinonChai);

should();

const req = {
  body: {
    vote: 1
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

describe('#ArticleVoteValidator test', () => {
  afterEach(() => { sinon.restore(); });

  context('function test', () => {
    it('should have a function called validateRequest', () => {
      expect(ArticleVoteValidator.validateRequest).to.exist;
    });

    it('should be a function validateRequest', () => {
      expect(ArticleVoteValidator.validateRequest).to.be.a('function');
    });

    it('should have a function called isAValidParam', () => {
      expect(ArticleVoteValidator.isAValidParam).to.exist;
    });

    it('should be a function isAValidParam', () => {
      expect(ArticleVoteValidator.isAValidParam).to.be.a('function');
    });
  });

  context('validateRequest test', () => {
    it(`should return ${VOTE_REQUIRED_MSG} when no vote is passed`, () => {
      const request = {
        body: {}
      };
      const response = ArticleVoteValidator.validateRequest(request, res, next);
      expect(response.message).to.equal(VOTE_REQUIRED_MSG);
    });

    it(`should return ${VOTE_BAD_REQUEST_MSG} when an invalid vote is passed`,
    () => {
      const request = {
        body: {
          vote: 2
        }
      };
      const response = ArticleVoteValidator.validateRequest(request, res, next);
      expect(response.message).to.equal(VOTE_BAD_REQUEST_MSG);
    });

    it('should call next when valid vote is called', () => {
      ArticleVoteValidator.validateRequest(req, res, next);
      next.should.have.been.called;
    });
  });

  context('isAVaildParam test', () => {
    it('should return false when an invalid vote is passed', () => {
      const response = ArticleVoteValidator.isAValidParam(2);
      expect(response).to.equal(false);
    });

    it('should return true when a valid vote is passed', () => {
      const response = ArticleVoteValidator.isAValidParam(-1);
      expect(response).to.equal(true);
    });
  });
});
