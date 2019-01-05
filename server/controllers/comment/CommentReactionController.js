import models from '../../models';
import {
  COMMENT_LIKE_MSG,
  COMMENT_RESET_MSG
} from '../../helpers/comment/responseMessage';
import Notification from '../notification/NotificationController';

const { CommentReaction } = models;

/**
 * @description Represents the CommentReaction controller
 */
class CommentReactionController{

  /**
  *@description It add the comment reactions into the database
  * @param {object} req - Express request object sent to the server
  * @param {object} res - Express response object gotten from the server
  * @param {object} next - Express next middleware function
  * @returns {res} Returns the response object
  */
  static async addOrRemoveCommentReaction(req, res, next){
    try{
      const userId = req.user.id;
      let { reaction } = req.body;
      reaction = reaction.toLowerCase();
      const { commentId } = req.params;
      if(reaction === 'like'){
        await CommentReaction.create(
          { userId, commentId, reaction }
        );
        await Notification
              .emitLikeNotification(req.user, 'comment', commentId, next);
        return res.status(201).json({
          status: true,
          message: COMMENT_LIKE_MSG
        });
      }
      await CommentReaction.destroy(
        {where: { userId, commentId}, defaults: { reaction }}
      );
      return res.status(200).json({
        status: true,
        message: COMMENT_RESET_MSG,
      });
    }catch(error){
      return next(error);
    }
  }
}

export default CommentReactionController;
