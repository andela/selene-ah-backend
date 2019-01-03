import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerConfig from '../docs/config/swaggerConfig';
import userAuth from './api/auth/userAuth';
import users from './api/users';
import fbAuth from './api/auth/strategy/fbAuth';
import googleAuth from './api/auth/strategy/googleAuth';
import twitterAuth from './api/auth/strategy/twitterAuth';
import followers from './api/follow';
import Authorize from './api/auth/authorize';
import articles from './api/articlesRoute';
import comment from './api/commentRoute';
import voteRouter from './api/vote';
import bookmark from './api/bookmark';
import rating from './api/rating';
import articleTag from './api/articleTagRoute';
import commentReaction from './api/commentReaction';

const router = Router();
router.use('/api/v1', commentReaction);
router.use('/api/v1', userAuth);
router.use('/api/v1', users);
router.use('/api/v1', fbAuth);
router.use('/api/v1', twitterAuth);
router.use('/api/v1', googleAuth);
router.use('/api/v1', followers);
router.use('/api/v1/role', Authorize);
router.use('/api/v1', articles);
router.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerConfig));
router.use('/api/v1', bookmark);
router.use('/api/v1', rating);
router.use('/api/v1', rating);
router.use('/api/v1', articleTag);
router.use('/api/v1', voteRouter);
router.use('/api/v1', comment);


export default router;
