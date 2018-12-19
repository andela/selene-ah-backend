import { Router} from 'express';
import JWTAuthentication from '../../middlewares/JWTAuthentication';
import RatingController from '../../controllers/ratingController';
import RatingValidator from '../../middlewares/validations/ratingValidator';

const router = Router();

router.post('/articles/:articleId/rating', [
  JWTAuthentication.authenticateUser,
  RatingValidator.validateArticleId,
  RatingValidator.validateRating,
  RatingValidator.checkIfOwnerWantsToRate
],
  RatingController.rateArticle
  );

router.put('/articles/:articleId/rating', [
  JWTAuthentication.authenticateUser,
  RatingValidator.validateArticleId,
  RatingValidator.validateRating,
  RatingValidator.checkIfOwnerWantsToRate
],
RatingController.updateRating
);

router.get('/articles/:articleId/rating', [
  RatingValidator.validateArticleId,
  RatingValidator.checkIfArticleIsRated
],
RatingController.getSingleArticleRatings
);

router.get('/user/articles/:articleId/rating',[
  JWTAuthentication.authenticateUser,
  RatingValidator.validateArticleId,
  RatingValidator.checkIfArticleIsRated
],
RatingController.getArticleRatingForUser
);

export default router;
