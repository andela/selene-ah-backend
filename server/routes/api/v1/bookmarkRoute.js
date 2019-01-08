/* eslint-disable max-len */
import { Router } from 'express';
import ArticleValidator from '../../../middlewares/validations/articleValidation';
import JWTAuthentication from '../../../middlewares/JWTAuthentication';
import BookmarkController
from '../../../controllers/bookmark/bookmarkController';

const bookmarkRouter = Router();

bookmarkRouter.post(
  '/bookmark/:articleId',
  JWTAuthentication.authenticateUser,
  ArticleValidator.articleExistInDatabase,
  BookmarkController.bookmarkArticle
);

bookmarkRouter.get(
  '/bookmark/',
  JWTAuthentication.authenticateUser,
  BookmarkController.getUsersBookmarks
);

export default bookmarkRouter;
