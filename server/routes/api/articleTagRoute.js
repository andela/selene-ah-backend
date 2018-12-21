import { Router } from 'express';
import articleTagController from '../../controllers/articleTagsController';
import uuidValidator from '../../middlewares/validations/uuidValidator';
import article from '../../middlewares/validations/checkIfArticleIsOwnedByUser';
import JWTAuthentication from '../../middlewares/JWTAuthentication';


const router = Router();

/**
 * @description - Route is use to create a tag for an article
 * @returns - It returns a response
 */
router.get('/tags/',
  articleTagController.getAllTags);

/**
 * @description - Route is use to remove a tag
 * @returns - It returns a response
 */
router.delete('/tag/:articleId/:tagId',
  uuidValidator.validateUUID,
  JWTAuthentication.authenticateUser,
  article.checkIfArticleIsOwnedByUser,
  articleTagController.deleteArticleTag);
export default router;
