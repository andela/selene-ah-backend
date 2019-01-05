import models from '../../models';
import {
  BOOKMARK_SUCCESSFUL_MSG,
  NO_BOOKMARK_MSG,
  BOOKMARK_FOUND_MSG
} from '../../helpers/bookmark/responseMessage';

const { Bookmark } = models;



/**
 * @description Controller for our bookmark route
 * @class
 */
class BookmarkController {
  /**
   * @description Handles bookmarking an article
   * @param {object} req
   * @param {object} res
   * @returns {object} Response object
   */
  static async bookmarkArticle(req, res) {
    const userId = req.user.id;
    const { articleId } = req.params;

    const dbResult = await Bookmark.findOrCreate(
      { where: { articleId, userId },
      defaults: { articleId, userId }
    }
    );

    return res.status(201).json({
      data: dbResult.dataValues,
      message: BOOKMARK_SUCCESSFUL_MSG
    });
  }

  /**
   * @description Get all the bookmarked article by logged in user
   * @param {object} req
   * @param {object} res
   * @returns {object} Response object
   */
  static async getUsersBookmarks(req, res) {
    const userId = req.user.id;
    const dbResult = await Bookmark.findAll({
      where: { userId }
    });

    if(!dbResult) {
      return res.status(200).json({
        message: NO_BOOKMARK_MSG
      });
    }

    return res.status(200).json({
      data: dbResult,
      message: BOOKMARK_FOUND_MSG
    });
  }
}

export default BookmarkController;
