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
    UserAuthentication.doesUserExist,
      UserAuthentication.isFollowingUser], followersController.followAuthor);

router.delete('/unfollow/:id',
  [JWTAuthentication.authenticateUser,
    uuidValidator.validateUUID,
    UserAuthentication.doesUserExist,
      UserAuthentication.isNotFollowingUser],
        followersController.unfollowUser);

router.get('/follower',
  [JWTAuthentication.authenticateUser],
    followersController.getAllFollowers);

router.get('/followee',
  [JWTAuthentication.authenticateUser],
    followersController.getAllFollowees);

router.get('/follower/:id',
  [JWTAuthentication.authenticateUser,
    uuidValidator.validateUUID],
    followersController.getUserFollowers);

router.get('/followee/:id',
  [JWTAuthentication.authenticateUser,
    uuidValidator.validateUUID],
      followersController.getAnotherUserFollowees);

export default router;
