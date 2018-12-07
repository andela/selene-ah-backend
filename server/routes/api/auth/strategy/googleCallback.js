import {
  Router
} from 'express';
import passport from 'passport';
import GoogleAuth from '../../../../helpers/auth/googleAuthenticate';

const router = Router();

router.get(
  '/callback',
  passport.authenticate('google', {
    failureRedirect: '/',
    session: false
  }), (req, res) => GoogleAuth.googleRouteCallback(req, res));

export default router;
