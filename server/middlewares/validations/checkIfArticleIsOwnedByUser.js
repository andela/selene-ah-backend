import checkIfUserOwnsArticle from '../../helpers/checkIfUserOwnsTheArticle';


/**
 * @description - This class checks if an article exist
 */
class CheckArticle {
  /**
   *
   * @param {object} req -  Request sent to the route
   * @param {object} res -  Response sent from the middleware
   * @param {object} next - Error handler
   * @returns {object} next
   */
  static async checkIfArticleIsOwnedByUser(req, res, next) {
    const articleId = req.params.articleId || req.params.id;
    const userId = req.user.id;
    const article = await checkIfUserOwnsArticle(articleId, userId);
    if (!article) {
      return res.status(403).json({
        success: false,
        message: 'Access Denied: You do not own this article '
      });
    }
    return next();
  }
}

export default CheckArticle;
