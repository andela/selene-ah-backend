import {
  VOTE_BAD_REQUEST_MSG,
  VOTE_REQUIRED_MSG
} from '../../helpers/responseMessages';

const REQUIRED_PARAMS = [1, -1, 0];

/**
 * @description Validates our article vote input
 * @class
 */
class ArticleVoteValidator {
  /**
   * @description Validates the request body
   * @param {object} req
   * @param {object} res
   * @param {function} next
   * @returns {function} Next function
   */
  static validateRequest(req, res, next) {
    const { vote } = req.body;
    if(typeof vote === 'undefined') {
      return res.status(400).json({ message: VOTE_REQUIRED_MSG });
    }
    const isAValidParam = ArticleVoteValidator.isAValidParam(vote);

    if (!isAValidParam) {
      return res.status(400).json({ message: VOTE_BAD_REQUEST_MSG });
    }

    return next();
  }
  /**
   * @description Checks if vote params passed is valid
   * @param {integer} vote
   * @returns {boolean} True or False
   */
  static isAValidParam(vote) {
    return REQUIRED_PARAMS.includes(vote);
  }
}

export default ArticleVoteValidator;
