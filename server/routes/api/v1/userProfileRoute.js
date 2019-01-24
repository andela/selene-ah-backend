import { Router } from 'express';
import userProfileController from
  '../../../controllers/profile/userProfileController';
import JWTAuthentication from '../../../middlewares/JWTAuthentication';
import uuidValidator from '../../../middlewares/validations/uuidValidator';

const router = Router();

router.get('/user/profile/auth',
  JWTAuthentication.authenticateUser,
  userProfileController.getLoginUser);
router.get('/user/profile/:id', uuidValidator.validateUUID,
  userProfileController.getAnyUserProfile);
router.put('/user/profile',
  JWTAuthentication.authenticateUser,
  userProfileController.updateUserProfile);
export default router;
