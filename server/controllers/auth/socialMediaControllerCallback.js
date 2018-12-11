/**
   * @description Google social login callback
   * @param {object} req
   * @param {object} res
   * @returns {function} Anonymous
   */
   const socialMediaControllerCallback = (req, res) => {
    const {
      token,
      isNewUser
    } = req.user;
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
