import { expect } from 'chai';
import sequelizeHelper from 'sequelize-test-helpers';
import Report from '../../server/models/reportArticle';
import user from '../../server/models/user';

const { sequelize, dataTypes } = sequelizeHelper;

describe('## Report Articles model', () => {
  const ReportArticleModel = Report(sequelize, dataTypes);
  const instance = new ReportArticleModel();
  context('properties tests', () => {
    it('should have a property of content', () => {
      expect(instance).to.have.property('content');
    });
  });
  context('Report Articles associations should', () => {
    const User = user(sequelize, dataTypes);
    before(() => {
      ReportArticleModel.associate({ User });
    });
    it('should have a belongsTo relationship with user model', () => {
      expect(ReportArticleModel.belongsTo.calledWith(User)).to.equal(true);
    });
  });
});
