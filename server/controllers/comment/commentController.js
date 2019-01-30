import db from '../../models';
import Notification from '../notification/NotificationController';
import LikesCount from '../../helpers/vote/LikesCount';

const { Comment, User, CommentReaction, CommentHistory, Article  } = db;

/**
 * @description contains the controller methods for commenting on an article
 */
export default class CommentController {
  /**
   * @description post a Comment for a particular article
   * @param {object} req - req from route
   * @param {object} res - respose to route
   * @param {object} next - callback function
   * @returns {object} a response object
   */
  static async postComment(req, res, next) {
    const { user: { id }, body:{ content }, params:{ articleId }} = req;
    try {
      const commentCreated = await Comment.create({
        content: content.trim(),
        userId: id,
        articleId,
      });
      delete commentCreated.dataValues.userId;
      await Notification.emitCommentArticleNotification(id, articleId);
      return res.status(201).send({
        success: true,
        message: 'Comment created successfully',
        comment: commentCreated
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @description Get all Comments for a particular article
   * @param {object} req - req from route
   * @param {object} res - respose to route
   * @param {object} next - callback function
   * @returns {object} a response object
   */
  static async getArticleComments(req, res, next) {
    const { params:{articleId}} = req;
    try {
      const comments = await Comment.findAndCountAll(
        {
          include: [{
            model: User,
            as: 'author',
            attributes: ['userName', 'imageUrl', 'bio']

          },
          {
            model: CommentReaction,
            as: 'commentReaction',
            attributes: ['id', 'reaction']
          }
        ],
        order: [
          ['createdAt', 'DESC'],
      ],
        attributes: { exclude: ['userId'] },
        where: { articleId }
        });

      if (comments.count == 0) {
        return res.status(200).json({
          success: false,
          message: 'No Comment for this Article',
        });
      }
      return res.status(200).json({
        success: true,
        message: 'Retrieved Comments successfully',
        comments: LikesCount.allLikeCount(comments)
      });

    } catch (error) {
      return next(error);
    }
  }

    /**
   * @param {object} req - req from route
   * @param {object} res - respose to route
   * @param {object} next - callback function
   * @returns {object} a response object
   */
  static async getUserComment(req, res, next) {
    const { user: { id }} = req;
    try {
      const comments = await Comment.findAndCountAll({where: { userId: id }});
      return  res.status(200).json({
        success: true,
        data: comments,
      });
    }catch(error){
      return next(error);
    }
  }

  /**
   * @param {object} req - req from route
   * @param {object} res - respose to route
   * @param {object} next - callback function
   * @returns {object} a response object
   */
  static async getSingleComment(req, res, next) {
    const { params: { id }} = req;
    try {
      const comment = await Comment.findOne(
        {
          include: [{
            model: User,
            as: 'author',
            attributes: ['userName', 'imageUrl', 'bio', 'id']

          },
          {
            model: CommentReaction,
            as: 'commentReaction',
            attributes: ['userId', 'reaction'],
            include: [{
              model: User,
              attributes: ['userName', 'imageUrl', 'bio']
            }]
          },
          {
            model: CommentHistory,
            attributes: ['commentHistory', 'createdAt', 'updatedAt'],
          },
          {
            model: Article,
            attributes: ['slug', 'title']
          }
        ],
          attributes: { exclude: ['userId'] },
          where: { id },
        });

      if (!comment) {
        return res.status(404).json({
          success: false,
          message: 'No Comment found',
        });
      }
      return res.status(200).json({
        success: true,
        message: 'Retrieved comment successfully',
        comment: LikesCount.singleLikeCount(comment)
      });

    } catch (error) {
      return next(error);
    }
  }

   /**
   * @description Get all Comments for a particular article
   * @param {object} req - req from route
   * @param {object} res - respose to route
   * @param {object} next - callback function
   * @returns {object} a response object
   */
  static async getCommentHistory(req, res, next) {
    const { params: { commentId }} = req;
    try {
      const commentHistory = await CommentHistory.findAndCountAll({
        where: {
          commentId
        }
      });

      if (commentHistory.count == 0) {
        return res.status(404).json({
          success: false,
          message: 'No previous comment found',
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Retrieved previous Comments successfully',
        commentHistory,
      });

    } catch (error) {
      return next(error);
    }
  }

   /**
   * @description create a comment history
   * @param {object} commentObject
   * @returns {object} a response object
   */
  static async createCommentHistory(commentObject) {
    const {
      content,
      id
    } = commentObject;
    const previousComment = await CommentHistory.create({
      commentHistory: content.trim(),
      commentId: id,
    });
    return previousComment;
  }


  /**
   * @description only owners of comment should be able to update
   * @param {object} req - req from route
   * @param {object} res - respose to route
   * @param {object} next - callback function
   * @returns {object} a response object
   */
  static async updateComment(req, res, next) {
    const { user:{ id },body:{ content }, params:{ commentId }} = req;
    try {
      const comments = await Comment.findOne({
        where: {
          id: commentId,
          userId: id,
         }
      });
      if (!comments) {
        return res.status(403).json({
          success: false,
          message: 'User is not authorized to update comment',
        });
      }
      const previousComment = await CommentController
        .createCommentHistory(comments.dataValues);
      await Comment.update(
        {
          content
        },
        {
          where: { id: commentId }
        }
      );
      return res.status(200).json({
        success: true,
        message: 'Comment updated successfully',
        currentComment: content,
        previousComment,
      });
    } catch (error) {
      return next(error);
    }
  }

   /**
   * @description determines which user can delete comment
   * @param {object} user - respose to route
   * @returns {boolean} a response object
   */
   static async canDeleteComment(user){
     const { id, role, ownerId } = user;
    if(role === 'superAdmin' || ownerId == id){
      return true;
    }
    return false;
   }

  /**
   * @description Handles deleting comment
   * @param {object} req - req from route
   * @param {object} res - respose to route
   * @param {object} next - callback function
   * @returns {object} a response object
   */
  static async deleteComment(req, res, next) {
    const { user, params: { commentId }} = req;
    try {
      if (await CommentController.canDeleteComment(user)) {
        const comment = await Comment.findOne({
          where: {
            id: commentId,
            userId: user.ownerId,
          }
        });
        await comment.destroy({
          where: {
            id: commentId
          }
        });
        return res.status(200).json({
          success: true,
          message: 'Comment deleted successfully',
        });
      }
      return res.status(403).json({
        success: false,
        message: 'User is not authorized to delete comment',
      });
    } catch (error) {
      return next(error);
    }
  }
}
