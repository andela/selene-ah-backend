import { Router } from 'express';
import userController from '../../controllers/userController';
import JWTAuthentication from '../../middlewares/JWTAuthentication';
import paginationValidation from '../../middlewares/paginationValidation';

const router = Router();

router.get('/users',
  [JWTAuthentication.authenticateUser,
    paginationValidation.validateQueryParameter],
      userController.getAllUsers);

export default router;
