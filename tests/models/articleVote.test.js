import { sequelize, dataTypes } from 'sequelize-test-helpers';
import { expect } from 'chai';
import User from '../../server/models/user';
import ArticleVoteModel from '../../server/models/articleVotes';
import Article from '../../server/models/article';


describe('#ArticleVote Test', () => {
  const ArticleVote = ArticleVoteModel(sequelize, dataTypes);
  const instanceOfArticleVote = new ArticleVote();

  it('should have a model named ArticleVote', () => {
    expect(ArticleVote.modelName).to.equal('ArticleVote');
  });

  context('#properties tests', () => {
    it('should have a property called vote', () => {
      expect(instanceOfArticleVote).to.have.property('vote');
    });

    it('should have property called cratedAt', () => {
      expect(instanceOfArticleVote).to.have.property('createdAt');
    });

    it('should have property called updatedAt', () => {
      expect(instanceOfArticleVote).to.have.property('updatedAt');
    });
  });

  context('#associations tests', () => {
    before(() => {
      ArticleVote.associate({ User, Article });
    });

    it('ahould have a belongsTo relationship with User model', () => {
      expect(ArticleVote.belongsTo.calledWith(User)).to.equal(true);
    });

    it('should have a belongsTo relationship with the Article model', () => {
      expect(ArticleVote.belongsTo.calledWith(Article)).to.equal(true);
    });
  });
});
