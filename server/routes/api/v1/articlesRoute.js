/* eslint-disable max-len */
import { Router } from 'express';
import articleController from '../../../controllers/article/articlesController';
import JWTAuthentication from '../../../middlewares/JWTAuthentication';
import uuidValidator from '../../../middlewares/validations/uuidValidator';
import articleValidation from '../../../middlewares/validations/articleValidation';
import articleSearchController from '../../../controllers/article/articleSearchController';
import articleSearchValidation from '../../../middlewares/validations/articleSearchValidation';
import paginationValidation from '../../../middlewares/validations/paginationValidation';
import ArticleReporter from '../../../controllers/article/reportArticleController';
import RoleAuthorization from '../../../middlewares/RoleAuthorization';
import HighlightedCommment from '../../../controllers/comment/highlightedComment';
import { SUPERADMIN } from '../../../helpers/constants';
import article from '../../../middlewares/validations/checkIfArticleIsOwnedByUser';

const router = Router();



/**
* @description - Route to get all articles by an author
* @returns - It returns a response
*/
router.get('/article/author/',
  JWTAuthentication.authenticateUser,
  articleController.getAuthorsArticles
  );


/**
 * @description - Route is use to create an article
 * @returns - It returns an article object
 */
router.post('/article',
  JWTAuthentication.authenticateUser,
  articleValidation.validateArticleFields,
  uuidValidator.validateUUID,
  articleController.createArticle
  );

/**
* @description - Route gets  a particular article
* @returns - It returns just one article object
*/
router.get('/article/:id',
  uuidValidator.validateUUID,
  articleController.getOneArticle
  );

/**
* @description - Route gets  a particular article by a slug
* @returns - It returns just one article object
*/
router.get('/article/s/:slug',
  articleController.getArticleBySlug
  );

/**
 * @description - Route gets all articles
 * @returns - It returns an object of articles
 */
router.get('/articles',
  paginationValidation.validateQueryParameter,
  articleController.getAllArticles
  );

/**
* @description - Route updates an article
* @returns - It returns a response
*/
router.put('/article/:id',
  uuidValidator.validateUUID,
  JWTAuthentication.authenticateUser,
  article.checkIfArticleIsOwnedByUser,
  articleController.updateArticle
  );

/**
* @description - Route deletes an article
* @returns - It returns a response
*/
router.delete('/article/:id',
  uuidValidator.validateUUID,
  JWTAuthentication.authenticateUser,
  article.checkIfArticleIsOwnedByUser,
  articleController.deleteArticle
  );


/**
* @description - Route to search for article using query
* @returns - It returns a response
*/
router.get('/articles/search', [
  paginationValidation.validateQueryParameter,
  articleSearchValidation.validateArticleSearchParameter
  ],
  articleSearchController.searchArticle
  );

/**
* @description - Route to report an article
* @returns - It returns a response
*/
router.post('/reportarticle/:articleId', [
  uuidValidator.validateUUID,
  JWTAuthentication.authenticateUser
  ],
  ArticleReporter.reportAnArticle
  );

/**
* @description - Route to get all article that has been reported
* @returns - It returns a response
*/
router.get('/allreports', [
  JWTAuthentication.authenticateUser,
  RoleAuthorization.authorizeUser(SUPERADMIN)],
  ArticleReporter.getAllReports
  );


/**
* @description - Route to get reports on a specific article
* @returns - It returns a response
*/
router.get('/articlereports/:articleId', [
  JWTAuthentication.authenticateUser,
  uuidValidator.validateUUID,
  RoleAuthorization.authorizeUser(SUPERADMIN)
],
  ArticleReporter.getReportsOnAnArticle
  );

/**
* @description - Route to post hightlighted comment on an article
* @returns - It returns a response
*/
router.post('/highlights/:articleId', [
  JWTAuthentication.authenticateUser,
  uuidValidator.validateUUID
  ],
  HighlightedCommment.addComment
  );

/**
* @description - Route to update hightlighted comment on an article
* @returns - It returns a response
*/
router.put('/highlights/:commentId/update', [
  JWTAuthentication.authenticateUser,
  uuidValidator.validateUUID
  ],
  HighlightedCommment.updateComment
  );

router.delete('/highlights/:commentId/delete', [
  JWTAuthentication.authenticateUser,
  uuidValidator.validateUUID
  ],
  HighlightedCommment.deleteComment)
  ;

export default router;
