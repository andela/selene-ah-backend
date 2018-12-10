import passport from 'passport';
import dotenv from 'dotenv';
import GoogleLogin from './strategies/googleStrategy';

dotenv.config();

/**
 * @description Serializing and deserializing passport
 * @param {object} app
 * @returns {function} googleStrategy
 */
export default (app) => {
  app.use(passport.initialize());
  GoogleLogin.googleStrategy();
};
