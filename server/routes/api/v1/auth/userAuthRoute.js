import { Router } from 'express';
import authController from '../../../../controllers/auth/userAuthController';
import
  email from '../../../../middlewares/validations/emailValidation';
import
  password from '../../../../middlewares/validations/passwordValidation';
import
  name from '../../../../middlewares/validations/namingValidation';

const router = Router();

router.post('/auth/signup',
  [email.isEmailValid, email.doesEmailExist, password.isPasswordFieldEmpty,
    password.isPasswordValid, name.isNameSupplied, name.isNameValid,
      name.isUsernameValid, name.doesUsernameExist], authController.signupUser);

router.post('/auth/signin',
  [email.isEmailValid, email.doesLoginEmailExist,
    password.isPasswordFieldEmpty], authController.loginUser);

router.get('/auth/verifyemail', authController.verifyEmail);

/**
 * @description sends link for user to update password
 * @param {string}
 * @param {function}
 */
router.post('/auth/resetpassword',
[email.isEmailValid,
  email.doesResetPasswordEmailExist],
  authController.sendResetPasswordEmail
);

/**
 * @description Updates the user password
 * @param {string}
 * @param {function}
 */
router.post('/auth/updatepassword',
[password.isPasswordValid,
  password.confirmPassword],
  authController.updateUserPassword
);

export default router;
