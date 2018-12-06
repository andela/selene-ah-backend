import helpers from './validationHelper';
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
        msg: 'Email field cannot be empty'
      });
    }
    if (!helpers.isEmail(req.body.email.trim())) {
      return res.status(400).json({
        success: false,
        msg: 'Invalid Email: supply a valid email'
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
  static isEmailExist(req, res, next) {
    User.findOne({
      where: {
        email: req.body.email.toLowerCase().trim()
        }
      }).then(data => {
        if (!data || data === null) {
          return next();
        }
        return res.status(400).json({
          success: 'failed',
          msg: 'Email already exist, Login'
        });
      });
  }

    /**
   * @param {object} req - request to be sent to server
   * @param {object} res - responses gotton from server
   * @param {object} next - callback function
   * @returns {object} A response object from server
   */
  static loginEmailExist(req, res, next) {
    User.findOne({
      where: {
        email: req.body.email.trim()
        }
      }).then(data => {
        if (!data || data === null) {
          return res.status(400).json({
            success: 'failed',
            msg: 'Invalid email or password'
          });
        }
        return next();
      });
  }
}

export default EmailValidations;
