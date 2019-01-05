import bcrypt from 'bcryptjs';
/**
* @description - This function hashes password
* @param {password} password to be hashed
* @return {string} hashed password
*/
const hashPassword = (password) => {
  if(!password) throw new Error('No password defined');
  const hashed = bcrypt.hashSync(password, 10);
  return hashed;
};

/**
* @description - compares hashed password to plain password
* @param {string} password
* @param {string} hashedpassword
* @returns {Boolean} - Return true or false
*/
const comparePassword = (password, hashedpassword) => {
  if (!password || !hashedpassword) {
    throw new Error('No password or hashedPassword defined');
  }
  const isPassword = bcrypt.compareSync(password, hashedpassword);
  return isPassword;
};

export default {
  hashPassword,
  comparePassword
};
