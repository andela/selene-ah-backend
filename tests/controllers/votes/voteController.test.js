import chai, { expect, should } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chaiHttp from 'chai-http';
import Vote from '../../../server/controllers/votes/VoteController';
import models from '../../../server/models';
import getCategory from '../../../server/helpers/category/checkCategory';
import server from '../../../server';
import ArticleFactory from '../../mocks/factories/articleFactory';
import UserFactory from '../../mocks/factories/userFactory';
import VoteFactory from '../../mocks/factories/voteFactory';
import {
  ARTICLE_LIKE_MSG,
  ARTICLE_DISLIKE_MSG,
  ARTICLE_RESET_MSG,
  ARTICLE_NOT_LIKED_BY_USER_MSG,
  ARTICLE_LIKED_BY_USER_MSG
} from '../../../server/helpers/article/responseMessage';

chai.use(chaiHttp);
chai.use(sinonChai);

should();

const req = {
  params: {
    articleId: 8492742847
  },
  user: {
    id: 894824194819841
  },
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
const { ArticleVote } = models;
const VOTE_ROUTE_URL = '/api/v1/votes';
const ARTICLE_ROUTE_URL = '/api/v1/article';
const SIGNUP_ROUTE_URL = '/api/v1/auth/signup';

let articleId;
let categoryId;
let token;

describe('#VoteController test', () => {
  afterEach(() => sinon.restore());

  before( async () => {
    categoryId = await getCategory();
    const articlePost = ArticleFactory.build({
      categoryId,
    });

    const userPost = UserFactory.build({
      password: 'p@55menwjfiqe@'
    });

    const signUpResponse = await chai.request(server)
        .post(SIGNUP_ROUTE_URL)
        .send(userPost);
    token = signUpResponse.body.token;
    const articleResponse = await chai.request(server)
        .post(ARTICLE_ROUTE_URL)
        .set('authorization', `Bearer ${token}`)
        .send(articlePost);
        articleId = articleResponse.body.article.id;
  });

  context('function tests', () => {
    it('should have a function reactToArticle', () => {
      expect(Vote.reactToArticle).to.exist;
    });

    it('should be a function reactToArticle', () => {
      expect(Vote.reactToArticle).to.be.a('function');
    });

    it('should have a function resetArticleVoteReaction', () => {
      expect(Vote.resetArticleVoteReaction).to.exist;
    });

    it('should be a function resetArticleVoteReaction', () => {
      expect(Vote.resetArticleVoteReaction).to.be.a('function');
    });

    it('should have a function updateArticleVote', () => {
      expect(Vote.updateArticleVote).to.exist;
    });

    it('should be a function updateArticleVote', () => {
      expect(Vote.updateArticleVote).to.be.a('function');
    });

    it('should have a function votesCount', () => {
      expect(Vote.votesCount).to.exist;
    });

    it('should be a function votesCount', () => {
      expect(Vote.votesCount).to.be.a('function');
    });

    it('should have a function articleLikedByUser', () => {
      expect(Vote.articleLikedByUser).to.exist;
    });

    it('should be a function articleLikedByUser', () => {
      expect(Vote.articleLikedByUser).to.be.a('function');
    });
  });

  context('reactToArticle test', () => {
    it('should call the findOrCreate method', () => {
      const findOrCreateSpy = sinon.spy(ArticleVote, 'findOrCreate');
      Vote.reactToArticle(req, res, next);
      findOrCreateSpy.should.have.been.called;
    });

    it(`should return 
        ${ARTICLE_LIKE_MSG} when article is valid`,async () => {
      sinon.stub(ArticleVote, 'findOrCreate').returns([ null, true ]);
      const response = await Vote.reactToArticle(req, res, next);
      expect(response.message).to.equal(ARTICLE_LIKE_MSG);
    });

    it(`should return ${ARTICLE_LIKE_MSG} when article is created`,
    async () => {
      sinon.stub(ArticleVote, 'findOrCreate').returns([ null, false ]);
      const response = await Vote.reactToArticle(req, res, next);
      expect(response.message).to.equal(ARTICLE_LIKE_MSG);
    });

    it(`should return 
        ${ARTICLE_DISLIKE_MSG} when article is valid`,
    async () => {

      const request = {
        params: {
          articleId: 8492742847
        },
        user: {
          id: 894824194819841
        },
        body: {
          vote: -1
        }
      };

      sinon.stub(ArticleVote, 'findOrCreate').returns([ null, true ]);
      const response = await Vote.reactToArticle(request, res, next);
      expect(response.message).to.equal(ARTICLE_DISLIKE_MSG);
    });

    it(`should return 
        ${ARTICLE_DISLIKE_MSG} when article is created`,
    async () => {

      const request = {
        params: {
          articleId: 8492742847
        },
        user: {
          id: 894824194819841
        },
        body: {
          vote: -1
        }
      };

      sinon.stub(ArticleVote, 'findOrCreate').returns([ null, false ]);
      const response = await Vote.reactToArticle(request, res, next);
      expect(response.message).to.equal(ARTICLE_DISLIKE_MSG);
    });

    it('should hit the catch block if unknown error ocurs', async () => {
      sinon.stub(ArticleVote, 'findOne').throws();
      await Vote.reactToArticle(req, res, next);
      next.should.have.been.called;
    });
  });

  context('resetArticleVoteReaction test', () => {
    it('should call the ArticleVote model', () => {
      const updateSpy = sinon.spy(ArticleVote, 'update');
      Vote.resetArticleVoteReaction(req, res, next);
      updateSpy.should.have.been.called;
    });

    it(`should return ${ARTICLE_RESET_MSG}`, async () => {
      sinon.stub(ArticleVote, 'update').returns({});
      const response = await Vote
                      .resetArticleVoteReaction(req, res, next);
      expect(response.message).to.equal(ARTICLE_RESET_MSG);
    });

    it('should hit the catch block if unknown error ocurs', async () => {
      sinon.stub(ArticleVote, 'findOne').throws();
      await Vote.resetArticleVoteReaction(req, res, next);
      next.should.have.been.called;
    });
  });

  context('updateArticleVote test', () => {
    it('should return true', async () => {
      sinon.stub(ArticleVote, 'update').returns({});
      const response = await Vote.updateArticleVote(req, res, next);
      expect(response).to.equal(true);
    });

    it('should hit the catch block if unknown error ocurs', async () => {
      sinon.stub(ArticleVote, 'findOne').throws();
      await Vote.resetArticleVoteReaction(req, res, next);
      next.should.have.been.called;
    });
  });


  context('votesCount test', () => {
    it('should call findAndCountAll function', async () => {
      const findAndCountAllStub = sinon.stub(ArticleVote, 'findAndCountAll')
                                        .returns({});
      const id= 'myfakeId';
      await Vote.votesCount(req, res, next, id);
      findAndCountAllStub.should.have.been.calledOnce;
    });

    it('should set votesCount to zero', async () => {
      sinon.stub(ArticleVote, 'findAndCountAll').returns({ count: 0 });
      await Vote.votesCount(req, res, next);
    });

    it('should set votesCount to like count', async () => {
      sinon.stub(ArticleVote, 'findAndCountAll').returns({ count: 1 });
      await Vote.votesCount(req, res, next);
    });

    it('should hit the catch block if unknown error ocurs', async () => {
      sinon.stub(ArticleVote, 'findAndCountAll').throws();
      await Vote.votesCount(req, res, next);
      next.should.have.been.called;
    });
  });


  context('articleLikedByUser test', () => {
    it('should call the findOne function', async () => {
      const findOneStub = sinon.stub(ArticleVote, 'findOne').returns({});
      await Vote.articleLikedByUser(req, res, next);
      findOneStub.should.have.been.called;
    });

    it(`should return ${ARTICLE_NOT_LIKED_BY_USER_MSG}`, async () => {
      sinon.stub(ArticleVote, 'findOne').returns(false);
      const dbResponse = await Vote.articleLikedByUser(req, res, next);
      expect(dbResponse.message).to.equal(ARTICLE_NOT_LIKED_BY_USER_MSG);
    });

    it(`should return ${ARTICLE_LIKED_BY_USER_MSG}`, async () => {
      sinon.stub(ArticleVote, 'findOne').returns({});
      const dbResponse = await Vote.articleLikedByUser(req, res, next);
      expect(dbResponse.message).to.equal(ARTICLE_LIKED_BY_USER_MSG);
    });

    it('should hit the catch block if unknown error ocurs', async () => {
      sinon.stub(ArticleVote, 'findOne').throws();
      await Vote.articleLikedByUser(req, res, next);
      next.should.have.been.called;
    });
  });


  context(`POST ${VOTE_ROUTE_URL}/:articleId/like`, () => {
    it('should like an article', async () => {
      const vote = VoteFactory.build();
      const articleResponse = await chai.request(server)
            .post(`${VOTE_ROUTE_URL}/${articleId}/like`)
            .set('authorization', `Bearer ${token}`)
            .send(vote);
      expect(articleResponse.body).to.have.property('message');
      expect(articleResponse.body.message)
            .to.equal(ARTICLE_LIKE_MSG);
    });
  });

  context(`POST ${VOTE_ROUTE_URL}/:articleId/dislike`, () => {
    it('should dislike an article', async () => {
      const vote = VoteFactory.build({
        vote: -1
      });
      const articleResponse = await chai.request(server)
            .post(`${VOTE_ROUTE_URL}/${articleId}/dislike`)
            .set('authorization', `Bearer ${token}`)
            .send(vote);
      expect(articleResponse.body).to.have.property('message');
      expect(articleResponse.body.message)
            .to.equal(ARTICLE_DISLIKE_MSG);
    });
  });

  context(`PUT ${VOTE_ROUTE_URL}/:articleId/unlike`, () => {
    it('should unlike an article', async () => {
      const vote = VoteFactory.build({
        vote: 0
      });
      const articleResponse = await chai.request(server)
            .put(`${VOTE_ROUTE_URL}/${articleId}/unlike`)
            .set('authorization', `Bearer ${token}`)
            .send(vote);
      expect(articleResponse.body).to.have.property('message');
      expect(articleResponse.body.message)
            .to.equal(ARTICLE_RESET_MSG);
    });
  });
});
