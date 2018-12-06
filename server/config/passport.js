import passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { config } from 'dotenv';

config();
const { FACEBOOK_APP_ID, FACEBOOK_APP_SECRET } = process.env;

passport.use(new FacebookStrategy({
  clientID: FACEBOOK_APP_ID,
  clientSecret: FACEBOOK_APP_SECRET,
  callbackURL: '/api/auth/facebook/callback'
}, (accessToken, refreshToken, profile, done) => {
  done(null, profile);
}));
