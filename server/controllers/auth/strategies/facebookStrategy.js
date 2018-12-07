import passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { config } from 'dotenv';

import db from '../../../models';
import hashPassword from '../../../helpers/paswordHash';

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
   * @param {*} accessToken
   * @param {*} refreshToken
   * @param {*} profile
   * @param {*} done
   * @returns {*} Done function
   */
  static facebookCallback(accessToken, refreshToken, profile, done) {
    const names = profile.displayName.split(' ');
    const password = hashPassword(profile.id);
    const userDetails = {
      firstName: names[0].trim(),
      lastName: names[1].trim(),
      userName: names[1].trim(),
      email: `${profile.id}@facebook.com`,
      password,
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
      Facebook.createUserProfile(user, created, userDetails, accessToken);
      done(null, userDetails);
    });
  }

  /**
   * @param {*} req
   * @param {*} res
   * @returns {res} response
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
   * @param {*} user
   * @param {*} created
   * @param {*} userDetails
   * @param {*} accessToken
   * @returns {bool} boolean
   */
  static createUserProfile(user, created, userDetails, accessToken) {
    userDetails.isANewUser = created;
    userDetails.token = accessToken;
    if(!created) {
      Profile.create({
        role: 'user',
        userId: user.dataValues.id
      });
    }
  }
}

export default Facebook;
