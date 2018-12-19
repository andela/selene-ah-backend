/**
 * @description - This class validates required
 *  field needed to create an article
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
}

export default ArticleValidation;
