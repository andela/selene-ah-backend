import { expect } from 'chai';
import { sequelize, dataTypes } from 'sequelize-test-helpers';
import UserModel from '../../server/models/user';
import Article from '../../server/models/article';
import Follower from '../../server/models/follower';
import Rating from '../../server/models/rating';
import Report from  '../../server/models/reportArticle';

describe('User Model', () => {
  const User = UserModel(sequelize, dataTypes);
  const user = new User();

  context('Check if the User model exists', () => {
    it('should have model valid model name (User) ', () => {
      expect(User.modelName).to.equal('User');
    });
  });

  context('Check the properties of the User Model', () => {
    it('The User model should have the property "firstname"', () => {
      expect(user).to.have.property('firstName');
    });

    it('The User model should have the property "lastname"', () => {
      expect(user).to.have.property('lastName');
    });

    it('The User model should have the property "email"', () => {
      expect(user).to.have.property('email');
    });

    it('The User model should have the property "password"', () => {
      expect(user).to.have.property('password');
    });

    it('The User model should have the property "verified"', () => {
      expect(user).to.have.property('verified');
    });

    it('The User model should have the property "blocked"', () => {
      expect(user).to.have.property('blocked');
    });

    it('The User model should have the property "email_notification"', () => {
      expect(user).to.have.property('emailNotification');
    });
  });

  context('Check the uniqueness of emails and usernames', () => {
    it('check if the username is unique', () => {
      expect(user.userName).to.have.property('unique');
    });

    it('check if the email is unique', () => {
      expect(user.email).to.have.property('unique');
    });
  });

  context('Check the User Model associations', () => {
    before(() => {
      User.associate({
        Article,
        Rating,
        Follower,
        Report
      });
    });

    it('should have a one-to-many association with the Articles Model', () => {
      expect(User.hasMany.calledWith(Article)).to.equal(true);
    });

    it('should have a one-to-many association with the Rating Model', () => {
      expect(User.hasMany.calledWith(Rating)).to.equal(true);
    });

    it('should have one-to-many association with the Followers Model', () => {
      expect(User.hasMany.calledWith(Follower)).to.equal(true);
    });

    it('should have one-to-many association with the Report Model',
     () => {
      expect(User.hasMany.calledWith(Report)).to.equal(true);
    });
  });
});
