import { Router } from 'express';
import userAuth from './api/auth/userAuth';
import users from './api/users';
import fbAuth from './api/auth/strategy/fbAuth';
import googleAuth from './api/auth/strategy/googleAuth';
import twitterAuth from './api/auth/strategy/twitterAuth';
import userProfile from './api/userProfileRoute';
import followers from './api/follow';
import Authorize from './api/auth/authorize';
import articles from './api/articlesRoute';

const router = Router();
router.use('/api/v1', userAuth);
router.use('/api/v1', users);
router.use('/api/v1', userProfile);
router.use('/api/v1', fbAuth);
router.use('/api/v1', twitterAuth);
router.use('/api/v1', googleAuth);
router.use('/api/v1', followers);
router.use('/api/v1/role', Authorize);
router.use('/api/v1', articles);


export default router;
