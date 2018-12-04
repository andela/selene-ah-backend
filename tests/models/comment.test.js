import { sequelize, dataTypes } from 'sequelize-test-helpers';
import { expect } from 'chai';
import CommentModel from '../../server/models/comment';
import UserModel from '../../server/models/user';
import ArticleModel from '../../server/models/articles';

describe('models/comment', () => {
  const Comment = CommentModel(sequelize, dataTypes);
  const User = UserModel(sequelize, dataTypes);
  const Article = ArticleModel(sequelize, dataTypes);
  const comment = new Comment();

  before(() => {
    Comment.associate({ User });
    Comment.associate({ Article });
  });

  it('should have a valid model name', () => {
    expect(Comment.modelName).to.equal('Comment');
  });

  it('should have a property id', () => {
    expect(comment).to.have.property('id');
  });

  it('should have an association with UserModel', () => {
    expect(Comment.belongsTo.calledWith(User)).to.equal(true);
  });

  it('should have an association with ArticleModel', () => {
    expect(Comment.belongsTo.calledWith(Article)).to.equal(true);
  });
});
