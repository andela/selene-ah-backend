import models from '../../models';
import {
  ARTICLE_LIKE_MSG,
  ARTICLE_DISLIKE_MSG,
  ARTICLE_RESET_MSG,
  ARTICLE_LIKED_BY_USER_MSG,
  ARTICLE_NOT_LIKED_BY_USER_MSG,
} from '../../helpers/article/responseMessage';

const { ArticleVote } = models;
/**
 * @description The vote controller class
 * @class
 */
class Vote {
  /**
   * @description Hanldes Like functionality
   * @param {object} req
   * @param {object} res
   * @param {function} next
   * @returns {object} Response
   */
  static async reactToArticle(req, res, next) {
    try {
      const { articleId } = req.params;
      const userId = req.user.id;
      const { vote } = req.body;
      const dbResult = await ArticleVote.findOrCreate(
        { where: { userId, articleId },
          defaults: { vote } }
      );
      if(!dbResult[1]) {
        await Vote.updateArticleVote(vote, userId, articleId);
        return res.status(200).json({
          message: Number(vote) === 1 ? ARTICLE_LIKE_MSG
                              : ARTICLE_DISLIKE_MSG
        });
      }
      return res.status(201).json({
        message: Number(vote) === 1 ? ARTICLE_LIKE_MSG
                            : ARTICLE_DISLIKE_MSG
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @description Resets the reaction state of an article
   * @param {object} req
   * @param {object} res
   * @param {function} next
   * @returns {object} Response
   */
  static async resetArticleVoteReaction(req, res, next) {
    try {
      const userId = req.user.id;
      const { articleId } = req.params;
      await ArticleVote.update(
        { vote: 0 },
        { where: { userId, articleId } }
      );

      return res.status(200).json({
        message: ARTICLE_RESET_MSG
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @description Handles updating a vote if user has voted
   * @param {integer} vote
   * @param {uuid} userId
   * @param {uuid} articleId
   * @returns {boolean} True or False
   */
  static async updateArticleVote(vote, userId, articleId) {
    try {
      await ArticleVote.update(
        { vote: vote },
        { where: { userId, articleId } }
      );
      return true;
    } catch (error) {
      return error;
    }
  }

  /**
   * @description Gets the like and dislike count
   * @param {object} req
   * @param {object} res
   * @param {function} next
   * @param {string} id
   * @returns {object} Like and Dislike count
   */
  static async votesCount(req, res, next, id) {
    try {
      const likeResult = await ArticleVote.findAndCountAll({
        where: { articleId:id, vote: 1},
        raw: true
      });

      const likeCount = likeResult.count;
      const  voteCount = { likeCount };
      return voteCount;

    } catch (error) {
      return next(error);
    }
  }

  /**
   * @description Was the article liked by the authenticated user
   * @param {object} req
   * @param {object} res
   * @param {function} next
   * @returns {boolean} True or False
   */
  static async articleLikedByUser(req, res, next) {
    try {
      const { articleId } = req.params;
      const userId = req.user.id;

      const dbResult = await ArticleVote.findOne({
        where: { userId, articleId }
      });

      if(!dbResult) {
        return res.status(200).json({
          message: ARTICLE_NOT_LIKED_BY_USER_MSG
        });
      }

      return res.status(200).json({
        message: ARTICLE_LIKED_BY_USER_MSG
      });

    } catch (error) {
      return next(error);
    }
  }

}

export default Vote;
