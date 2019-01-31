import db from '../../models';

const { User } = db;
/**
* @description class will implement users profile functionality
*
* @class userProfileController
*/
class UserProfileController {
  /**
   * @param {object} req - Request sent to the router
   * @param {object} res - Response sent from the controller
   * @param {object} userId
   * @returns {object} - object representing response message
   * @param {object} next - Error handler
   */
  static async getUserProfile(req, res, userId, next) {
    try {
      const getUser = await User.findOne({
        where: { id: userId }
      });

      if (!getUser) {
        return res.status(404).json({
          success: 'false',
          message: 'User not found',
        });
      }
        let userProfile = {
          firstName: getUser.firstName,
          lastName: getUser.lastName,
          userName: getUser.userName,
          email: getUser.email,
          bio: getUser.bio,
          twitter: getUser.twitterUrl,
          facebook: getUser.facebookUrl,
          image: getUser.imageUrl,
          gender: getUser.gender,

        };
        if(Object.keys(req.params).length === 0){
          userProfile = {
            ...userProfile,
            dateOfBirth: getUser.dateOfBirth,
          };
        }

      return res.status(200).json({
        success: 'true',
        message: 'Retrieved profile successfully',
        userProfile
      });

    } catch (error) {
      return next(error);
    }
  }
  /**
   * @description - Method to get login user profile
   *
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @returns {object} - object representing response message
   * @param {object} next - Return error
   */
  static async getLoginUser(req, res, next) {
    const { id } = req.user;
    return UserProfileController.getUserProfile(req, res, id, next);
  }
  /**
   * @description - Method to get any user profile
   * @returns {object} - returns an object
   * @param {object} req - request object send to the route
   * @param {object} res - response object sent back from the route
   * @param {object} next - Error handler
   */
  static async getAnyUserProfile(req, res, next) {
    const { id } = req.params;
    return UserProfileController.getUserProfile(req, res, id, next);
  }
  /**
   * @description - method for updating user's profile
   * @returns {object} - object representing response message
   * @param {object} req - Request sent to the router
   * @param {object} res - Response sent from the controller
   * @param {object} next - Error handler
   */
  static async updateUserProfile(req, res, next) {
    try {
      const { id } = req.user;
      const getUser = await User.findOne({
        where: { id }
      });

      await User.update(
        {
          firstName: req.body.firstName || getUser.firstName,
          lastName: req.body.lastName || getUser.lastName,
          gender: req.body.gender || getUser.gender,
          bio: req.body.bio || getUser.bio,
          imageUrl: req.body.image || getUser.imageUrl,
          twitterUrl: req.body.twitter || getUser.twitterUrl,
          facebookUrl: req.body.facebook || getUser.facebookUrl,
          dateOfBirthday: req.body.dob || getUser.dateOfBirthday,
        },
        {
          where: { id: getUser.id }
        }
      );

      return res.status(200).json({
        success: 'true',
        message: 'Updated profile successfully',
      });
    } catch (error) {
      return next(error);
    }
  }
}

export default UserProfileController;
