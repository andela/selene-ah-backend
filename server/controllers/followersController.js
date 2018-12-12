import models from '../models';

const { Follower } = models;
/**
 * @description - Followers Controller
 */
class FollowerController {
  /**
   * @description - This function follows an Author
   * @param {object} req - request to be sent
   * @param {object} res - response gotten from server
   * @param {object} next - callback function
   * @returns {object} - Response to be sent
   */
  static async followAuthor(req, res, next) {
    try {
      const { followerId } = req.body;
      const userId = req.token.user.id;
      const follow = await Follower.create({
        userId,
        followerId
      });
      return res.status(200).json({
        success: true,
        message: 'Follow successful',
        data: follow
      });
    } catch(err) {
      return next(err);
    }
  }

  /**
   * @description - This function unfollows an Author
   * @param {object} req - request to be sent
   * @param {object} res - response gotten from server
   * @param {object} next - callback function
   * @returns {object} - Response to be sent
   */
  static async unfollowUser(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.token.user.id;
      await Follower.destroy({
        where: {userId: userId,
        followerId: id}
      });
      return res.status(200).json({
          success: true,
          message: 'You\'ve unfollow this User'
        });
    } catch(err) {
      return next(err);
    }
  }

  /**
   * @description - This function get user followers
   * @param {object} req - request to be sent
   * @param {object} res - response gotten from server
   * @param {object} next - callback function
   * @param {string} id - ID
   * @returns {object} - get user
   */
  static async getFollowers(req, res, next, id) {
    try {
      const userId = id;
      const followers = await Follower.findAll({
        where: {userId: userId}
      });
      return followers.length >= 1 ? res.status(200).json({
        success: true,
        message: 'Followers returned successfully',
        followers
      }):res.status(200).json({
        success: true,
        message: 'No followers found'
      });
    } catch(err) {
      return next(err);
    }
  }

   /**
   * @description - This function get user followees
   * @param {object} req - request to be sent
   * @param {object} res - response gotten from server
   * @param {object} next - callback function
   * @param {string} id - ID
   * @returns {object} - get user
   */
  static async getFollowees(req, res, next, id) {
    try {
      const followees = await Follower.findAll({
        where: {followerId: id}
      });
      return followees.length >= 1 ? res.status(200).json({
        success: true,
        message: 'Followees returned successfully',
        followees
      }):res.status(200).json({
        success: true,
        message: 'No followers found'
      });
    } catch(err) {
      return next(err);
    }
  }
  /**
   * @description - This function get user followers
   * @param {object} req - request to be sent
   * @param {object} res - response gotten from server
   * @param {object} next - callback function
   * @returns {object} - Response to be sent
   */
  static getAllFollowers(req, res, next) {
    const userId = req.token.user.id;
    return FollowerController.getFollowers(req, res, next, userId);
  }

  /**
   * @description - This function get those following a user
   * @param {object} req - request to be sent
   * @param {object} res - response gotten from server
   * @param {object} next - callback function
   * @returns {object} - Response to be sent
   */
  static async getAllFollowees(req, res, next) {
    const id = req.token.user.id;
    return FollowerController.getFollowees(req, res, next, id);
  }

   /**
   * @description - This function get other user followees
   * @param {object} req - request to be sent
   * @param {object} res - response gotten from server
   * @param {object} next - callback function
   * @returns {object} - Response to be sent
   */
  static async getAnotherUserFollowees(req, res, next) {
    const id = req.params.id;
    return FollowerController.getFollowees(req, res, next, id);
  }
  /**
   * @description - This function get other user followers
   * @param {object} req - request to be sent
   * @param {object} res - response gotten from server
   * @param {object} next - callback function
   * @returns {object} - Response to be sent
   */
  static async getUserFollowers(req, res, next){
    const { id } = req.params;
    return FollowerController.getFollowers(req, res, next, id);
  }
}

export default FollowerController;
