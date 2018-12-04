import { expect } from 'chai';
import { sequelize, dataTypes } from 'sequelize-test-helpers';
import category from '../../server/models/category';
import Articles from '../../server/models/articles';

describe('models/category', () => {
  const categories = category(sequelize, dataTypes);
  const categoryInstance = new categories();
  it('should have valid model name ', () => {
    expect(categories.modelName).to.equal('Category');
  });
  it('should have property title', () => {
    expect(categoryInstance).to.have.property('title');
  });

  context('category associations with articles model', () => {
    before(() => {
      categories.associate({
        Articles
      });
    });
    it('should define a hasMany association with articles', () => {
      expect(categories.hasMany.calledWith(Articles)).to.equal(true);
    });
  });
});
