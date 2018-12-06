import passport from 'passport';
import FacebookStrategy from './strategies/facebookStrategy';

export default (app) => {
  FacebookStrategy.facebookStrategy();
  app.use(passport.initialize());
};
