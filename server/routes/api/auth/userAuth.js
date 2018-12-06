import { Router } from 'express';
import authController from '../../../controllers/auth/userAuth';
import
  emailValid from '../../../middlewares/signupValidations/emailValidation';
import
  pwdValid from '../../../middlewares/signupValidations/passwordValidation';
import
  nameValid from '../../../middlewares/signupValidations/namingValidation';

const router = Router();

router.post('/auth/signup',
  [emailValid.isEmailCheck, emailValid.isEmailExist, pwdValid.isPasswordCheck,
    nameValid.isNameSupplied, nameValid.isNameValid, nameValid.isUsernameCheck,
    nameValid.isUsernameExist], authController.signupUser);

router.post('/auth/signin',
  [emailValid.isEmailCheck, emailValid.loginEmailExist,
    pwdValid.isPasswordCheck], authController.loginUser);

export default router;
