import Validation  from '../../helpers/validation/validations';
import checkValidCommentId from '../../helpers/comment/checkValidCommentId';


/**
 * @description This class is for validating comments fields
 */
export default class validateComments{
  /**
   * @param {object} req
   * @param {object} res
   * @param {object} next
   * @returns {object} next/res
   */
  static validateCommentContent(req, res, next) {
    const {body: { content} } = req;
    if(!content.trim()){
      return res.status(400).json({
        success: false,
        message: 'Cannot Post an empty Text'
      });
    }
    if(!Validation.validateTextLength(content)){
      return res.status(400).json({
        success: false,
        message:
          'Comments should be at least 2 and not more than 150 characters'
      });
    }
    return next();
  }

  /**
   * @param {object} req - Request sent to the route
   * @param {object} res - Response sent from the middleware
   * @param {object} next -
   * @returns {object} - object representing response message
   */
  static async validateCommentId(req, res, next) {
    try{
      const { params:{ commentId } } = req;
      const isCommentIdValid = await checkValidCommentId(commentId);
      if (isCommentIdValid && req.user) {
        req.user.ownerId = isCommentIdValid;
        return next();
      }else if(isCommentIdValid ){
        return next();
      }
      else{
        return res.status(404).json({
          success: false,
          message: 'Comment ID Not Found',
        });
      }
    }catch(error){
      return next(error);
    }
  }
}
