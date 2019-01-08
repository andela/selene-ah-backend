/**
 *
 * @param {object} res - response object
 * @param {string} message - message to be sent as response
 * @param {integer} status - HTTP status code
 * @param {boolean} success - true for sucess and false for failure
 * @returns {object} - returns a response object
 */
const responseMessageHandler = (res, message, status=400, success=false) => {
  return res.status(status).json({
    success,
    message,
  });
};

export default {
  responseMessageHandler
};
