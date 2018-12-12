import models from '../models';

/**
 * @description creates a new user
 * @param {object} user
 * @param {boolean} created
 * @param {object} userData
 * @returns {object} true
 */
const createNewSocialMediaUser = (user, created, userData) => {
  const {
    Profile,
  } = models;
  userData.isNewUser = created;
  if (created) {
    Profile.create({
      userId: user.id,
      role: 'user'
    });
  }
};

export default createNewSocialMediaUser;
