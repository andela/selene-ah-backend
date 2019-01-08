/* eslint-disable max-len */
import { Router } from 'express';
import passport from 'passport';
import socialMediaControllerCallback from '../../../../../controllers/auth/socialMediaControllerCallback';


const router = Router();

router.get('/auth/facebook',
  passport.authenticate('facebook', { session: false }));

router.get('/auth/facebook/callback',
  passport.authenticate('facebook',
  { session: false }),
  socialMediaControllerCallback.socialMediaControllerCallback
  );

export default router;
