import { expect } from 'chai';
import JWTHelper from '../../server/helpers/JWTHelper';
import UserFactory from '../mocks/factories/userFactory';
import removeDateStampAndPassword from
'../../server/helpers/removeDateStampAndPassword';


const userObject = UserFactory.build();
const token = JWTHelper.generateToken(
  removeDateStampAndPassword(userObject), '1d'
  );
const decodedToken = JSON.stringify(JWTHelper.verifyToken(token).user);
const expiredToken = JWTHelper.generateToken(
  removeDateStampAndPassword(userObject), '0.1s'
  );
const invalidDecodedToken = JWTHelper.verifyToken(expiredToken);

describe('Token generation and verification', () => {
  describe('Test for token generation', () => {
    it('should generate a valid token', ()=>{
      expect(token).to.be.a('string');
    });

    it('should fail if input is parameter is not a valid user object',()=>{
      expect(() => {
        JWTHelper.generateToken(8);
      }).to.throw('Please supply a valid user object.');
    });
  });

  describe('Test for token verification', () => {
    it('should verify and decode a valid token', ()=>{
      expect(decodedToken).to.equal(
        JSON.stringify(removeDateStampAndPassword(userObject))
        );
    });

    it('should fail if input is parameter is not a valid token string',()=>{
      expect(() => {
        JWTHelper.verifyToken(8);
      }).to.throw('Please enter a valid token.');
    });

    it('should return an error for expired tokens', () => {
      expect(invalidDecodedToken.message).to.equal('jwt expired');
    });
  });
});
