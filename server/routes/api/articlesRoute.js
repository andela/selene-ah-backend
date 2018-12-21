import { Router } from 'express';
import articleController from '../../controllers/articlesController';
import JWTAuthentication from '../../middlewares/JWTAuthentication';
import uuidValidator from '../../middlewares/validations/uuidValidator';
import articleValidation from '../../middlewares/articleValidation';
import articleSearchController from '../../controllers/articleSearchController';
import articleSearchValidation from '../../middlewares/articleSearchValidation';
import paginationValidation from '../../middlewares/paginationValidation';

const router = Router();

/**
 * @description - Route is use to create an article
 * @returns - It returns an article object
 */
router.post('/article',
  JWTAuthentication.authenticateUser,
  articleValidation.validateArticleFields,
  uuidValidator.validateUUID,
  articleController.createArticle);

/**
* @description - Route gets  a particular article
* @returns - It returns just one article object
*/
router.get('/article/:id', uuidValidator.validateUUID,
  articleController.getOneArticle);

/**
 * @description - Route gets all articles
 * @returns - It returns an object of articles
 */
router.get('/articles', [JWTAuthentication.authenticateUser,
  paginationValidation.validateQueryParameter],
    articleController.getAllArticles);

/**
* @description - Route updates an article
* @returns - It returns a response
*/
router.put('/article/:id', uuidValidator.validateUUID,
  JWTAuthentication.authenticateUser,
  articleController.updateArticle);

/**
* @description - Route deletes an article
* @returns - It returns a response
*/
router.delete('/article/:id', uuidValidator.validateUUID,
  JWTAuthentication.authenticateUser,
  articleController.deleteArticle);

/**
* @description - Route to get all articles by an author
* @returns - It returns a response
*/
router.get('/article/author/:authorsId',
  articleController.getAuthorsArticles);

/**
* @description - Route to search for article using query
* @returns - It returns a response
*/
router.get('/articles/search', [
  paginationValidation.validateQueryParameter,
    articleSearchValidation.validateArticleSearchParameter],
      articleSearchController.searchArticle);

export default router;
