/* eslint-disable max-len */
import { Router } from 'express';
import followersController from '../../../controllers/user/followersController';
import JWTAuthentication from '../../../middlewares/JWTAuthentication';
import UserAuthentication from '../../../middlewares/validations/followersAuthentication';
import uuidValidator from '../../../middlewares/validations/uuidValidator';
import paginationValidation from '../../../middlewares/validations/paginationValidation';

const router = Router();

router.post('/follow',
  [JWTAuthentication.authenticateUser,
    UserAuthentication.isFollowerIdSupplied,
    uuidValidator.validateUUID,
    UserAuthentication.isFollowingSelf,
    UserAuthentication.checkIfUserExist,
      UserAuthentication.checkIfUserIsFollowed],
        followersController.followAuthor);

router.delete('/unfollow/:id',
  [JWTAuthentication.authenticateUser,
    uuidValidator.validateUUID,
    UserAuthentication.checkIfUserExist,
      UserAuthentication.checkIfUserNotFollowed],
        followersController.unfollowUser);

router.get('/followers',
  [JWTAuthentication.authenticateUser,
    paginationValidation.validateQueryParameter],
      followersController.getAllFollowers);

router.get('/followees',
  [JWTAuthentication.authenticateUser,
    paginationValidation.validateQueryParameter],
      followersController.getAllFollowees);

router.get('/followers/:id',
  [JWTAuthentication.authenticateUser,
    uuidValidator.validateUUID,
      paginationValidation.validateQueryParameter],
        followersController.getUserFollowers);

router.get('/followees/:id',
  [JWTAuthentication.authenticateUser,
    uuidValidator.validateUUID,
      paginationValidation.validateQueryParameter],
        followersController.getAnotherUserFollowees);

export default router;
