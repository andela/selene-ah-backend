import models from '../../models';
import {
  ARTICLE_LIKE_MSG,
  ARTICLE_DISLIKE_MSG,
  ARTICLE_RESET_MSG
} from '../../helpers/responseMessages';

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
        await Vote.updateArticleVote(1, userId, articleId);
        return res.status(200).json({
          message: vote === 1 ? ARTICLE_LIKE_MSG
                              : ARTICLE_DISLIKE_MSG
        });
      }
      return res.status(201).json({
        message: vote === 1 ? ARTICLE_LIKE_MSG
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
}

export default Vote;
