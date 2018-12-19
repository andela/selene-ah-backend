import models from '../../models';
import password from '../../helpers/passwordHash';
import JWTHelper from '../../helpers/JWTHelper';
import removeDateStampAndPassword from
'../../helpers/removeDateStampAndPassword';
import sendEmail from '../../helpers/sendEmail';
import emailTemplate from '../../helpers/emailTemplate';
import { REGULAR } from '../../helpers/constants';

const { User } = models;
const {
  verification, expiredToken, confirmation, resetPassword
} = emailTemplate;

const duration = '1d';
/**
 * @description - Performs all auth function
 */
class AuthController {
  /**
   * @param {object} req - req to be sent
   * @param {object} res - respose gotten from server
   * @param {object} next - callback function
   * @returns {object} an object when a user is being signed up successfully
   */
  static async signupUser(req, res, next) {
    const { email } = req.body;
    try {
      const user = await User.create({
        email: req.body.email.trim().toLowerCase(),
        password: password.hashPassword(req.body.password),
        firstName: req.body.firstName.trim(),
        lastName: req.body.lastName.trim(),
        userName: req.body.userName.trim(),
        role: REGULAR
      });
      const token = JWTHelper.generateToken(
        removeDateStampAndPassword(user.dataValues), duration);
      const verificationUrl =
      `${process.env.VERIFYEMAIL_URL}?token=${token}&email=${email}`;
      sendEmail(user.email, verification, verificationUrl);
      return res.status(200).send({
        success: true,
        msg: 'User created successfully',
        user: removeDateStampAndPassword(user.dataValues),
        token
      });
    } catch(err) {
      return next(err);
    }
  }

  /**
   * @description - This function login a user
   * @param {object} req - req to be sent
   * @param {object} res - respose gotten from server
   * @param {object} next - callback function
   * @returns {object} an object when a user is being signed up successfully
   */
  static async loginUser(req, res, next) {
    try {
      const user = await User.findOne({
        where: {
          email: req.body.email.toLowerCase().trim()
        }
      });
      if (user &&
        password.comparePassword(req.body.password.trim(), user.password)) {
          const token = JWTHelper.generateToken(
            removeDateStampAndPassword(user.dataValues), duration
            );
          return res.status(200).json({
            success: true,
            msg: 'Login successful',
            token
          });
        } else{
          return res.status(400).json({
            success: false,
            msg: 'Invalid email or password'
          });
        }
    } catch(err) {
      return next(err);
    }
  }

  /**
   *@description this function verify the email of a user
   * @param {object} req request to the sent
   * @param {object} res respond gotten form server
   * @param {object} next  callback funtion
   * @returns {object} an object when the email is successfully verified
   */
  static async verifyEmail(req, res, next) {
    const { token, email } = req.query;
    try {
      const decodedToken = JWTHelper.verifyToken(token);
      if (decodedToken.message) {
        const user = await User.findOne({
          where: {email},
          attributes: { exclude: ['createdAt', 'updatedAt', 'password']}
        });
        const newVerificationToken =
          JWTHelper.generateToken(user.dataValues, duration);
        const newVerificationUrl =
          `${process.env.VERIFYEMAIL_URL}?token=
          ${newVerificationToken}&email=${email}`;
         return await sendEmail(email,expiredToken, newVerificationUrl);
      } else {
         await User.update({verified: true},
          {where: {id: decodedToken.user.id}});
          sendEmail(email,confirmation);
         return res.status(200).send({
           success: true,
           msg: 'Email successfully confirmed',
         });
      }
    } catch(err) {
      return next(err);
    }
  }

    /**
     *@description It Sends Reset password Email to the user
     * @param {object} req - Express request object sent to the server
     * @param {object} res - Express response object gotten from the server
     * @param {object} next - Express next middleware function
     * @returns {res} Returns the response object
     */
  static async sendResetPasswordEmail(req, res, next) {
    const { email } = req.body;
    try {
      const user = await User.findOne({
        where: { email },
        attributes: { exclude: ['createdAt', 'updatedAt', 'password'] }
      });
      const tokenDuration = '30m';
      const { dataValues } = user;
      const resetPasswordToken = JWTHelper
        .generateToken(dataValues, tokenDuration);
      const inputPasswordPageUrl =
        `${process.env.UPDATEPASSWORD_URL}?${resetPasswordToken}`;
      await sendEmail(email, resetPassword, inputPasswordPageUrl);
      return res.status(200).json({
        success: true,
        message: 'Reset password link has been sent to your email'
      });
    } catch (err) {
      return next(err);
    }
  }

  /**
   *@description IT Updates the user password
   * @param {object} req - Express request object sent to the server
   * @param {object} res - Express response object gotten from the server
   * @param {object} next - Express next middleware function
   * @returns {res} - Returns the response object
   */
  static async updateUserPassword(req, res, next) {
    const { resetpasswordtoken} = req.headers;
    if (!resetpasswordtoken) {
      return res.status(400).send({
        success: false,
        message: 'Reset password token is required'
      });
    }
    try {
      const verifyResetPasswordToken = JWTHelper
        .verifyToken(resetpasswordtoken);
      if (!verifyResetPasswordToken.message) {
        const { email } = verifyResetPasswordToken.user;
        const userPassword = req.body.password;
        await User.update({
          password: password.hashPassword(userPassword),
        }, {
          where: { email }
        });
        return res.status(200).send({
          success: true,
          message: 'Password updated successfully'
        });
      } else {
        return res.status(400).send({
          success: false,
          message: 'Invalid Token: Request password token has expire',
        });
      }
    } catch (err) {
      return next(err);
    }
  }
}
export default AuthController;
