import { Router } from 'express';
import followersController from '../../controllers/followersController';
import JWTAuthentication from '../../middlewares/JWTAuthentication';
import UserAuthentication from '../../middlewares/userAuthentication';
import uuidValidator from '../../middlewares/validations/uuidValidator';

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
  [JWTAuthentication.authenticateUser],
    followersController.getAllFollowers);

router.get('/followees',
  [JWTAuthentication.authenticateUser],
    followersController.getAllFollowees);

router.get('/followers/:id',
  [JWTAuthentication.authenticateUser,
    uuidValidator.validateUUID],
    followersController.getUserFollowers);

router.get('/followees/:id',
  [JWTAuthentication.authenticateUser,
    uuidValidator.validateUUID],
      followersController.getAnotherUserFollowees);

export default router;
