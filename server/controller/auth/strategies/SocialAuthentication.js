/**
 *
 *
 * @class SocailaAuthentication
 */
class SocailaAuthentication {
  /**
   *
   *
   * @static
   * @param {*} accessToken
   * @param {*} refreshToken
   * @param {*} profile
   * @param {*} done
   * @memberof SocailaAuthentication
   * @returns {*} callback
   */
  static facebookCallback(accessToken, refreshToken, profile, done) {
    // TODO: Save to Users Table
    done(null, profile);
  }
}

export default SocailaAuthentication;
