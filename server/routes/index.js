import { Router } from 'express';
// import passport from 'passport';
import userAuth from './api/auth/userAuth';
import fbAuth from './api/auth/strategy/fbAuth';
import googleAuth from './api/auth/strategy/googleAuth';
import twitterAuth from './api/auth/strategy/twitterAuth';

const router = Router();
router.use('/api/v1', userAuth);
router.use('/api/v1', fbAuth);
router.use('/api/v1',twitterAuth);
router.use('/api/v1', googleAuth);

export default router;
