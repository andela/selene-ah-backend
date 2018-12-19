import models from '../models';

const { User } = models;
/**
 * @description - Performs all auth function
 */
class UserController {
  /**
   * @param {object} req - req sent to server
   * @param {object} res - response gotten from server
   * @param {fn} next - callback function
   * @returns {obj} - response object
   */
  static async getAllUsers(req, res, next) {
    try {
      const user = await User.findAll({
          attributes: {exclude: ['password', 'createdAt', 'updatedAt']}
      });
      return res.status(200).json({
        success: true,
        users: user,
        msg: 'User returned successfully'
      });
    } catch(err) {
      return next(err);
    }
  }
}
export default UserController;
