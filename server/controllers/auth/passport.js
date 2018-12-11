import passport from 'passport';
import FacebookStrategy from './strategies/facebookStrategy';
import GoogleLogin from './strategies/googleStrategy';
import TwitterLogin from './strategies/twitterStrategy';


/**
 * @description Serializing and deserializing passport
 * @param {object} app
 * @returns {function} googleStrategy
 */
export default (app) => {
  app.use(passport.initialize());
  FacebookStrategy.facebookStrategy();
  GoogleLogin.googleStrategy();
  TwitterLogin.twitterStrategy();
};
