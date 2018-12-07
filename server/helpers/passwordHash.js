import bcrypt from 'bcryptjs';
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
  hashPassword,
  comparePassword
};
