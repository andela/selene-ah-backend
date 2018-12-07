import models from '../../models';
import password from '../../helpers/passwordHash';

const { User, Profile } = models;
/**
 * @description - Performs all auth function
 */
class AuthController {
  /**
   * @param {object} req - req to be sent
   * @param {object} res - respose gotten from server
   * @param {object} next - callback function
   * @returns {object} an object when a user is being signed up successfully
   */
  static async signupUser(req, res, next) {
    try {
      const user = await User.create({
        email: req.body.email.trim().toLowerCase(),
        password: password.hashPassword(req.body.password.trim()),
        firstName: req.body.firstname.trim(),
        lastName: req.body.lastname.trim(),
        userName: req.body.username.trim()
      });
      await Profile.create({
        userId: user.id,
        role: 'user'
      });
      return res.status(200).send({
        success: true,
        msg: 'User created successfully',
        user
      });
    } catch(err) {
      return next(err);
    }
  }

  /**
   * @description - This function login a user
   * @param {object} req - req to be sent
   * @param {object} res - respose gotten from server
   * @param {object} next - callback function
   * @returns {object} an object when a user is being signed up successfully
   */
  static async loginUser(req, res, next) {
    try {
      const user = await User.findOne({
        where: {
          email: req.body.email.toLowerCase().trim()
        }
      });
      if (user &&
        password.comparePassword(req.body.password.trim(), user.password)) {
          return res.status(200).json({
            success: true,
            msg: 'Login successful'
          });
        } else{
          return res.status(400).json({
            success: false,
            msg: 'Invalid email or password'
          });
        }
    } catch(err) {
      return next(err);
    }
  }
}

export default AuthController;
