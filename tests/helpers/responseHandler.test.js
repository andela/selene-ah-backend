import sinon from 'sinon';
import { expect } from 'chai';
import generalHelpers from '../../server/helpers/responseHandler';

describe('Test for general helper functions', () =>{
  describe('Test for responseMessageHandler', () =>{
    it('fakes server error getting all cats', () => {
      const message = '';
      const res = {
        status() {},
        json() {}
      };

      sinon.stub(res, 'status').returnsThis();
      generalHelpers.responseMessageHandler(res, message);
      expect(res.status).to.have.been.calledWith(400);
    });
  });
});
