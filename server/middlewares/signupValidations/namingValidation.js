import helpers from './validationHelper';
import models from '../../models';

const { User } = models;
/**
 * @description This class is for validating names
 */
class NamingValidations {
  /**
   * @description - checks if a name syntax is write
   * @param {object} req - request from server
   * @param {object} res - response gotton from server
   * @param {object} next - call a middleware when done
   * @returns {object} A response object
   */
  static isNameValid(req, res, next) {
    const body = req.body;
    if (body.firstname.trim() && !helpers.isName(body.firstname.trim())) {
      return res.status(400).json({
        success: false,
        msg: 'Invalid Firstname: Supply a valid firstname'
      });
    }
    if (body.lastname.trim() && !helpers.isName(body.lastname.trim())) {
      return res.status(400).json({
        success: false,
        msg: 'Invalid Lastname: Supply a valid lastname'
      });
    }
    return next();
  }

  /**
   * @description - check if firstname and lastname is supplied
   * @param {object} req - request to server
   * @param {object} res - response from server
   * @param {object} next - call a middleware when done
   * @returns {object} - A response object
   */
  static isNameSupplied(req, res, next) {
    if (!req.body.firstname || !req.body.firstname.trim()) {
      return res.status(400).json({
        success: false,
        msg: 'Firstname must be supplied'
      });
    }
    if (!req.body.lastname || !req.body.lastname.trim()) {
      return res.status(400).json({
        success: false,
        msg: 'Lastname must be supplied'
      });
    }
    return next();
  }

  /**
   * @description - check if firstname and lastname is supplied
   * @param {object} req
   * @param {object} res
   * @param {object} next
   * @returns {object} - A response object
   */
  static isUsernameCheck(req, res, next) {
    if (!req.body.username || req.body.username.trim().length < 1) {
      return res.status(400).json({
        success: false,
        msg: 'Username must be supplied'
      });
    }
    if (req.body.username.trim().length < 3) {
      return res.status(400).json({
        success: false,
        msg: 'Invalid Username: Username length must not be less than 3'
      });
    }
    if (!helpers.isUsername(req.body.username.trim())) {
      return res.status(400).json({
        success: false,
        msg: 'Invalid Username: supply a valid username'
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
  static isUsernameExist(req, res, next) {
    User.findOne({
      where: {
        userName: req.body.username.trim().toLowerCase()
        }
      }).then(data => {
        if (!data || data === null) {
          return next();
        }
        return res.status(400).json({
          success: 'failed',
          msg: 'Username already exist, Try another'
        });
      });
  }
}

export default NamingValidations;
