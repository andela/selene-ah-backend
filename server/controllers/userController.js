import models from '../models';
import pagination from '../helpers/pagination';

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
    const { limit, offset }= pagination.paginationHelper(req.query);
    try {
      const users = await User.findAll({
          attributes: {exclude: ['password', 'createdAt', 'updatedAt']},
          limit,
          offset
      });
      if (users.length <= 0){
        return res.status(404).json({
          success: false,
          msg: 'No User returned'
        });
      }
      return res.status(200).json({
        success: true,
        users,
        msg: 'User(s) returned successfully'
      });
    } catch(err) {
      return next(err);
    }
  }
}
export default UserController;
