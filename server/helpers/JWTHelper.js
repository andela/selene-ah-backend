import jsonWebToken from 'jsonwebtoken';
import { config } from 'dotenv';
import { secretKey } from '../config/config';

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
      return 'Please supply a valid user object.';
    }
    const token = jsonWebToken.sign({ user: userObject }, secretKey,
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
      return 'Please enter a valid token.';
    }
    const decodedToken = jsonWebToken.verify(userToken, secretKey);
    return decodedToken;
  }
}

export default JWTHelper;
