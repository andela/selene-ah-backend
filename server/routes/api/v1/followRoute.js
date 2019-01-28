/* eslint-disable max-len */
import { Router } from 'express';
import followersController from '../../../controllers/user/followersController';
import JWTAuthentication from '../../../middlewares/JWTAuthentication';
import UserAuthentication from '../../../middlewares/validations/followersAuthentication';
import uuidValidator from '../../../middlewares/validations/uuidValidator';
import paginationValidation from '../../../middlewares/validations/paginationValidation';

const router = Router();

/**
 * @description - Route is used to follow a user
 * @returns - It returns a response
 */
router.post('/follow',
  [JWTAuthentication.authenticateUser,
    UserAuthentication.isFollowerIdSupplied,
    uuidValidator.validateUUID,
    UserAuthentication.isFollowingSelf,
    UserAuthentication.checkIfUserExist,
      UserAuthentication.checkIfUserIsFollowed],
        followersController.followAuthor);

        /**
 * @description - Route is used to unfollow a user based on its id
 * @returns - It returns a response
 */
router.delete('/unfollow/:id',
  [JWTAuthentication.authenticateUser,
    uuidValidator.validateUUID,
    UserAuthentication.checkIfUserExist,
      UserAuthentication.checkIfUserNotFollowed],
        followersController.unfollowUser);

/**
 * @description - Route is used to get the followers of a user
 * @returns - It returns a response
 */
router.get('/followers',
  [JWTAuthentication.authenticateUser,
    paginationValidation.validateQueryParameter],
      followersController.getAllFollowers);

/**
 * @description - user following
 * @returns - It returns a response
 */
router.get('/following',
  [JWTAuthentication.authenticateUser,
    paginationValidation.validateQueryParameter],
      followersController.getAllFollowees);

/**
 * @description - get user followers by id
 * @returns - It returns a response
 */
router.get('/followers/:id',
  [JWTAuthentication.authenticateUser,
    uuidValidator.validateUUID,
      paginationValidation.validateQueryParameter],
        followersController.getUserFollowers);

/**
 * @description - user following by id
 * @returns - It returns a response
 */
router.get('/following/:id',
  [JWTAuthentication.authenticateUser,
    uuidValidator.validateUUID,
      paginationValidation.validateQueryParameter],
        followersController.getAnotherUserFollowees);

export default router;
