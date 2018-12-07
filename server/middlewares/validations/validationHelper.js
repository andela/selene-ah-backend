/**
 * @description checks if an email syntax is right or wrong
 * @param {String} email
 * @returns {Boolean} Boolean
 */
const isEmailValid = (email) => {
  // eslint-disable-next-line
  const emailRegex = /^([a-z_.!@#$%^&*0-9]{3,25})@([a-z]{3,20})\.([a-z]){3,7}(\.[a-z]{2,5})?$/i;
  return emailRegex.test(email);
};

/**
 * @description checks if a password syntax is right
 * @param {String} password to be tested
 * @returns {Boolean} returns true or false
 */
const isPasswordValid = (password) => {
  // eslint-disable-next-line
  const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])([a-zA-Z0-9!@#$%^&*]{8,20})$/;
  return passwordRegex.test(password);
};

/**
 * @description checks if a name syntax is right
 * @param {String} name to be tested
 * @return {Boolean} returns true or false
 */
const isNameValid = (name) => {
  const nameRegex = /^([a-zA-Z]){3,20}$/;
  return nameRegex.test(name);
};

/**
 * @description checks if a username syntax is right
 * @param {String} name to be tested
 * @return {Boolean} returns true or false
 */

const isUsernameValid = (name) => {
  const usernameRegex = /^([a-zA-Z0-9!@#$%^&*]){3,20}$/;
  return usernameRegex.test(name);
};

export default {
  isEmailValid,
  isUsernameValid,
  isNameValid,
  isPasswordValid
};
