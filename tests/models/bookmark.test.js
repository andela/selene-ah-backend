import { sequelize, dataTypes } from 'sequelize-test-helpers';
import { expect } from 'chai';
import BookmarkModel from '../../server/models/bookmark';
import UserModel from '../../server/models/user';
import ArticleModel from '../../server/models/article';

describe('models/bookmark', () => {
  const Bookmark = BookmarkModel(sequelize, dataTypes);
  const User = UserModel(sequelize, dataTypes);
  const Article = ArticleModel(sequelize, dataTypes);
  const bookmark = new Bookmark();

  before(() => {
    Bookmark.associate({ User });
    Bookmark.associate({ Article });
  });

  it('should have a valid model name ', () => {
    expect(Bookmark.modelName).to.equal('Bookmark');
  });

  it('should have property id', () => {
    expect(bookmark).to.have.property('id');
  });

  it('should have an association with UserModel', () => {
    expect(Bookmark.belongsTo.calledWith(User)).to.equal(true);
  });

  it('should have an association with ArticleModel', () => {
    expect(Bookmark.belongsTo.calledWith(Article)).to.equal(true);
  });
});
