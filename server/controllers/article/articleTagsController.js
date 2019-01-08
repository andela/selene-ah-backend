import db from '../../models';

const { ArticleTag, Tag } = db;
/**
* @description class will add functionalities for creating an article tag
* @class ArticleTagsController
*/
class ArticleTagsController {
  /**
  * @param {object} req - Request sent to the route
  * @param {object} res - Response sent from the controller
  *  @param {object} next - Error handler
  * @returns {object} - object representing response message
  */
  static async getAllTags(req, res, next) {
    try {
      const tags = await Tag.findAll({
        attributes: ['id', 'tag']
      });

      if (!tags) {
        return res.status(404).json({
          success: 'false',
          message: 'No tag created yet',
        });
      }

      return res.status(200).json({
        success: 'true',
        message: 'Retrieved tags uccessfully',
        tags
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
  static async deleteArticleTag(req, res, next) {
    const { tagId } = req.params;
    try {
      await ArticleTag.destroy({
        where: {
          id: tagId
        }
      });

      return res.status(200).json({
        success: 'true',
        message: 'Article  tag deleted successfully',
      });

    } catch (error) {
      return next(error);
    }
  }
}
export default ArticleTagsController;
