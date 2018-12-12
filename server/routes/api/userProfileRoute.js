import { Router } from 'express';
import userProfileController from '../../controllers/userProfileController';
import JWTAuthentication from '../../middlewares/JWTAuthentication';


const router = Router();

router.get('/user/profile',
  JWTAuthentication.authenticateUser,
  userProfileController.getLoginUser);

router.get('/user/profile/:id',
  JWTAuthentication.authenticateUser,
  userProfileController.getAnyUserProfile);

router.put('/user/profile/',
  JWTAuthentication.authenticateUser,
  userProfileController.updateUserProfile);
export default router;
