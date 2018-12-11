import chaiHttp from 'chai-http';
import chai, { expect } from 'chai';
import JWTHelper from '../../server/helpers/JWTHelper';
import UserFactory from '../mock/userFactory';
import removeDateStampAndPassword from
'../../server/helpers/removeDateStampAndPassword';

const userObject = UserFactory.build();
const token = JWTHelper.generateToken(removeDateStampAndPassword(userObject));
const decodedToken = JSON.stringify(JWTHelper.verifyToken(token).user);

chai.use(chaiHttp);
describe('Token generation and verification', () => {
  describe('Test for token generation', () => {
    it('should generate a valid token', ()=>{
      expect(token).to.be.a('string');
    });

    it('should fail if input is parameter is not a valid user object',()=>{
      const invalidToken = JWTHelper.generateToken(8);
      expect(invalidToken).to.equal('Please supply a valid user object.');
    });
  });

  describe('Test for token verification', () => {
    it('should verify and decode a valid token', ()=>{
      expect(decodedToken).to.equal(
        JSON.stringify(removeDateStampAndPassword(userObject))
        );
    });

    it('should fail if input is parameter is not a valid token string',()=>{
      const invalidToken = JWTHelper.verifyToken(8);
      expect(invalidToken).to.eql('Please enter a valid token.');
    });
  });
});
