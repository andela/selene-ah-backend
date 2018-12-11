import jsonWebToken from 'jsonwebtoken';
import { config } from 'dotenv';
import { SECRETKEY } from '../config/config';

config();

const expirationTime = 86400;

/**
 * @description This class is for JWT token generation and verification
 */
class JWTHelper {
  /**
   * @description This function generates JWT tokens
   * @param {object} userObject
   * @returns {string} token
   */
  static generateToken(userObject){
    if(!userObject || !userObject.firstName) {
      throw new Error('Please supply a valid user object.');
    }
    const token = jsonWebToken.sign({ user: userObject }, SECRETKEY,
      {
        expiresIn: expirationTime,
      });

      return token;
  }

  /**
   * @description This function verifies and decodes JWT tokens
   * @param {string} userToken
   * @returns {Object} userObject
   */
  static verifyToken(userToken){
    if(!userToken || typeof userToken !=='string'){
      throw new Error('Please enter a valid token.');
    }
    const decodedToken = jsonWebToken.verify(userToken, SECRETKEY);
    return decodedToken;
  }
}

export default JWTHelper;
