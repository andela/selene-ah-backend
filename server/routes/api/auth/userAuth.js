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

router.get('/auth/verifyemail', authController.verifyEmail);

router.get('/auth/verifyemail', authController.verifyEmail);

/**
 * @description sends link for user to update password
 * @param {string}
 * @param {function}
 */
router.post('/auth/resetpassword',
[email.isEmailValid,
  email.doesLoginEmailExist,
  authController.sendResetPasswordEmail
]);

/**
 * @description Updates the user password
 * @param {string}
 * @param {function}
 */
router.post('/auth/updatepassword',
[password.isPasswordValid,
  password.confirmPassword,
  authController.updateUserPassword
]);

export default router;
