import dotenv from 'dotenv';
import sgMail  from '@sendgrid/mail';

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 *@description sends a mail
 * @param {string} to the receipient of the mail
 * @param {string} token containing user's details
 * @param {string} hostUrl  address of the host
 * @param {object} template additional message that the receipent should have
 * @returns {object} object
 */

  const sendEmail = (to, token, hostUrl, template) => {
    const { subject, from, text, html } = template;
    const url =
     `http://${hostUrl}/api/v1/auth/verifyemail?token=${token}&email=${to}`;

    if(subject === 'Expired Token' || subject === 'Email Verification'){
      template.html = `${template.html}
      <h2><a href="${url}" style="background-color: #6C54EC;
      color: white; padding: 5px 10px; text-decoration: none;
      border-radius: 2px;">CLICK ME</a></h2>
      `;
    }

    const msg = {
        to,
        from,
        subject,
        text,
        html
    };
    return sgMail.send(msg);
 };

   export default sendEmail;
