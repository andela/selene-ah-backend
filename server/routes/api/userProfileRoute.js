import { Router } from 'express';
import userProfileController from '../../controllers/userProfileController';
import JWTAuthentication from '../../middlewares/JWTAuthentication';
import UuidValidator from '../../middlewares/UuidValidator';



const router = Router();

router.get('/user/profile', UuidValidator.validateUUID,
  JWTAuthentication.authenticateUser,
  userProfileController.getLoginUser);

router.get('/user/profile/:id', UuidValidator.validateUUID,
  JWTAuthentication.authenticateUser,
  userProfileController.getAnyUserProfile);

router.put('/user/profile/', UuidValidator.validateUUID,
  JWTAuthentication.authenticateUser,
  userProfileController.updateUserProfile);
export default router;
