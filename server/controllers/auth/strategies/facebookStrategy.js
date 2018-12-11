import passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { config } from 'dotenv';
import JWTHelper from '../../../helpers/JWTHelper';

import db from '../../../models';
import passwordHash from '../../../helpers/passwordHash';
import removeDateStampAndPassword from
'../../../helpers/removeDateStampAndPassword';

config();

const { FACEBOOK_APP_ID, FACEBOOK_APP_SECRET } = process.env;
const { User, Profile } = db;
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
      callbackURL: '/api/v1/auth/facebook/callback'
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
  static facebookCallback(accessToken, refreshToken, profile, done) {
    const names = profile.displayName.split(' ');
    const hashedPassword = passwordHash.hashPassword(profile.id);
    const userDetails = {
      firstName: names[0].trim(),
      lastName: names[1].trim(),
      userName: names[1].trim(),
      email: `${profile.id}@facebook.com`,
      password: hashedPassword,
    };

    User
    .findOrCreate({ where: { email: userDetails.email },
      defaults: {
        firstName: userDetails.firstName,
        lastName: userDetails.lastName,
        userName: userDetails.userName,
        email: userDetails.email,
        password: userDetails.password,
        verified: true
       }
    }).spread((user, created) => {
      const token = JWTHelper.generateToken(
        removeDateStampAndPassword(user.dataValues)
        );
      userDetails.token = token;
      Facebook.createUserProfile(user, created, userDetails);
      done(null, userDetails);
    });
  }

  /**
   * @param {object} req
   * @param {object} res
   * @returns {object} response
   */
  static facebookControllerCallback(req, res) {
    const { token, isANewUser } = req.user;
    if(!isANewUser) {
      return res.json({
        msg: 'Registration Successful',
        token,
        profile: req.user
      });
    }
    return res.json({
      msg: 'Login Successful',
      token,
      profile: req.user
    });
  }

  /**
   *
   * @param {object} user
   * @param {boolean} created
   * @param {object} userDetails
   * @returns {boolean} boolean
   */
  static createUserProfile(user, created, userDetails) {
    userDetails.isANewUser = created;
    if(!created) {
      Profile.create({
        role: 'user',
        userId: user.dataValues.id
      });
    }
  }
}

export default Facebook;
