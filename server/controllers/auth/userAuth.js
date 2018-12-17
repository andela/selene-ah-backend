import models from '../../models';
import password from '../../helpers/passwordHash';
import JWTHelper from '../../helpers/JWTHelper';
import removeDateStampAndPassword from
'../../helpers/removeDateStampAndPassword';
import sendEmail from '../../helpers/sendEmail';
import template from '../../helpers/emailTemplate';

const { User, Profile } = models;
const { verification, expiredToken, confirmation} = template;

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
    try {
      const user = await User.create({
        email: req.body.email.trim().toLowerCase(),
        password: password.hashPassword(req.body.password.trim()),
        firstName: req.body.firstName.trim(),
        lastName: req.body.lastName.trim(),
        userName: req.body.userName.trim()
      });
      await Profile.create({
        userId: user.id,
        role: 'user'
      });
      const token = JWTHelper.generateToken(
        removeDateStampAndPassword(user.dataValues), duration);
      sendEmail(user.email, token, req.headers.host,verification);
      return res.status(200).send({
        success: true,
        msg: 'User created successfully',
        user,
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
        const newToken =  JWTHelper.generateToken(user.dataValues, duration);
         return await sendEmail(email,newToken,req.headers.host,expiredToken);
      } else {
         await User.update({verified: true},
          {where: {id: decodedToken.user.id}});
          sendEmail(email,'',req.headers.host,confirmation);
         return res.status(200).send({
           success: true,
           msg: 'Email successfully confirmed',
         });
      }
    } catch(err) {
      return next(err);
    }
  }
}
export default AuthController;
