import models from '../models';

const { User, Follower } = models;
/**
 * @description - User Authentication
 */
class UserAuthentication {
  /**
   * @description - checks if a user exist in the database
   * @param {object} req - request sent to server
   * @param {object} res - response gotton from server
   * @param {object} next - call back function
   * @returns { object } -
   */
  static async doesUserExist(req, res, next) {
    try {
      const user = await User.findOne({
        where: {id: req.body.followerId || req.params.id}
      });
      if (!user || user===null) {
        return res.status(400).json({
          success: false,
          message: 'Bad Request: User does not exist'
        });
      }
      return next();
    }catch(err) {
      return next(err);
    }
  }

  /**
   * @description - check if an author has been followed by the user
   * @param {object} req - request sent to server
   * @param {object} res - response gotton from server
   * @param {object} next - call back function
   * @returns { object } -
   */
  static async isFollowingUser(req, res, next) {
    try {
      const follow = await Follower.findOne({
        where: {userId: req.token.user.id,
        followerId: req.body.followerId}
      });

      if (!follow || follow === null) {
        return next();
      }
      return res.status(400).json({
        success: false,
        message: 'You\'ve already followed this user'
      });
    } catch(err) {
      return next(err);
    }
  }

  /**
   * @description - check if a user is not following an author
   * @param {object} req - request sent to server
   * @param {object} res - response gotton from server
   * @param {object} next - call back function
   * @returns { object } -
   */
  static async isNotFollowingUser(req, res, next) {
    try {
      const follow = await Follower.findOne({
        where: {userId: req.token.user.id,
        followerId: req.body.followerId || req.params.id}
      });

      if (!follow || follow === null) {
        return res.status(400).json({
          success: false,
          message: 'You are not following this User'
        });
      }
      return next();
    } catch(err) {
      return next(err);
    }
  }

    /**
   * @description - check if a user want to follow him/herself
   * @param {object} req - request sent to server
   * @param {object} res - response gotton from server
   * @param {object} next - call back function
   * @returns { object } -
   */
  static isFollowingSelf(req, res, next) {
    if (req.token.user.id === req.body.followerId) {
      return res.status(400).json({
        success: false,
        message: 'You can\'t follow yourself'
      });
    }
    return next();
  }

/**
   * @description - check if a followerId is supplied
   * @param {object} req - request sent to server
   * @param {object} res - response gotton from server
   * @param {object} next - call back function
   * @returns { object } -
   */
  static async isFollowerIdSupplied(req, res, next) {
    if (!req.body.followerId || req.body.followerId.trim().length < 1) {
      return res.status(400).json({
        sucess: false,
        message: 'Bad Request: followerId must be supplied'
      });
    }
    return next();
  }
}

export default UserAuthentication;
