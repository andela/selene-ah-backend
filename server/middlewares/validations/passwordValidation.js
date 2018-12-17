import helpers from '../../helpers/validationHelper';
/**
 * @description This class is for validating password fields
 */
class PasswordValidation {
  /**
   * @description A middleware for validating passwords
   * @param {object} req - get response from body
   * @param {object} res - response to be sent
   * @param {object} next - callback function
   * @returns {object} A response object
   */
  static isPasswordValid(req, res, next) {
    if (!req.body.password || req.body.password.trim().length < 1) {
      return res.status(400).json({
        success: false,
        msg: 'Password field cannot be empty'
      });
    }
    if (req.body.password.trim().length < 8) {
      return res.status(400).json({
        success: false,
        msg: 'Password must not be less than 8 characters'
      });
    }
    if (!helpers.isPasswordValid(req.body.password.trim())) {
      return res.status(400).json({
        success: false,
        msg: 'Invalid Password: Password must contains a number and a symbol'
      });
    }
    return next();
  }
}

export default PasswordValidation;
