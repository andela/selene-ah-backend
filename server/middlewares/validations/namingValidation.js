import helpers from '../../helpers/validationHelper';
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
    if (body.firstName.trim() && !helpers.isNameValid(body.firstName.trim())) {
      return res.status(400).json({
        success: false,
        msg: 'Invalid Firstname: Supply a valid firstName'
      });
    }
    if (body.lastName.trim() && !helpers.isNameValid(body.lastName.trim())) {
      return res.status(400).json({
        success: false,
        msg: 'Invalid Lastname: Supply a valid lastName'
      });
    }
    return next();
  }

  /**
   * @description - check if firstName and lastName is supplied
  * @param {object} req - request to be sent to server
   * @param {object} res - responses gotton from server
   * @param {object} next - callback function
   * @returns {object} A response object from server
   */
  static isNameSupplied(req, res, next) {
    if (!req.body.firstName || !req.body.firstName.trim()) {
      return res.status(400).json({
        success: false,
        msg: 'Firstname must be supplied'
      });
    }
    if (!req.body.lastName || !req.body.lastName.trim()) {
      return res.status(400).json({
        success: false,
        msg: 'Lastname must be supplied'
      });
    }
    return next();
  }

  /**
   * @description - check if firstName and lastName is supplied
  * @param {object} req - request to be sent to server
   * @param {object} res - responses gotton from server
   * @param {object} next - callback function
   * @returns {object} A response object from server
   */
  static isUsernameValid(req, res, next) {
    if (!req.body.userName || req.body.userName.trim().length < 1) {
      return res.status(400).json({
        success: false,
        msg: 'Username must be supplied'
      });
    }
    if (req.body.userName.trim().length < 3) {
      return res.status(400).json({
        success: false,
        msg: 'Invalid Username: Username length must not be less than 3'
      });
    }
    if (!helpers.isUsernameValid(req.body.userName.trim())) {
      return res.status(400).json({
        success: false,
        msg: 'Invalid Username: supply a valid userName'
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
  static doesUsernameExist(req, res, next) {
    User.findOne({
      where: {
        userName: req.body.userName.trim().toLowerCase()
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
