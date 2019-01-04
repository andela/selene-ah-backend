import { Router } from 'express';

import validateComments from '../../middlewares/validations/commentValidation';
import commentController from
'../../controllers/commentController';
import JWTAuthentication from '../../middlewares/JWTAuthentication';
import uuidValidator from '../../middlewares/validations/uuidValidator';
import AricleValidator from '../../middlewares/validations/articleValidator';


const {
  validateCommentContent,
  validateCommentId
} = validateComments;
const { validateUUID } =  uuidValidator;
const router = Router();

/**
 * @description get all comments for an article
 * @param {string}
 * @param {function} commentController.getArticleComments
 */
router.get('/article/:articleId/comments',
  commentController.getArticleComments);

/**
 * @description get a single comment
 * @param {string}
 * @param {function} commentController.getSingleComment
 */
router.get('/comment/:id',
  commentController.getSingleComment);

/**
 * @description get a comment history for a comment
 * @param {string}
 * @param {function} commentController.commentHistory
 */
router.get('/comment/history/:commentId',
  validateUUID,
  validateCommentId,
  commentController.getCommentHistory);

/**
 * @description post single comment to an article
 * @param {string}
 * @param {validateComment} validateCommentText
 * @param {function} commentController.postComment
 */
router.post('/article/:articleId/comment', JWTAuthentication.authenticateUser,
  validateUUID,
  AricleValidator.articleExistInDatabase,
  validateCommentContent,
  commentController.postComment);

/**
 * @description Update single comment to an article
 * @param {string}
 * @param {function} commentController.updateComment
 */
router.patch('/comment/:commentId',
  JWTAuthentication.authenticateUser,
   validateCommentId,
   commentController.updateComment
  );

/**
 * @description Delete single comment from an article
 * @param {string}
 * @param {function} commentController.deleteComment
 */
router.delete('/comment/:commentId', JWTAuthentication.authenticateUser,
  validateCommentId,
  commentController.deleteComment);

export default router;
