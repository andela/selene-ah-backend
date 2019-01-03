import sequelizeTestHelper from 'sequelize-test-helpers';
import { expect } from 'chai';
import articleTag from '../../server/models/articleTag';

const {
  sequelize,
  dataTypes
} = sequelizeTestHelper;

describe('Models for ArticleTag', () => {
  const ArticleTag = articleTag(sequelize, dataTypes);
  context('associations', () => {
    it('should have model name ArticleTag', () => {
      expect(ArticleTag.modelName).to.equal('ArticleTag');
    });
  });
});
