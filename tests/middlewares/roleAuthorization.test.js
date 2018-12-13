import chai, { expect, should } from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import RoleAuthorization
from '../../server/middlewares/RoleAuthorization';

chai.use(chaiHttp);
chai.use(sinonChai);
should();

describe('#Role Middleware', () => {
  afterEach(() => sinon.restore());

  context('Function Test', () => {
    it('should be a function authorizeUser', () => {
      expect(RoleAuthorization.authorizeUser).to.be.a('function');
    });

    it('should exist authorizeUser', () => {
      expect(RoleAuthorization.authorizeUser).to.exist;
    });

    it('should be a function isPermitted', () => {
      expect(RoleAuthorization.isPermitted).to.be.a('function');
    });

    it('should exist isPermitted', () => {
      expect(RoleAuthorization.isPermitted).to.exist;
    });
  });

  context('authorizeUser Test', () => {
    it('should return a function', () => {
      const response = RoleAuthorization.authorizeUser('regular');
      expect(response).to.be.a('function');
    });

    it('should call isPermitted function when user role is passed', () => {
        const request = {
          user: {
            role: 'regular'
          },
          headers: {
            token: 'null'
          }
        };
        const response = {
          status() {
            return this;
          },
          json(obj) {
            return obj;
          }
        };

        const next = sinon.stub();
        sinon.spy(RoleAuthorization, 'isPermitted');

        const responseFn = RoleAuthorization.authorizeUser('regular');

        responseFn(request, response, next);

        RoleAuthorization.isPermitted.should.have.been.calledOnce;
    });

    it('should return next when user is authorised', () => {
      const request = {
        user: {
          role: 'regular'
        },
        headers: {
          token: 'null'
        }
      };
      const response = {
        status() {
          return this;
        },
        json(obj) {
          return obj;
        }
      };

      const next = sinon.stub();
      sinon.stub(RoleAuthorization, 'isPermitted').returns(next);
      const responseFn = RoleAuthorization.authorizeUser('regular');
      responseFn(request, response, next);
      next.should.have.been.called;
    });
  });

  context('isPermitted Test', () => {
    it('should return true if user is authorized', () => {
      const response = RoleAuthorization.isPermitted('regular', 'regular');
      expect(response).to.be.a('boolean');
      expect(response).to.equal(true);
    });
  });
});
