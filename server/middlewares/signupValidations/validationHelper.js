import bcrypt from 'bcrypt';
/**
 * @description checks if an email syntax is right or wrong
 * @param {String} email
 * @returns {Boolean} Boolean
 */
const isEmail = (email) => {
  // eslint-disable-next-line
  const emailRegex = /^([a-z_.!@#$%^&*0-9]{3,25})@([a-z]{3,20})\.([a-z]){3,7}(\.[a-z]{2,5})?$/i;
  return emailRegex.test(email);
};

/**
 * @description checks if a password syntax is right
 * @param {String} password to be tested
 * @returns {Boolean} returns true or false
 */
const isPassword = (password) => {
  // eslint-disable-next-line
  const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])([a-zA-Z0-9!@#$%^&*]{8,20})$/;
  return passwordRegex.test(password);
};

/**
 * @description checks if a name syntax is right
 * @param {String} name to be tested
 * @return {Boolean} returns true or false
 */
const isName = (name) => {
  const nameRegex = /^([a-z]){3,20}$/;
  return nameRegex.test(name);
};

/**
 * @description checks if a username syntax is right
 * @param {String} name to be tested
 * @return {Boolean} returns true or false
 */

const isUsername = (name) => {
  const usernameRegex = /^([a-z0-9!@#$%^&*]){3,20}$/;
  return usernameRegex.test(name);
};

/**
 * @description - This function hashes password
 * @param {password} password to be hashed
 * @return {string} hashed password
 */
const hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

/**
 * @description - compares hashed password to plain password
 * @param {string} plaintext
 * @param {string} hashedpassword
 * @returns {Boolean} - Return true or false
 */
const comparePassword = (plaintext, hashedpassword) => {
  return bcrypt.compareSync(plaintext, hashedpassword);
};

export default {
  isEmail,
  isUsername,
  isName,
  isPassword,
  hashPassword,
  comparePassword
};
