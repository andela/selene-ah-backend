import JWTHelper from '../helpers/JWTHelper';
/**
 * @description this class handles user authentication
 */
class JWTAuthentication{

  /**
   * @param {object} req
   * @param {object} res
   * @param {function} next
   * @returns {function} next
   */
  static authenticateUser(req, res, next) {
    if (!req.headers.authorization) {
      return res.status(401).json({
        success: false,
        message: 'Authentication failed: Please supply a valid token.'
      });
    }
    try {
      const userToken = req.headers.authorization.split(' ')[1];
      const verifiedToken = JWTHelper.verifyToken(userToken);
      if (verifiedToken.name === 'JsonWebTokenError' ||
        verifiedToken.name === 'TokenExpiredError'){
        return res.status(401).json({
          success: false,
          message: 'Authentication failed: Please supply a valid token.'
        });
      }
      req.user = verifiedToken.user;
      return next();
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: 'Authentication failed: Please supply a valid token.'
      });
    }
  }
}

export default JWTAuthentication;
