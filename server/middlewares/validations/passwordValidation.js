import Validation from '../../helpers/validation/validations';
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
    if (req.body.password.trim().length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must not be less than 8 characters'
      });
    }
    if (!Validation.isPasswordValid(req.body.password)) {
      return res.status(400).json({
        success: false,
        message: 'Password must contain at least a number'
      });
    }
    return next();
  }

    /**
   * @description A middleware for validating empty password field
   * @param {object} req - get response from body
   * @param {object} res - response to be sent
   * @param {object} next - callback function
   * @returns {object} A response object
   */
  static isPasswordFieldEmpty(req, res, next) {
    if (!req.body.password || req.body.password.trim().length < 1) {
      return res.status(400).json({
        success: false,
        message: 'Password field cannot be empty'
      });
    }
    return next();
  }

  /**
   * @description A middleware that checks if password = confirmPassword
   * @param {object} req - Express request object sent to the server
   * @param {object} res - Express response object gotten from the middleware
   * @param {object} next - Express next middleware function
   * @returns {res} - Returns the response object
   */
  static confirmPassword(req, res, next){
    const { password, confirmPassword } = req.body;
    if(password !== confirmPassword){
      return res.status(400).json({
        success: false,
        message: 'Password and confirm password must be the same'
      });
    }
    return next();
  }
}

export default PasswordValidation;
