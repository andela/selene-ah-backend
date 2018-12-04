import chaiHttp from 'chai-http';
import chai, { expect } from 'chai';
import sequelizeHelper from 'sequelize-test-helpers';
import ReportArticles from '../../server/models/reportarticles';
import user from '../../server/models/user';
import articles from '../../server/models/articles';

const {
    sequelize,
    dataTypes,
    checkModelName,
} = sequelizeHelper;

describe('## Report Articles model', () => {
    const ReportArticleModel = ReportArticles(sequelize, dataTypes)
    const instance = new ReportArticleModel()
    checkModelName(ReportArticleModel)('ReportArticles')
    context('Report Articles Model', () => {
        it('should have property report', () => {
            expect(instance).to.have.property('report');
        })
    })
    context('Report Articles associations should', () => {
        const User = user(sequelize, dataTypes);
        before(() => {
            ReportArticleModel.associate({ User })
        })
        it('defined a belongsTo association with User model', () => {
            expect(ReportArticleModel.belongsTo.calledWith(User)).to.equal(true)
        })
    })


})

