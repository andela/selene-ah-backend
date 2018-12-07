import passport from 'passport';

/**
 * @description A class that implements google strategy for passport
 */
export default class GoogleAuth {
 /**
   * @description Google social login route
   * @returns {function} passport.authenticate
   */
  static googleRoute() {
      return passport.authenticate('google', {
        scope: ['profile', 'email']
      });
  }

  /**
   * @description Google social login callback
   * @param {object} req
   * @param {object} res
   * @returns {function} Anonymous
   */
  static googleRouteCallback(req, res) {
    const {
      token,
      isNewUser
    } = req.user;
    if (isNewUser) {
      return res.status(201).json({
        message: 'registration successfull',
        token,
      });
    }
    return res.status(200).json({
      message: 'login successfull',
      token,
    });
  }

}
