/* eslint-disable max-len */
import {
  Router
} from 'express';
import passport from 'passport';

import socialMediaControllerCallback from '../../../../../controllers/auth/socialMediaControllerCallback';


const router = Router();

router.get('/auth/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));
router.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/',
    session: false
  }), socialMediaControllerCallback.socialMediaControllerCallback);

export default router;
