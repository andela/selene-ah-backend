import passport from 'passport';
import FacebookStrategy from '../controllers/auth/strategies/facebookStrategy';
import GoogleLogin from '../controllers/auth/strategies/googleStrategy';
import TwitterLogin from '../controllers/auth/strategies/twitterStrategy';


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
