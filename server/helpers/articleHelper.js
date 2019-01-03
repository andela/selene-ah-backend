import models from '../models';

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
}

export default ArticleHelper;
