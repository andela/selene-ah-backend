import sendEmail from '../../helpers/sendEmail';
import template from '../../helpers/emailTemplate';
import helpers from '../../helpers/validationHelper';

const { isSocialMediaEmail } = helpers;

const { welcome } = template;
/**
   * @description Google social login callback
   * @param {object} req
   * @param {object} res
   * @returns {function} Anonymous
   */
   const socialMediaControllerCallback = (req, res) => {
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
  };

  export default socialMediaControllerCallback;
