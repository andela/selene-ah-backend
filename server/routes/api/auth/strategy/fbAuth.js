import { Router } from 'express';
import passport from 'passport';
import Facebook
from '../../../../controllers/auth/strategies/facebookStrategy';

const router = Router();

router.get('/auth/facebook',
  passport.authenticate('facebook', { session: false }));

router.get('/auth/facebook/callback',
  passport.authenticate('facebook',
  { session: false }),
  Facebook.facebookControllerCallback );

export default router;
