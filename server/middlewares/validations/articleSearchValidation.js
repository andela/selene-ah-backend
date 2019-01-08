import Validation from '../../helpers/validation/validations';
import { INVALID_STRING_MSG } from '../../helpers/responseMessages';
/**
 * @class
 * @description - This class validates userName fields needed to
 * filter article
 */
class ArticleSearchValidation{
  /**
   * @param {object} req - request sent to the server
   * @param {object} res - response gotten from the server
   * @param {function} next - callback function to continue execution
   * @returns {object} - object representing response message
   */
  static validateArticleSearchParameter(req, res, next) {
    // keyword and author
    const { keyword, author, category, tag } = req.query;
    if (keyword && !Validation.isNameValid(keyword.trim())){
      return res.status(400).json({
        success: false,
        message: `keyword: ${INVALID_STRING_MSG}`
      });
    }
    if (author && !Validation.isUsernameValid(author.trim())) {
      return res.status(400).json({
        success: false,
        message: `Author: ${INVALID_STRING_MSG}`
      });
    }
    if (category && !Validation.isNameValid(category.trim())) {
      return res.status(400).json({
        success: false,
        message: `category: ${INVALID_STRING_MSG}`
      });
    }
    if (tag && !Validation.isNameValid(tag.trim())) {
      return res.status(400).json({
        success: false,
        message: `Tag: ${INVALID_STRING_MSG}`
      });
    }
    return next();
  }
}

export default ArticleSearchValidation;
