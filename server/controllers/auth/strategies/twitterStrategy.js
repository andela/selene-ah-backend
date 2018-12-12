import passport from 'passport';
import TwitterStrategy from 'passport-twitter';

import models from '../../../models';
import createNewSocialMediaUser from
'../../../helpers/createNewSocialMediaUser';
import generateRandomPassword from
'../../../helpers/generatePassword';

const {
  User,
} = models;

/**
 * @description A class that implements Twitter strategy for passport
 */
export default class TwitterLogin{

  /**
  * @description Setup twitter strategy for passport
  * @returns {object} passport
  */
  static twitterStrategy() {
    return passport.use(new TwitterStrategy({
      consumerKey: process.env.TWITTER_CONSUMER_KEY,
      consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
      userProfileURL: process.env.USER_PROFILE_URL,
      callbackURL: process.env.TWITTER_CALLBACK_URL,
     }, TwitterLogin.twitterStrategyCallback )
    );
  }

  /**
  * @description callback for twitter strategy
  * @param {string} token
  * @param {string} tokenSecret
  * @param {object} profile
  * @param {object} done
  * @returns {object} passport
  */
  static twitterStrategyCallback (token, tokenSecret, profile, done) {
    /*eslint no-underscore-dangle: ["error", { "allow": ["_json"] }]*/
    const data = profile._json;
    const userData = {
      email: data.email || `${data.screen_name}@twitter.com`,
      firstname: ' ',
      lastname: ' ',
      username: data.screen_name,
      token,
      profile,
    };
    User.findOrCreate({where: {email: userData.email},
      defaults: {
        email: userData.email,
        firstName: userData.firstname,
        lastName: userData.lastname,
        userName: userData.username,
        verified: true,
        blocked: false,
        emailNotification: true,
        password: generateRandomPassword()
      }}).spread((user, created) => {
        createNewSocialMediaUser(user,created,userData);
        done(null, userData);
      })
      .catch((err) => {
        throw err;
      });
  }
}
