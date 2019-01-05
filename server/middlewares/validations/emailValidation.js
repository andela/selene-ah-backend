import Validation from '../../helpers/validation/validations';
import models from '../../models';

const { User } = models;
/**
 * @description This class is for validating email and password fields
 */
class EmailValidations {
  /**
   * @param {object} req - request to be sent to server
   * @param {object} res - responses gotton from server
   * @param {object} next - callback function
   * @returns {object} A response object from server
   */
  static isEmailValid(req, res, next) {
    if (!req.body.email || req.body.email.trim().length === '') {
      return res.status(400).json({
        success: false,
        message: 'Email field cannot be empty'
      });
    }
    if (!Validation.isEmailValid(req.body.email.trim())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Email: supply a valid email'
      });
    }
    return next();
  }
  /**
   * @param {object} req - request to be sent to server
   * @param {object} res - responses gotton from server
   * @param {object} next - callback function
   * @returns {object} A response object from server
   */
  static doesEmailExist(req, res, next) {
    User.findOne({
      where: {
        email: req.body.email.toLowerCase().trim()
        }
      }).then(data => {
        if (!data || data === null) {
          return next();
        }
        return res.status(400).json({
          success: false,
          message: 'Email already exist, Login'
        });
      });
  }

    /**
   * @param {object} req - request to be sent to server
   * @param {object} res - responses gotton from server
   * @param {object} next - callback function
   * @returns {object} A response object from server
   */
  static doesLoginEmailExist(req, res, next) {
    User.findOne({
      where: {
        email: req.body.email.trim()
        }
      }).then(data => {
        if (!data || data === null) {
          return res.status(400).json({
            success: false,
            message: 'Invalid email or password'
          });
        }
        return next();
      });
  }
      /**
   * @param {object} req - request to be sent to server
   * @param {object} res - responses gotton from server
   * @param {object} next - callback function
   * @returns {object} A response object from server
   */
  static doesResetPasswordEmailExist(req, res, next) {
    User.findOne({
      where: {
        email: req.body.email.trim()
        }
      }).then(data => {
        if (!data || data === null) {
          return res.status(400).json({
            success: false,
            message: 'Invalid email'
          });
        }
        return next();
      });
  }
}

export default EmailValidations;
