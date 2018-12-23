import { expect } from 'chai';
import sequelizeHelper from 'sequelize-test-helpers';
import commentReaction from '../../server/models/commentReaction';
import comment from '../../server/models/comment';
import user from '../../server/models/user';


const { sequelize, dataTypes } = sequelizeHelper;
describe('## Comment Likes model', () => {
  const CommentReactionModel = commentReaction(sequelize, dataTypes);
  const instance = new CommentReactionModel();
  context('properties tests', () => {
    it('should have a property of reaction', () => {
      expect(instance).to.have.property('reaction');
    });
  });

  context('Comment Likes associations', () => {
    const Comment = comment(sequelize, dataTypes);
    before(() => {
      CommentReactionModel.associate({ Comment });
    });
    it('should have a belongsTo relationship with comment model', () => {
      expect(CommentReactionModel.belongsTo.calledWith(Comment))
        .to.equal(true);
    });
  });

  context('Comment Likes associations', () => {
    const User = user(sequelize, dataTypes);
    before(() => {
      CommentReactionModel.associate({ User });
    });
    it('should have a belongsTo relationship with user model', () => {
      expect(CommentReactionModel.belongsTo.calledWith(User)).to.equal(true);
    });
  });
});
