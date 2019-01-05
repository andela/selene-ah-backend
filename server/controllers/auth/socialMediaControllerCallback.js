import sendEmail from '../../helpers/sendgrid/sendEmail';
import template from '../../helpers/sendgrid/emailTemplate';
import Validation from '../../helpers/validation/validations';

const { isSocialMediaEmail } = Validation;

const { welcome } = template;

/**
 * @class
 */
class SocialCallback {
  /**
   * @description Google social login callback
   * @param {object} req
   * @param {object} res
   * @returns {function} Anonymous
   */
  static socialMediaControllerCallback (req, res) {
    const {user , user: {token}, user : {isNewUser} } = req;
    if ( !(isSocialMediaEmail(user.email)) ) {
      sendEmail(user.email, welcome);
     }
   if (isNewUser) {
     return res.status(201).json({
       message: 'Registration Successfull',
       token,
     });
   }
   return res.status(200).json({
     message: 'Login Successfull',
     token,
   });
 }
}

export default SocialCallback;
