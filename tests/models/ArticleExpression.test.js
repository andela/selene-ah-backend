import { sequelize, dataTypes, checkModelName } from 'sequelize-test-helpers';
import { expect } from 'chai';
import ArticleExpressionModel from '../../server/models/articleExpression';
import Article from '../../server/models/article';
import User from '../../server/models/user';

describe('ArticleExpression', () => {
  const ArticleExpression = ArticleExpressionModel(sequelize, dataTypes);
  checkModelName(ArticleExpression)('ArticleExpression');
  const instance = new ArticleExpression();

  context('properties tests', () => {
    it('should have a property of emotion', () => {
      expect(instance).to.have.property('emotion');
    });
  });
  context('assocations', () => {
    before(() => {
      ArticleExpression.associate({ Article, User });
    });

    it('should have a belongsTo relationship with Articles model', () => {
      expect(ArticleExpression.belongsTo.calledWith(Article)).to.equal(true);
    });

    it('should have a belongsTo relationship with LoginMethod model', () => {
      expect(ArticleExpression.belongsTo.calledWith(User)).to.equal(true);
    });
  });
});
