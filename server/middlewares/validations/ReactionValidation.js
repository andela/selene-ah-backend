import models from '../../models';

const { CommentReaction } = models;

const REQUIRED_INPUT = ['like', 'unlike'];

/**
 * @description Validates user reactions on comment
 */
class ReactionValidation{
  /**
  *@description It validates the comment reactions
  * @param {object} req - Express request object sent to the server
  * @param {object} res - Express response object gotten from the server
  * @param {object} next - Express next middleware function
  * @returns {res} Returns the response object
  */
  static validateCommentReaction(req, res, next){
    const { reaction } = req.body;
    if(!reaction){
      return res.status(400).json({
        success: false,
        message: 'Reaction field is required'
      });
    }
    if(!REQUIRED_INPUT.includes(reaction.toLowerCase())){
      return res.status(400).json({
        success: false,
        message: 'Invalid Reaction: supply a valid reaction'
      });
    }
    return next();
  }
  /**
  *@description It validates the comment reactions
  * @param {object} req - Express request object sent to the server
  * @param {object} res - Express response object gotten from the server
  * @param {object} next - Express next middleware function
  * @returns {res} Returns the response object
  */
 static async isReactionAlreadyExist(req, res, next){
  try{
    const userId = req.user.id;
    let { reaction } = req.body;
    reaction = reaction.toLowerCase();
    const { commentId } = req.params;
    const commentReactionDbResult = await CommentReaction.findOne(
      {where: { userId, commentId}, defaults: { reaction }}
    );
    if(commentReactionDbResult && reaction === 'like'){
      return res.status(409).json({
        status: false,
        message: 'User already liked this comment'
      });
    }
    if(!commentReactionDbResult && reaction === 'unlike'){
      return res.status(404).json({
        status: false,
        message: 'You cannot unlike a comment you have not liked'
      });
    }
    return next();
  }
  catch(error){
    return next(error);
  }
 }
}

export default ReactionValidation;
