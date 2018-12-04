import { expect } from 'chai';
import { sequelize, dataTypes } from 'sequelize-test-helpers';
import UserModel from '../../server/models/user';
import LoginMethod from '../../server/models/loginMethod';
import Profile from '../../server/models/profile';
import Articles from '../../server/models/articles';
import Comment from '../../server/models/comment';
import ArticleExpression from '../../server/models/articleExpression';
import CommentExpression from '../../server/models/commentExpression';
import CommentHistory from '../../server/models/commenthistory';
import Followers from '../../server/models/followers';
import Bookmark from '../../server/models/bookmark';
import ReportArticles from '../../server/models/reportarticles';
import Tags from '../../server/models/tags';

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
      expect(user).to.have.property('firstname');
    });

    it('The User model should have the property "lastname"', () => {
      expect(user).to.have.property('lastname');
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
      expect(user).to.have.property('email_notification');
    });
  });

  context('Check the User Model associations', () => {
    before(() => {
      User.associate({
        LoginMethod,
        Profile,
        Articles,
        Comment,
        ArticleExpression,
        CommentExpression,
        CommentHistory,
        Followers,
        Bookmark,
        ReportArticles,
        Tags
      });
    });
    context('Check the uniqueness of emails and usernames', () => {
      it('check if the username is unique', () => {
        expect(user.username).to.have.property('unique');
      });

      it('check if the email is unique', () => {
        expect(user.email).to.have.property('unique');
      });
    });

    it('The user model has a one-to-one association with the LoginMethod Model as "login"', () => {
      expect(User.hasOne.calledWith(LoginMethod)).to.equal(true);
    });

    it('The user model has a one-to-one association with the Profile Model as "profile"', () => {
      expect(User.hasOne.calledWith(Profile)).to.equal(true);
    });

    it('The user model has a one-to-many association with the Articles Model as "articles"', () => {
      expect(User.hasMany.calledWith(Articles)).to.equal(true);
    });

    it('The user model has a one-to-many association with the Comment Model as "com"', () => {
      expect(User.hasMany.calledWith(Comment)).to.equal(true);
    });

    it('The user model has a one-to-many association with the ArticleExpression Model as "artex"', () => {
      expect(User.hasMany.calledWith(ArticleExpression)).to.equal(true);
    });

    it('The user model has a one-to-many association with the CommentExpression Model as "comex"', () => {
      expect(User.hasMany.calledWith(CommentExpression)).to.equal(true);
    });

    it('The user model has a one-to-many association with the CommentHistory Model as "comhis"', () => {
      expect(User.hasMany.calledWith(CommentHistory)).to.equal(true);
    });

    it('The user model has a one-to-many association with the Followers Model as "fol"', () => {
      expect(User.hasMany.calledWith(Followers)).to.equal(true);
    });

    it('The user model has a one-to-many association with the Bookmark Model as "book"', () => {
      expect(User.hasMany.calledWith(Bookmark)).to.equal(true);
    });

    it('The user model has a one-to-many association with the ReportArticles Model as "report"', () => {
      expect(User.hasMany.calledWith(ReportArticles)).to.equal(true);
    });

    it('The user model has a one-to-many association with the Tags Model as "tags"', () => {
      expect(User.hasMany.calledWith(Tags)).to.equal(true);
    });
  });
});
