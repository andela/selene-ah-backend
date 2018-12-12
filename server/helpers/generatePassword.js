import passwordHash from './passwordHash';

  /**
   * @description Generate a random password for every user authenticated
   * @returns {function} hashPassword
   */
const generateRandomPassword = () => {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const numbersSpecialChars = '0123456789*&^%$##@!';
    const random = alphabet + numbersSpecialChars;
    let password = '';
    for (let i = 0; i < 8; i++) {
      password += random.charAt(Math.floor(Math.random() * random.length));
    }
    const randomHashedPassword = passwordHash.hashPassword(password);
    return randomHashedPassword;
};

export default generateRandomPassword;
