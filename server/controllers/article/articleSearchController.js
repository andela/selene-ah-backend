import models from '../../models';
import {
  ARTICLE_SUCESSFUL_MSG,
  ARTICLE_NOT_FOUND
} from '../../helpers/article/responseMessage';
import pagination from '../../helpers/pagination/pagination';

const { Article, User, Category, Tag } = models;
/**
 * @description - A class for search article through given query parameter
 */
class ArticleSearchController {
  /**
   * @param {object} req - req sent to the server
   * @param {object} res - response gotten from server
   * @param {fn} next - callback funtion
   * @returns {object} - representing response message
   */
  static async searchArticle(req, res, next) {
    const { limit, offset }= pagination.paginationHelper(req.query);
    const category = req.query.category || '';
    const keyword = req.query.keyword || '';
    const author = req.query.author || '';
    const tag = req.query.tag || '';
    try {
      const articles = await Article.findAll({
        where: {
          title: {
            $ilike: `%${keyword}%`
          },
        },
        attributes: ['id', 'title', 'body', 'slug'],
        include: [{
          model: User,
          as: 'author',
          where: {
            userName: {
              $ilike: `%${author}%`
            }
          },
          attributes: ['id', 'userName', 'imageUrl'],
        },
        {
          model: Tag,
          as: 'tags',
          where: {
            tag: {
              $ilike: `%${tag}%`
            }
          },
          attributes: ['tag'],
          through: {attributes: []}
        },
        {
          model: Category,
          as: 'category',
          where: {
            title: {
              $ilike: `%${category}%`
            }
          },
          attributes: ['id', 'title'],
        }],
        limit,
        offset
      });

      if (articles.length < 1) {
        return res.status(404).json({
          sucess: false,
          message: ARTICLE_NOT_FOUND
        });
      }

      return res.status(200).json({
        success: true,
        articles,
        message: ARTICLE_SUCESSFUL_MSG
      });
    } catch (err) {
      return next(err);
    }
  }
}

export default ArticleSearchController;
