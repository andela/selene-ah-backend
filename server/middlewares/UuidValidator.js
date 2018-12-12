import checkUUID from './validations/validationHelper';
/**
 * @description this class handles user authentication
 */
class UuidValidator {
  /**
   * @param {object} req
   * @param {object} res
   * @param {function} next
   * @returns {function} next
   */
  static validateUUID(req, res, next) {
    const userUUID = req.params.id || req.body.userId;
    const isValidateUUID = checkUUID.isUUIDValid(userUUID);
    if (!isValidateUUID) {
      return res.status(400).json({
        success: false,
        message: 'Invalid UUID',
      });
    }
    return next();
  }
}

export default UuidValidator;