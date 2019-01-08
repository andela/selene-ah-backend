/* eslint-disable max-len */
import {
  Router
} from 'express';
import passport from 'passport';
import socialMediaControllerCallback from '../../../../../controllers/auth/socialMediaControllerCallback';

const router = Router();

router.get('/auth/twitter',  passport.authenticate('twitter'));
router.get(
  '/auth/twitter/callback',
  passport.authenticate('twitter', {
    failureRedirect: '/',
    session: false
  }), socialMediaControllerCallback.socialMediaControllerCallback);

export default router;
