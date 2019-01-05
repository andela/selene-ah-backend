import sinon from 'sinon';
import chai, { should } from 'chai';
import sinonChai from 'sinon-chai';
import JWTAuthentication from '../../server/middlewares/JWTAuthentication';
import JWTHelper from '../../server/helpers/auth/JWTHelper';
import fakeResponse from '../mocks/auth/fakeResponse';

chai.use(sinonChai);
should();

describe('JWTAuthentication Test', () => {
  afterEach(() => sinon.restore());
  it('should hit the catch block for any errors', () => {
    const req = {
      headers: {
        authorization: 'Beareer 83842924729847294'
      }
    };
    const next = sinon.stub();
    sinon.stub(JWTHelper, 'verifyToken').throws();
    JWTAuthentication.authenticateUser(req, fakeResponse, next);
    next.should.have.been.called;
  });
});
