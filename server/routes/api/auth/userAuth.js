import { Router } from 'express';
import authController from '../../../controllers/auth/userAuth';
import
  email from '../../../middlewares/validations/emailValidation';
import
  password from '../../../middlewares/validations/passwordValidation';
import
  name from '../../../middlewares/validations/namingValidation';

const router = Router();

router.post('/auth/signup',
  [email.isEmailValid, email.doesEmailExist, password.isPasswordValid,
    name.isNameSupplied, name.isNameValid, name.isUsernameValid,
    name.doesUsernameExist], authController.signupUser);

router.post('/auth/signin',
  [email.isEmailValid, email.doesLoginEmailExist,
    password.isPasswordValid], authController.loginUser);

export default router;
