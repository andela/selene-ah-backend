import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

const hashPassword = (password) => {
  const salt = bcrypt.genSaltSync(SALT_ROUNDS);
  const hash = bcrypt.hashSync(password, salt);
  return hash;
};

export default hashPassword;
