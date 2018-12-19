import validationHelper from '../../helpers/validationHelper';
import generalHelpers from '../../helpers/generalHelpers';
import models from '../../models';
import {
  INVALID_ARTICLE_ID_ERROR,
  INVALID_RATING_ERROR,
  REQUIRED_ARTICLE_ID_ERROR,
  NOT_EXISTS_ARTICLE_ID_ERROR,
  NO_ARTICLE_RATING,
  RATE_OWN_ARTICLE_ERROR,
}
  from '../../helpers/responseMessages';

  const { Article, Rating } = models;

/**
 * @description - class for validating user rating data
 */
class RatingValidator {
  /**
   * @description - checks the validity of the article
   * @param {object} req - request object
   * @param {object} res - response object
   * @param {function} next - function
   * @returns {functin} next
   */
  static async validateArticleId(req, res, next){
    const { articleId } = req.params;

    if(!articleId || articleId+''.trim()===''){
      return generalHelpers.responseMessageHandler(
        res, REQUIRED_ARTICLE_ID_ERROR, 400, false
        );
    }

    if(!validationHelper.isUUIDValid(articleId)){
      return generalHelpers.responseMessageHandler(
        res, INVALID_ARTICLE_ID_ERROR, 400, false
        );
    }

    const articleExists = await validationHelper.entityExistsInTable(
      Article, {id: articleId}
      );

    if(!articleExists) {
      return generalHelpers.responseMessageHandler(
        res, NOT_EXISTS_ARTICLE_ID_ERROR, 404, false
      );
    }
    return next();
  }

  /**
   * @description - checks the validity of the article rating
   * @param {object} req - request object
   * @param {object} res - response object
   * @param {function} next
   * @returns {function} next
   */
  static validateRating(req, res, next){
    const { articleRating } = req.body;
    if(
      !articleRating ||
      typeof articleRating !== 'number' ||
      articleRating <= 0 ||
      articleRating > 5
      ){
      return generalHelpers.responseMessageHandler(
        res, INVALID_RATING_ERROR, 400, false
        );
    }
      return next();
  }

  /**
   * @description - checks if an article has been rated
   * @param {object} req - request object
   * @param {object} res - response object
   * @param {object} next
   * @returns {function} next
   */
  static async checkIfArticleIsRated(req, res, next){
    const { articleId } = req.params;
    const articleIsRated = await validationHelper.entityExistsInTable(
      Rating, { articleId }
      );

      if(!articleIsRated){
        return generalHelpers.responseMessageHandler(
          res, NO_ARTICLE_RATING, 404, false
        );
      }

      return next();
  }

  /**
   *
   * @param { object } req - request object
   * @param { object } res - response object
   * @param { object } next
   * @returns { object } next
   */
  static async checkIfOwnerWantsToRate(req, res, next){
    const userId = req.user.id;
    const articleId = req.params.articleId;
    const articleBelongsToLoggedInUser = await validationHelper
          .entityExistsInTable(
      Article, {id: articleId, userId:userId}
    );

    if(articleBelongsToLoggedInUser){
      return generalHelpers.responseMessageHandler(
        res, RATE_OWN_ARTICLE_ERROR, 403, false
      );
    }

    return next();
  }
}

export default RatingValidator;
