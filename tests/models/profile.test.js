import { expect } from 'chai';
import {
  sequelize, dataTypes, checkModelName, checkPropertyExists
} from 'sequelize-test-helpers';
import ProfileModel from '../../server/models/profile';
import UserModel from '../../server/models/user';

describe('Model for Profile', () => {
  const Profile = ProfileModel(sequelize, dataTypes);
  const profile = new Profile();
  checkModelName(Profile)('Profile');
  context('properties', () => {
<<<<<<< HEAD
    ['gender', 'twitterUrl', 'role', 'imageurl', 'facebookUrl', 'bio', 'dateOfBirth'].forEach(checkPropertyExists(profile));
=======
    ['gender', 'twitterUrl', 'role', 'imageUrl', 'facebookUrl', 'bio', 'dateOfBirth'].forEach(checkPropertyExists(profile));
>>>>>>> fix(model): fix bug on models
  });
  context('should check associations', () => {
    const User = UserModel(sequelize, dataTypes);
    before(() => {
      Profile.associate({ User });
    });
    it('should have a belongsTo association with UserModel', () => {
      expect(Profile.belongsTo.calledWith(User)).to.equal(true);
    });
  });
});
