import { Router } from 'express';
import articleController from '../../controllers/articlesController';
import JWTAuthentication from '../../middlewares/JWTAuthentication';
import uuidValidator from '../../middlewares/validations/uuidValidator';
import articleValidation from '../../middlewares/articleValidation';
<<<<<<< HEAD
import articleSearchController from '../../controllers/articleSearchController';
import articleSearchValidation from '../../middlewares/articleSearchValidation';
import paginationValidation from '../../middlewares/paginationValidation';
=======
import ArticleReporter from '../../controllers/reportArticleController';
import RoleAuthorization from '../../middlewares/RoleAuthorization';
import { SUPERADMIN } from '../../helpers/constants';
>>>>>>> users are able to report an article[finishes #161779880]

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
<<<<<<< HEAD
* @description - Route to search for article using query
* @returns - It returns a response
*/
router.get('/articles/search', [
  paginationValidation.validateQueryParameter,
    articleSearchValidation.validateArticleSearchParameter],
      articleSearchController.searchArticle);
=======
* @description - Route to report an article
* @returns - It returns a response
*/
  router.post('/reportarticle/:articleId',
[uuidValidator.validateUUID,
  JWTAuthentication.authenticateUser],
ArticleReporter.reportAnArticle);

/**
* @description - Route to get all article that has been reported
* @returns - It returns a response
*/
router.get('/allreports',
[ JWTAuthentication.authenticateUser,
  RoleAuthorization.authorizeUser(SUPERADMIN)],
ArticleReporter.getAllReports);


/**
* @description - Route to get reports on a specific article
* @returns - It returns a response
*/
router.get('/articlereports/:articleId',
[ JWTAuthentication.authenticateUser,
  RoleAuthorization.authorizeUser(SUPERADMIN)],
ArticleReporter.getReportsOnAnArticle);
>>>>>>> users are able to report an article[finishes #161779880]

export default router;
