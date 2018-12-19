import passport from 'passport';
import TwitterStrategy from 'passport-twitter';
import JWTHelper from '../../../helpers/JWTHelper';
import models from '../../../models';
import removeDateStampAndPassword from
'../../../helpers/removeDateStampAndPassword';
import generateRandomPassword from
'../../../helpers/generatePassword';
import { REGULAR } from '../../../helpers/constants';

const {
  User,
} = models;

const duration = '1d';
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
  * @param {string} accessToken
  * @param {string} tokenSecret
  * @param {object} profile
  * @param {object} done
  * @returns {object} passport
  */
  static async twitterStrategyCallback (accessToken, tokenSecret,
                                        profile, done) {
    /*eslint no-underscore-dangle: ["error", { "allow": ["_json"] }]*/
    const data = profile._json;
    const userData = {
      email: data.email || `${data.screen_name}@twitter.com`,
      firstname: ' ',
      lastname: ' ',
      username: data.screen_name,
      token: accessToken,
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
        role: REGULAR,
        password: generateRandomPassword()
      }}).spread((user, created) => {
        const token = JWTHelper.generateToken(
          removeDateStampAndPassword(user.dataValues), duration
          );
        userData.token = token;
        userData.isNewUser = created;
        done(null, userData);
      })
      .catch((err) => {
        throw err;
      });
  }
}
