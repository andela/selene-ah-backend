import JWTHelper from '../helpers/JWTHelper';
/**
 * @description this class handles user authentication
 */
class Authentication{

  /**
   * @param {object} req
   * @param {object} res
   * @param {function} next
   * @returns {function} next
   */
  static authenticateUser(req, res, next) {
    try {
      const userToken = req.headers.authorization.split(' ')[1];
      const verifiedToken = JWTHelper.verifyToken(userToken);
      req.token = verifiedToken;
      return next();
    } catch (err) {
      return next(err);
    }
  }
}

export default Authentication;
