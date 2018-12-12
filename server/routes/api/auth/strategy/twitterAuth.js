import {
  Router
} from 'express';
import passport from 'passport';

import socialMediaControllerCallback from
'../../../../controllers/auth/socialMediaControllerCallback';

const router = Router();

router.get('/auth/twitter',  passport.authenticate('twitter'));
router.get(
  '/auth/twitter/callback',
  passport.authenticate('twitter', {
    failureRedirect: '/',
    session: false
  }), (req, res) => socialMediaControllerCallback(req, res));

export default router;
