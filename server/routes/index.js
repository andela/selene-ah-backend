import { Router } from 'express';
// import passport from 'passport';
import userAuth from './api/auth/userAuth';
import fbAuth from './api/auth/strategy/fbAuth';
import googleAuth from './api/auth/strategy/googleAuth';
import googleCallback from './api/auth/strategy/googleCallback';

const router = Router();
router.use('/api/v1', userAuth);
router.use('/api/v1', fbAuth);
router.use('/api/v1', googleAuth);
router.use('/auth/google/', googleCallback);



export default router;
