import db from '../models';
import generateUniqueSlug from '../helpers/generateUniqueSlug';
import pagination from '../helpers/pagination';
import calculateArticleReadTime from '../helpers/calculateArticleReadTime';
import Vote from './votes/VoteController';
import RatingController from './ratingController';

import Notifications from './NotificationController';

const { Article, Category, User } = db;
/**
* @description class will implement CRUD functionalities for articles
*
* @class ArticleController
*/
class ArticlesController {
  /**
   * @param {object} req - Request sent to the route
   * @param {object} res - Response sent from the controller
   * @param {object} next - Error handler
   * @param {object} article
   * @returns {object} - object representing response message
   */
  static async createArticle(req, res, next) {

    const { id } = req.user;
    const { categoryId, title, body, published } = req.body;
    const articleSlug = generateUniqueSlug(title);
    const readTime = calculateArticleReadTime(body);

    try {
      const category = await Category.findOne({
        where: { id: categoryId }
      });
      if (!category) {
        return res.status(400).send({
          success: false,
          message: 'Category does not exist',
        });
      }

      const article = await Article.create({
        title: title.trim(),
        body: body.trim(),
        slug: articleSlug,
        published,
        userId: id,
        readTime,
        categoryId: categoryId.trim()
      });
      await Notifications.emitPublishArticleNotificaiton(id, articleSlug, next);
      return res.status(201).send({
        success: true,
        message: 'Article created successfully',
        article
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @param {object} req - Request sent to the route
   * @param {object} res - Response sent from the controller
   *  @param {object} next - Error handler
   * @returns {object} - object representing response message
   */
  static async getOneArticle(req, res, next) {
    const { id } = req.params;
    try {
      const article = await Article.findOne({
        where: { id },
        include: [{
          model: User,
          as: 'author',
          attributes: ['userName', 'imageUrl', 'bio', 'dateOfBirth']
        }],
      });

      if (!article) {
        return res.status(404).json({
          success: 'false',
          message: 'Article not found',
        });
      }

      const voteCount = await Vote.votesCount(req,res, next);

      await Article.increment('readingStat', {where: {id: article.id}});
      const averageRating = RatingController.getAverageArticleRating(
        article.id
      );
      article.averageRating = averageRating;
      return res.status(200).json({
        success: 'true',
        message: 'Retrieved article successfully',
        article,
        vote: {
          voteCount
        }
      });

    } catch (error) {
      return next(error);
    }
  }

  /**
 * @param {object} req - Request sent to the route
 * @param {object} res - Response sent from the controller
 *  @param {object} next - Error handler
 * @returns {object} - object representing response message
 */
  static async getAllArticles(req, res, next) {
    const { limit, offset } = pagination.paginationHelper(req.query);
    try {
      const articles = await Article.findAndCountAll(
        {
          include: [{
            model: User,
            as: 'author',
            attributes: ['userName', 'imageUrl', 'bio', 'dateOfBirth']
          }],
          limit,
          offset
        });
      if (!articles || articles.count == 0) {
        return res.status(404).json({
          success: 'false',
          message: 'No article created yet',
        });
      }

      return res.status(200).json({
        success: 'true',
        message: 'Retrieved article successfully',
        articles
      });

    } catch (error) {
      return next(error);
    }
  }


  /**
 * @param {object} req - Request sent to the route
 * @param {object} res - Response sent from the controller
 *  @param {object} next - Error handler
 * @returns {object} - object representing response message
 */
  static async getAuthorsArticles(req, res, next) {
    const { authorsId } = req.params;
    try {
      const articles = await Article.findAndCountAll(
        {
          where: { userId: authorsId },
          include: [{
            model: User,
            as: 'author',
            attributes: ['userName', 'imageUrl', 'bio', 'dateOfBirth']

          }],
        });

      if (!articles || articles.count == 0) {
        return res.status(404).json({
          success: 'false',
          message: 'No article created yet',
        });
      }

      return res.status(200).json({
        success: 'true',
        message: 'Retrieved article successfully',
        articles
      });

    } catch (error) {
      return next(error);
    }
  }


  /**
 * @description - method for updating an article
 * @returns {object} - object representing response message
 * @param {object} req - Request sent to the route
 * @param {object} res - Response sent from the controller
 * @param {object} next - Error handler
 */
  static async updateArticle(req, res, next) {
    const { title, body, categoryId } = req.body;
    const { id } = req.params;

    let articleSlug;
    let readTime;

    if (title) {
      articleSlug = generateUniqueSlug(title);
    }

    if (body) {
      readTime = calculateArticleReadTime(body);
    }

    try {
      const article = await Article.findOne({
        where: { id }
      });

      if (!article) {
        return res.status(404).json({
          success: 'false',
          message: 'Article not found',
        });
      }
      await Article.update(
        {
          title: title || article.title,
          slug: articleSlug || article.slug,
          body: body || article.body,
          readTime: readTime || article.readTime,
          categoryId: categoryId || article.categoryId
        },
        {
          where: { id }
        }
      );

      return res.status(200).json({
        success: 'true',
        message: 'Article updated successfully',
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
* @param {object} req - Request sent to the route
* @param {object} res - Response sent from the controller
*  @param {object} next - Error handler
* @returns {object} - object representing response message
*/
  static async deleteArticle(req, res, next) {
    const { id } = req.params;
    try {
      const article = await Article.findOne({
        where: { id }
      });

      if (!article) {
        return res.status(404).json({
          success: 'false',
          message: 'Article not found',
        });
      }

      await Article.destroy({
        where: {
          id
        }
      });

      return res.status(200).json({
        success: 'true',
        message: 'Article deleted successfully',
      });

    } catch (error) {
      return next(error);
    }
  }

}

export default ArticlesController;
