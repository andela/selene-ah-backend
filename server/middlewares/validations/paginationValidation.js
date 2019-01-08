/**
 * @class
 * @description - This class validates req.query object to
 *  ensures it contains a valid datatype
 */
class paginationValidation{
  /**
   * @param {object} req - request sent to the server
   * @param {object} res - response gotten from the server
   * @param {function} next - callback function to continue execution
   * @returns {object} - object representing response message
   */
  static validateQueryParameter(req, res, next) {
    const {page, limit } = req.query;
    if(page && isNaN(page)) {
      return res.status(400).json({
        success: false,
        message: 'page can only be an Integer'
      });
    }
    if (limit && isNaN(limit)){
      return res.status(400).json({
        success: false,
        message: 'limit can only be an Integer'
      });
    }
    if (limit < 0){
      return res.status(400).json({
        success: false,
        message: 'limit must not be negative'
      });
    }
    if (page < 0){
      return res.status(400).json({
        success: false,
        message: 'page must not be negative'
      });
    }
    return next();
  }
}

export default paginationValidation;
