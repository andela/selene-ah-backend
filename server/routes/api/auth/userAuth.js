import { Router } from 'express';
import authController from '../../../controllers/auth/userAuth';
import
  emailValid from '../../../middlewares/validations/emailValidation';
import
  pwdValid from '../../../middlewares/validations/passwordValidation';
import
  nameValid from '../../../middlewares/validations/namingValidation';

const router = Router();

router.post('/auth/signup',
  [emailValid.isEmailValid, emailValid.isEmailExist, pwdValid.isPasswordValid,
    nameValid.isNameSupplied, nameValid.isNameValid, nameValid.isUsernameValid,
    nameValid.isUsernameExist], authController.signupUser);

router.post('/auth/signin',
  [emailValid.isEmailValid, emailValid.loginEmailExist,
    pwdValid.isPasswordValid], authController.loginUser);

export default router;
