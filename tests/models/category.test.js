import { expect } from 'chai';
import { sequelize, dataTypes } from 'sequelize-test-helpers';
import categoryModel from '../../server/models/category';
import Article from '../../server/models/article';

describe('models/category', () => {
  const Category = categoryModel(sequelize, dataTypes);
  const categoryInstance = new Category();
  it('should have valid model name ', () => {
    expect(Category.modelName).to.equal('Category');
  });
  it('should have property title', () => {
    expect(categoryInstance).to.have.property('title');
  });

  context('category associations with articles model', () => {
    before(() => {
      Category.associate({
        Article
      });
    });
    it('should define a hasMany association with articles', () => {
      expect(Category.hasMany.calledWith(Article)).to.equal(true);
    });
  });
});
