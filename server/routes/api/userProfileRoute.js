import { Router } from 'express';
import userProfileController from '../../controllers/userProfileController';
import JWTAuthentication from '../../middlewares/JWTAuthentication';
import uuidValidator from '../../middlewares/validations/uuidValidator';

const router = Router();

router.get('/user/profile', uuidValidator.validateUUID,
  JWTAuthentication.authenticateUser,
  userProfileController.getLoginUser);
router.get('/user/profile/:id', uuidValidator.validateUUID,
  JWTAuthentication.authenticateUser,
  userProfileController.getAnyUserProfile);
router.put('/user/profile/', uuidValidator.validateUUID,
  JWTAuthentication.authenticateUser,
  userProfileController.updateUserProfile);
export default router;
