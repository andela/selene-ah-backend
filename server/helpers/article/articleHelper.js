import slug from 'slug';
import models from '../../models';

const { Article } = models;
/**
 * @class
 */
class ArticleHelper {
  /**
   * @description Get a field in the Article Model
   * @param {uuid} articleId
   * @param {string} field
   * @returns {string|integer} String | Integer
   */
  static async getField(articleId, field) {
    const dbResult = Article.findOne({
      where: { id: articleId }
    });
    if(!dbResult || dbResult === undefined) return false;
    const dbField = dbResult.get(field);
    return dbField;
  }

  /**
   * @description Checks if the article is owned by the user
   * @param {uuid} articleId
   * @param {uuid} userId
   * @returns {object} Db Response
   */
  static async checkIfUserOwnsArticle(articleId, userId) {
    const article = await Article.findOne({
      where: {
        id: articleId,
        userId: userId,
      }
    });

    return article;
  }

  /**
   * @description Calculates the time it takes to read an article
   * @param {string} article
   * @returns {integer} Time taken to read article
   */
  static calculateArticleReadTime(article) {
    const wordsPerMinute = 275;
    const count = article.split(' ').length;
    const timeToRead = (count / wordsPerMinute).toFixed(0);
    return timeToRead == 0 ? 1 : timeToRead;
  }

/**
 * @description function to generate unique slug
 * @param {string} title - article title
 * @returns {string} random string
 */
  static generateUniqueSlug(title) {
    const options = { lower: true };
    // eslint-disable-next-line max-len
    return `${slug(title, options)}-${Math.random().toString(36).substr(2, 10)}`;
  }
}

export default ArticleHelper;
