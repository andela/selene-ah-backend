import dotenv from 'dotenv';
import sgMail  from '@sendgrid/mail';

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 *@description sends a mail
 * @param {string} to The recipient of the mail
 * @param {object} emailTemplate Message that the recipient should have
 * @param {object} linkUrl  The link the user should interact with in the mail
 * @returns {object} response from sendGrid api
 */
  const sendEmail = (to, emailTemplate, linkUrl) => {
    const { subject, from, text } = emailTemplate;
    let { html } = emailTemplate;

    if(linkUrl){
      html = `${html}
      <h2><a href="${linkUrl}" style="background-color: #6C54EC;
      color: white; padding: 5px 10px; text-decoration: none;
      border-radius: 2px;">CLICK ME</a></h2>
      `;
    }
    const messageProperty = { to, from, subject, text, html };
    return sgMail.send(messageProperty);
 };

   export default sendEmail;
