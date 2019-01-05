/* eslint-disable max-len */
import { Router } from 'express';
import userController from '../../../controllers/user/userController';
import JWTAuthentication from '../../../middlewares/JWTAuthentication';
import paginationValidation from '../../../middlewares/validations/paginationValidation';

const router = Router();

router.get('/users',
  [JWTAuthentication.authenticateUser,
    paginationValidation.validateQueryParameter],
      userController.getAllUsers);

export default router;
