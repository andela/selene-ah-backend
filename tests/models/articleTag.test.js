import sequelizeTestHelper from 'sequelize-test-helpers';
import { expect } from 'chai';
import articleTag from '../../server/models/articleTag';
import articleModel from '../../server/models/article';
import tagModel from '../../server/models/tag';

const {
  sequelize,
  dataTypes
} = sequelizeTestHelper;

describe('Models for ArticleTag', () => {
  const ArticleTag = articleTag(sequelize, dataTypes);
  context('associations', () => {
    const Article = articleModel(sequelize, dataTypes);
    const Tag = tagModel(sequelize, dataTypes);
    before(() => {
      ArticleTag.associate({ Article });
      ArticleTag.associate({ Tag });
    });
    it('should have model name ArticleTag', () => {
      expect(ArticleTag.modelName).to.equal('ArticleTag');
    });
    it('should define a belongsTo association with Articles', () => {
      expect(ArticleTag.belongsTo.calledWith(Article)).to.equal(true);
    });
    it('should define a belongsTo association with Tags', () => {
      expect(ArticleTag.belongsTo.calledWith(Tag)).to.equal(true);
    });
  });
});
