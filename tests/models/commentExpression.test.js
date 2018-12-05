import { expect } from 'chai';
import sequelizeHelper from 'sequelize-test-helpers';
import CommentExpression from '../../server/models/commentExpression';
import comment from '../../server/models/comment';
import user from '../../server/models/user';


const { sequelize, dataTypes } = sequelizeHelper;
describe('## Comment Expression model', () => {
  const CommentExpressionModel = CommentExpression(sequelize, dataTypes);
  const instance = new CommentExpressionModel();
  context('properties tests', () => {
    it('should have a property of emotion', () => {
      expect(instance).to.have.property('emotion');
    });
  });

  context('Comment Expression associations', () => {
    const Comment = comment(sequelize, dataTypes);
    before(() => {
      CommentExpressionModel.associate({ Comment });
    });
    it('should have a belongsTo relationship with comment model', () => {
      expect(CommentExpressionModel.belongsTo.calledWith(Comment))
        .to.equal(true);
    });
  });

  context('Comment Expression associations', () => {
    const User = user(sequelize, dataTypes);
    before(() => {
      CommentExpressionModel.associate({ User });
    });
    it('should have a belongsTo relationship with user model', () => {
      expect(CommentExpressionModel.belongsTo.calledWith(User)).to.equal(true);
    });
  });
});
