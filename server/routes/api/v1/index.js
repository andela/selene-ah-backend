import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerConfig from '../../../docs/config/swaggerConfig';
import userAuth from './auth/userAuthRoute';
import users from './usersRoute';
import fbAuth from './auth/strategy/fbAuth';
import googleAuth from './auth/strategy/googleAuth';
import twitterAuth from './auth/strategy/twitterAuth';
import followers from './followRoute';
import Authorize from './auth/authorizeRoute';
import articles from './articlesRoute';
import comment from './commentRoute';
import voteRouter from './voteRoute';
import bookmark from './bookmarkRoute';
import rating from './ratingRoute';
import articleTag from './articleTagRoute';
import categories from './categoryRoutes';
import userProfile from './userProfileRoute';

const v1Router = Router();

v1Router.use('/api/v1', userAuth);
v1Router.use('/api/v1', users);
v1Router.use('/api/v1', fbAuth);
v1Router.use('/api/v1', twitterAuth);
v1Router.use('/api/v1', googleAuth);
v1Router.use('/api/v1', followers);
v1Router.use('/api/v1', Authorize);
v1Router.use('/api/v1', articles);
v1Router.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerConfig));
v1Router.use('/api/v1', bookmark);
v1Router.use('/api/v1', rating);
v1Router.use('/api/v1', articleTag);
v1Router.use('/api/v1', voteRouter);
v1Router.use('/api/v1', comment);
v1Router.use('/api/v1', categories);
v1Router.use('/api/v1', userProfile);


export default v1Router;
