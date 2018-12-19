import passport from 'passport';
import googleStrategyOauth2 from 'passport-google-oauth';
import models from '../../../models';
import JWTHelper from '../../../helpers/JWTHelper';
import removeDateStampAndPassword from
'../../../helpers/removeDateStampAndPassword';
import generateRandomPassword from
'../../../helpers/generatePassword';
import createNewSocialMediaUser from
'../../../helpers/createNewSocialMediaUser';
import { REGULAR } from '../../../helpers/constants';


const duration = '1d';
/**
 * @description A class that implements google strategy for passport
 */
export default class GoogleLogin{
  /**
  * @description Setup google strategy for passport
  * @returns {object} passport
  */
  static googleStrategy() {
    const GoogleStrategy = googleStrategyOauth2.OAuth2Strategy;
    passport.use(
      new GoogleStrategy({
          clientID: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          callbackURL: process.env.GOOGLE_CALLBACK_URL
        }, GoogleLogin.googleStrategyCallback )
    );
  }

  /**
  * @description callback for google strategy
  * @param {string} accessToken
  * @param {string} refreshToken
  * @param {object} profile
  * @param {object} done
  * @returns {object} passport
  */
  static async googleStrategyCallback (accessToken, refreshToken,
                                       profile, done)
  {
    const userData = {
      email: profile.emails[0].value,
      firstname: profile.name.givenName,
      lastname: profile.name.familyName,
      username: profile.emails[0].value,
      token: accessToken,
      profile,
    };
    const { User } = models;
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
        createNewSocialMediaUser(user,created,userData);
        done(null, userData);
      })
      .catch((err) => {
        throw err;
      });
  }
}
