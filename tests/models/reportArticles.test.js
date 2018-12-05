import { expect } from 'chai';
import sequelizeHelper from 'sequelize-test-helpers';
import ReportArticles from '../../server/models/reportarticles';
import user from '../../server/models/user';

const {
  sequelize,
  dataTypes,
} = sequelizeHelper;

describe('## Report Articles model', () => {
  const ReportArticleModel = ReportArticles(sequelize, dataTypes);
  const instance = new ReportArticleModel();
  context('properties tests', () => {
    it('should have a property of report', () => {
      expect(instance).to.have.property('report');
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
