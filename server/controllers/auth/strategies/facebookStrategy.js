import passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { config } from 'dotenv';
import JWTHelper from '../../../helpers/JWTHelper';

import db from '../../../models';
import passwordHash from '../../../helpers/passwordHash';
import removeDateStampAndPassword from
'../../../helpers/removeDateStampAndPassword';
import { REGULAR } from '../../../helpers/constants';

config();
const { FACEBOOK_APP_ID, FACEBOOK_APP_SECRET,
  FACEBOOK_CALLBACK_URL } = process.env;
const { User } = db;
const duration = '1d';
/**
 *
 *
 * @class Facebook
 */
class Facebook {
  /**
   * @returns {fn} - Middleware for facebook strategy
   */
  static facebookStrategy() {
    passport.use(new FacebookStrategy({
      clientID: FACEBOOK_APP_ID,
      clientSecret: FACEBOOK_APP_SECRET,
      callbackURL: FACEBOOK_CALLBACK_URL,
    }, Facebook.facebookCallback));
  }

  /**
   * @description Our facebookStrategy Callback function
   * @param {string} accessToken
   * @param {string} refreshToken
   * @param {object} profile
   * @param {fn} done
   * @returns {function} Done
   */
  static async facebookCallback(accessToken, refreshToken, profile, done) {
    const names = profile.displayName.split(' ');
    const hashedPassword = passwordHash.hashPassword(profile.id);
    const userDetails = {
      firstName: names[0].trim(),
      lastName: names[1].trim(),
      userName: names[1].trim(),
      email: `${profile.id}@facebook.com`,
      password: hashedPassword,
      token: accessToken,
    };

    User
    .findOrCreate({ where: { email: userDetails.email },
      defaults: {
        firstName: userDetails.firstName,
        lastName: userDetails.lastName,
        userName: userDetails.userName,
        email: userDetails.email,
        password: userDetails.password,
        role: REGULAR,
        verified: true
       }
    }).spread((user, created) => {
      const token = JWTHelper.generateToken(
        removeDateStampAndPassword(user.dataValues), duration
        );
      userDetails.token = token;
      userDetails.isNewUser = created;
      done(null, userDetails);
    });
  }

  /**
   * @param {object} req
   * @param {object} res
   * @returns {object} response
   */
  static facebookControllerCallback(req, res) {
    const { token, isNewUser } = req.user;
    if(isNewUser) {
      return res.status(201).json({
        message: 'Registration Successful',
        token,
      });
    }
    return res.status(200).json({
      message: 'Login Successful',
      token,
    });
  }
}

export default Facebook;
