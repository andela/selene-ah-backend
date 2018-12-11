import passport from 'passport';
import googleStrategyOauth2 from 'passport-google-oauth';
import models from '../../../models';
import passwordHash from '../../passwordHash';
import JWTHelper from '../../JWTHelper';
import removeDateStampAndPassword from '../../removeDateStampAndPassword';

/**
 * @description A class that implements google strategy for passport
 */
export default class GoogleLogin{

  /**
   * @description Generate a random password for every user authenticated
   * @returns {function} hashPassword
   */
  static generatePassword() {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const numbersSpecialChars = '0123456789*&^%$##@!';
    const random = alphabet + numbersSpecialChars;
    let password = '';
    for (let i = 0; i < 8; i++) {
      password += random.charAt(Math.floor(Math.random() * random.length));
    }
    return passwordHash.hashPassword(password);
  }

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
          callbackURL: 'http://localhost:3000/auth/google/callback'
        }, GoogleLogin.googleStrategyCallback )
    );
  }

/**
 * @description creates a new user
 * @param {object} user
 * @param {boolean} created
 * @param {object} userData
 * @returns {object} true
 */
static createNewSocialMediaUser(user, created, userData) {
  const {
    Profile,
  } = models;
  userData.isNewUser = created;
  if (created) {
    Profile.create({
        userId: user.id,
        role: 'user'
      })
      .then(id => {
        return id;
      });
  }
  return true;
}
  /**
  * @description callback for google strategy
  * @param {string} accessToken
  * @param {string} refreshToken
  * @param {object} profile
  * @param {object} done
  * @returns {object} passport
  */
  static googleStrategyCallback (accessToken, refreshToken, profile, done) {
    const userData = {
      email: profile.emails[0].value,
      firstname: profile.name.givenName,
      lastname: profile.name.familyName,
      username: profile.emails[0].value,
      token: accessToken,
      profile,
    };
    const {
      User,
    } = models;
    User.findOrCreate({where: {email: userData.email},
      defaults: {
        email: userData.email,
        firstName: userData.firstname,
        lastName: userData.lastname,
        userName: userData.username,
        verified: true,
        blocked: false,
        emailNotification: true,
        password: GoogleLogin.generatePassword()
      }}).spread((user, created) => {
        const token = JWTHelper.generateToken(
          removeDateStampAndPassword(user.dataValues)
          );
        userData.token = token;
        GoogleLogin.createNewSocialMediaUser(user,created,userData);
        done(null, userData);
      })
      .catch((err) => {
       throw err;
      });
  }
}
