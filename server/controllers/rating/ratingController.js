import models from '../../models';
import {
  SUCCESSFUL_RATING,
  SUCCESSFUL_RATING_UPDATE,
  GOT_ARTICLE_RATING_MESSAGE,
} from '../../helpers/rating/responseMessage';

const { Rating } = models;
/**
 * @descrption class for handling article rating
 */
class RatingController{
  /**
   * @description - This method adds rating to an article
   * @param {object} req - the request object containing the input data
   * @param {object} res - response from database operation
   * @param {object} next - callback function
   * @returns {object} response object
   */
  static async rateArticle(req, res, next) {
    try {
      const { articleRating } = req.body;
      const { articleId } = req.params;
      const userId = req.user.id;
      const ratedArticle = await Rating.create({
        userId,
        articleId,
        articleRating
      });
      return res.status(201).json({
        success: true,
        message: SUCCESSFUL_RATING,
        ratedArticle
      });
    } catch(err) {
      return next(err);
    }
  }

  /**
   * @description - This method adds rating to an article
   * @param {object} req - the request object containing the input data
   * @param {object} res - response from database operation
   * @param {object} next - callback function
   * @returns {object} response object
   */
  static async updateRating(req, res, next) {
    try {
      const { articleId } = req.params;
      const { articleRating } = req.body;
      const userId = req.user.id;

      const ratedArticle = await Rating.update(
        { articleRating },
        { where: { userId:userId, articleId:articleId }}
      );
      return res.status(200).json({
        success: true,
        message: SUCCESSFUL_RATING_UPDATE,
        ratedArticle
      });
    } catch(err) {
      return next(err);
    }
  }

  /**
   * @description - This method adds rating to an article
   * @param {object} req - the request object containing the input data
   * @param {object} res - response from database operation
   * @param {object} next - callback function
   * @returns {object} response object
   */
  static async getSingleArticleRatings(req, res, next) {
    try {
      const { articleId } = req.params;
      const averageRating = await RatingController.getAverageArticleRating(
        articleId
        );

      return res.status(200).json({
        success: true,
        message: GOT_ARTICLE_RATING_MESSAGE,
        averageRating
      });
    } catch(err) {
      return next(err);
    }
  }

  /**
   * @description - This method adds rating to an article
   * @param {object} req - the request object containing the input data
   * @param {object} res - response from database operation
   * @param {object} next - callback function
   * @returns {object} response object
   */
  static async getArticleRatingForUser(req, res, next) {
    try {
      const {articleId} = req.params;
      const userId = req.user.id;
      const userRating = await Rating.findOne({
        where: { articleId, userId}
      });
      return res.status(200).json({
        success: true,
        message: GOT_ARTICLE_RATING_MESSAGE,
        userRating
      });
    } catch(err) {
      return next(err);
    }
  }

  /**
   * @description - method to get an article's average rating
   * @param {string} articleId - the article's id(uuid)
   * @returns {integer} - returns the average rating
   */
  static async getAverageArticleRating(articleId){
    const articleRatings = await Rating.findAll({
      attributes: ['articleRating'],
      where: { articleId },
      raw: true
    });
    const totalRatings = articleRatings
    .reduce((total, current) => total + current.articleRating, 0);
    return totalRatings/articleRatings.length;
  }
}

export default RatingController;
