/* eslint-disable max-len */
import { Router } from 'express';
import AricleValidator from '../../../middlewares/validations/articleValidation';
import VoteController from '../../../controllers/votes/VoteController';
import JWTAuthentication  from '../../../middlewares/JWTAuthentication';
import ArticleVoteValidator
from '../../../middlewares/validations/articleVoteValidator';

const voteRouter = Router();

voteRouter.get(
  '/votes/:articleId/count',
  AricleValidator.articleExistInDatabase,
  ArticleVoteValidator.validateRequest,
  VoteController.votesCount,
);

voteRouter.get(
  '/votes/:articleId/likedbyuser',
  JWTAuthentication.authenticateUser,
  AricleValidator.articleExistInDatabase,
  ArticleVoteValidator.validateRequest,
  VoteController.articleLikedByUser,
);

voteRouter.post(
  '/votes/:articleId/like',
  JWTAuthentication.authenticateUser,
  AricleValidator.articleExistInDatabase,
  ArticleVoteValidator.validateRequest,
  VoteController.reactToArticle,
);

voteRouter.put(
  '/votes/:articleId/unlike',
  JWTAuthentication.authenticateUser,
  AricleValidator.articleExistInDatabase,
  ArticleVoteValidator.validateRequest,
  VoteController.resetArticleVoteReaction,
);

voteRouter.post(
  '/votes/:articleId/dislike',
  JWTAuthentication.authenticateUser,
  AricleValidator.articleExistInDatabase,
  ArticleVoteValidator.validateRequest,
  VoteController.reactToArticle,
);

export default voteRouter;
