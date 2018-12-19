import {
  RESTRICTION_ERROR_MSG
} from '../helpers/responseMessages';

/**
 * @description this class handles role based access
 */
class RoleAuthorization{
  /**
   * @param {object} req
   * @param {object} res
   * @param {function} next
   * @returns {function} next
   */
  static authorizeUser(...permittedRoles) {
    return (request, response, next) => {
      const permissionStatus = RoleAuthorization.isPermitted(
          request.user.role, permittedRoles
          );
        if(permissionStatus) return next();
        return response.status(403).json({
          success: false,
          message: RESTRICTION_ERROR_MSG
        });
    };
  }

  /**
   * @param {string} userRole - the role of the user
   * @param {array} allowedRoles - an array of parameters
   * @return {boolean} returns true or false
   */
  static isPermitted(userRole, allowedRoles) {
    const isAllowed = allowedRoles.includes(userRole);
    if(!isAllowed) return false;
    return true;
  }
}

export default RoleAuthorization;
