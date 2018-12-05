import { expect } from 'chai';
import { sequelize, dataTypes } from 'sequelize-test-helpers';
import CommentHistoryModel from '../../server/models/commentHistory';
import Comment from '../../server/models/comment';

describe('CommentHistory Model', () => {
  const CommentHistory = CommentHistoryModel(sequelize, dataTypes);
  const commentHistory = new CommentHistory();

  context('Check if the CommentHistory model exists', () => {
    it('should have model valid model name (CommentHistory) ', () => {
      expect(CommentHistory.modelName).to.equal('CommentHistory');
    });
  });

  context('Check the properties of the User Model', () => {
    it('The CommentHistory model should have the property "id"', () => {
      expect(commentHistory).to.have.property('id');
    });

    it('The CommentHistory model should have the property "commentId"', () => {
      expect(commentHistory).to.have.property('commentId');
    });

    it('The CommentHistory model should have the property "comment_history"',
      () => {
        expect(commentHistory).to.have.property('commentHistory');
      });
  });

  context('Check the CommentHistory Model associations', () => {
    before(() => {
      CommentHistory.associate({
        Comment
      });
    });

    it('should have a many-to-one association with the Comment',
      () => {
        expect(CommentHistory.belongsTo.calledWith(Comment)).to.equal(true);
      });
  });
});
