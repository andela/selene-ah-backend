import db from '../../models';
import pagination from '../../helpers/pagination/pagination';
import ArticleHelper from '../../helpers/article/articleHelper';
import Vote from '../votes/VoteController';
import RatingController from '../rating/ratingController';
import findOrCreatTag from '../../helpers/tag/findOrCreateTag';
import Notifications from '../notification/NotificationController';

const { Article, Category, User, Tag, HighlightedComment } = db;
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
    const { categoryId, title, body, published, tags, imageUrl} = req.body;
    const articleSlug = ArticleHelper.generateUniqueSlug(title);
    const readTime = ArticleHelper.calculateArticleReadTime(body);

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
        imageUrl,
        categoryId: categoryId.trim()
      });
      await Notifications.emitPublishArticleNotificaiton(id, articleSlug, next);

      let addTags;
      if (tags) {
        addTags = await findOrCreatTag(tags);
        await article.setTags(addTags);
      }

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
      let article = await Article.findOne({
        where: { id },
        include: [{
          model: User,
          as: 'author',
          attributes: ['userName', 'imageUrl', 'bio', 'dateOfBirth']
        }, {
          model: HighlightedComment,
          as: 'highlights',
          attributes: ['content'],
          include: [{
            model: User,
            as: 'userhighlights',
            attributes: ['userName', 'imageUrl']
          }]
        },
        {
          model: Tag,
          as: 'tags',
          through: { attributes: [] }
        }],
      });

      if (!article) {
        return res.status(404).json({
          success: 'false',
          message: 'Article not found',
        });
      }
      article = article.toJSON();
      article.tags = article.tags.map(tagname => tagname.tag);

      const voteCount = await Vote.votesCount(req, res, next);
      await Article.increment('readingStat', { where: { id: article.id } });
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
      let articles = await Article.findAll(
        {
          include: [{
            model: User,
            as: 'author',
            attributes: ['userName', 'imageUrl', 'bio', 'dateOfBirth']
          },
          {
            model: Tag,
            as: 'tags',
            attributes: ['tag'],
            through: { attributes: [] }
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

      articles = articles.map((article) => {
        article = article.toJSON();
        article.tags = article.tags.map(tagName => tagName.tag);
        return article;
      });
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
      let articles = await Article.findAll(
        {
          where: { userId: authorsId },
          include: [{
            model: User,
            as: 'author',
            attributes: ['userName', 'imageUrl', 'bio', 'dateOfBirth']
          },
          {
            model: Tag,
            as: 'tags',
            attributes: ['tag'],
            through: { attributes: [] }
          }],
        });

      if (!articles || articles.length < 1) {
        return res.status(404).json({
          success: 'false',
          message: 'No article created yet',
        });
      }

      articles = articles.map((article) => {
        article = article.toJSON();
        article.tags = article.tags.map(tagName => tagName.tag);
        return article;
      });
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
    const { title, body, categoryId, imageUrl } = req.body;
    const { id } = req.params;

    let articleSlug;
    let readTime;

    if (title) {
      articleSlug = ArticleHelper.generateUniqueSlug(title);
    }

    if (body) {
      readTime = ArticleHelper.calculateArticleReadTime(body);
    }

    try {
      const article = await Article.findOne({
        where: { id }
      });
      await Article.update(
        {
          title: title || article.title,
          slug: articleSlug || article.slug,
          body: body || article.body,
          readTime: readTime || article.readTime,
          categoryId: categoryId || article.categoryId,
          imageUrl: imageUrl || article.imageUrl
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
