import Router from 'express';
import ReactionValidation from
  '../../middlewares/validations/ReactionValidation';
import CommentReactionController from
  '../../controllers/CommentReactionController';
import JWTAuthentication from '../../middlewares/JWTAuthentication';
import UuidValidator from '../../middlewares/validations/uuidValidator';
import validateComments from '../../middlewares/validations/commentValidation';

const commentReaction = Router();

/**
 * @description Post comment reaction to a comment
 * @param {string}
 * @param {function}
 */
commentReaction.post('/comment/:commentId/commentreaction',
  JWTAuthentication.authenticateUser,
  UuidValidator.validateUUID,
  validateComments.validateCommentId,
  ReactionValidation.validateCommentReaction,
  ReactionValidation.isReactionAlreadyExist,
  CommentReactionController.addOrRemoveCommentReaction
);

export default commentReaction;
