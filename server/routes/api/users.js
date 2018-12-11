import { Router } from 'express';
import userController from '../../controllers/userController';
import JWTAuthentication from '../../middlewares/JWTAuthentication';

const router = Router();

router.get('/users',
  [JWTAuthentication.authenticateUser], userController.getAllUsers);

export default router;
