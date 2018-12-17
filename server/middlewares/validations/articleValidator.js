import models from '../../models';
import {
  ARTICLE_NOT_FOUND
} from '../../helpers/responseMessages';

const { Article } = models;

/**
 * @description Articles ValidatorClass
 * @class
 */
class ArticleValidator {
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

export default ArticleValidator;
