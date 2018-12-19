/**
 * @description creates template for sending emails
 * @returns object of temapltes for sending emails;
 */
const emailTemplate = {
    verification: {
        from: 'no-reply@authorhaven.com',
        subject: 'Email Verification',
        text: 'Verify your Email at Author\'s Haven',
        html: `
        <h1 style="color: #6C54EC"> Welcome to Author's Haven</h1>
        <p style="color:black">Thank you for signing up
        for an author's haven account
        please click on the button to verify your email address</p>
        `
    },
    welcome: {
        from: 'no-reply@authorhaven.com',
        subject: 'Authors Haven accout created',
        text: 'Thank you for creating an account at Author\'s Haven',
        html: `
        <h1 style="color: #6C54EC"> Welcome to Author's Haven</h1>
        Log in into your account to start contributing.
         `
    },
    expiredToken: {
        from: 'no-reply@authorhaven.com',
        subject: 'Expired Token',
        text: 'The token you attempt to verify your account with has expired',
        html: `
        <h1 style="color: #6C54EC"> Welcome to Author's Haven</h1>
        You are receiving this mail because you made attempt to verify your
        account with expired credentials. Kindly click the link
        below to verify your account.
         `
    },
    confirmation: {
        from: 'no-reply@authorhaven.com',
        subject: 'Account succesfully confirmed',
        text: 'Thank you for confirming your account at Autho\'r Haven',
        html: `
        <h1 style="color: #6C54EC"> Welcome to Author's Haven</h1>
        <p>'Thank you for confirming your account at Author Haven'</p>
        Log in into your account to start contributing.
         `
    },
    resetPassword: {
        from: 'no-reply@authorhaven.com',
        subject: 'Please Reset Password',
        text: 'Reset Password at Author\'s Haven',
        html: `
        <h1 style="color: #6C54EC">Author's Haven</h1>
        <p>'You requested to reset your Author's Haven password.'</p>
        <p>'Please click on the button below within 
        the next 30 minute to reset your password:'</p>
         `
    }
};

export default emailTemplate;
