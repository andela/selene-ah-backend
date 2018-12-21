import models from '../models';
import {
  ARTICLE_NOT_FOUND
} from '../helpers/responseMessages';

const { Article } = models;

/**
 * @description - This class validates required
 *  field needed to create an articleß
 */
class ArticleValidation {
  //title, body, categoryId, published
  /**
   * @param {object} req - Request sent to the route
   * @param {object} res - Response sent from the middleware
   * @param {object} next - Error handler
   * @returns {object} - object representing response message
   */
  static validateArticleFields(req, res, next) {
    const { title, body, categoryId } = req.body;
    if (!title || title.trim().length < 1) {
      return res.status(400).json({
        success: false,
        message: 'Title is required'
      });
    }
    if (!body || body.trim().length < 1) {
      return res.status(400).json({
        success: false,
        message: 'Body is required'
      });
    }
    if (!categoryId || categoryId.trim().length < 1) {
      return res.status(400).json({
        success: false,
        message: 'categoryId is required'
      });
    }
    return next();
  }

  /**
   * @description Check if an article exists
   * @param {object} req
   * @param {object} res
   * @param {function} next
   * @returns {function} next
   */
  static async articleExistInDatabase(req, res, next) {
    try {
      const { articleId } = req.params;
      const dbResult = await Article.findByPk(articleId);
      if(dbResult) return next();
      return res.status(404).json({
        message: ARTICLE_NOT_FOUND
      });
    } catch (error) {
      return next(error);
    }
  }
}

export default ArticleValidation;
