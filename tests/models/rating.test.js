import { expect } from 'chai';
import { sequelize, dataTypes } from 'sequelize-test-helpers';
import RatingModel from '../../server/models/rating';

describe('Rating Model', () => {
  const Rating = RatingModel(sequelize, dataTypes);
  const rating = new Rating();

  context('Check if the User model exists', () => {
    it('should have model valid model name (User) ', () => {
      expect(Rating.modelName).to.equal('Rating');
    });
  });

  context('Check the properties of the User Model', () => {
    it('The Rating  model should have the property "id"', () => {
      expect(rating).to.have.property('id');
    });

    it('The Rating model should have the property "rating"', () => {
      expect(rating).to.have.property('articleRating');
    });

    it('The Rating model should have the property "userId"', () => {
      expect(rating).to.have.property('userId');
    });

    it('The Rating model should have the property "articleId"', () => {
      expect(rating).to.have.property('articleId');
    });
  });
});
