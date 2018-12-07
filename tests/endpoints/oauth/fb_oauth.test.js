import chai, { expect, should } from 'chai';
import sinon from 'sinon';
import passport from 'passport';
import sinonChai from 'sinon-chai';
import Facebook
from '../../../server/controllers/auth/strategies/facebookStrategy';
import fakeRequest from '../../../server/seeders/auth/fakeRequest';
import fakeResponse from '../../../server/seeders/auth/fakeResponse';
import models from '../../../server/models';

const {User} = models;

should();
chai.use(sinonChai);

describe('Facebook OAuth Strategy', () => {

  context('Functions Tests', () => {
    it('should exist facebookStrategy function', () => {
      expect(Facebook.facebookStrategy).to.exist;
    });

    it('should be a function facebookStrategy', () => {
      expect(Facebook.facebookStrategy).to.be.a('function');
    });

    it('should exist facebookCallback function', () => {
      expect(Facebook.facebookCallback).to.exist;
    });

    it('should be a function facebookCallback', () => {
      expect(Facebook.facebookCallback).to.be.a('function');
    });

    it('should exist facebookControllerCallback', () => {
      expect(Facebook.facebookControllerCallback).to.exist;
    });

    it('should be a function facebookControllerCallback', () => {
      expect(Facebook.facebookControllerCallback).to.be.a('function');
    });
  });

  context('Response Test', () => {
    it('should return a token obj', () => {
      const user = Facebook
            .facebookControllerCallback(fakeRequest.fakeRequest1, fakeResponse);
      expect(user).to.be.an('object').that.has.property('token');
    });

    it('should return a msg obj', () => {
      const user = Facebook
            .facebookControllerCallback(fakeRequest.fakeRequest1, fakeResponse);
      expect(user).to.be.an('object').that.has.property('msg');
    });

    it('should have msg object that says Login Successful', () => {
      const user = Facebook
            .facebookControllerCallback(fakeRequest.fakeRequest1, fakeResponse);
      expect(user.msg).to.equal('Login Successful');
    });

    it('should have msg object that says Registration Successful', () => {
      const user = Facebook
            .facebookControllerCallback(fakeRequest.fakeRequest2, fakeResponse);
      expect(user.msg).to.equal('Registration Successful');
    });

    it('should have a profile object', () => {
      const user = Facebook
            .facebookControllerCallback(fakeRequest.fakeRequest2, fakeResponse);
      expect(user.profile).to.exist;
    });

    it('should have a isANewUser field', () => {
      const user = Facebook
            .facebookControllerCallback(fakeRequest.fakeRequest2, fakeResponse);
      expect(user.profile.isANewUser).to.exist;
    });

  });

  context('facebookCallback Test', async () => {
    const accessToken = {};
    const refreshToken = '';
    const profile = {
      displayName: 'Johh doe',
      id: 'asflasjdf'
    };

    const done = sinon.stub();

    const myStub = sinon.stub(User, 'findOrCreate').resolves({});
    await Facebook.facebookCallback(accessToken, refreshToken, profile, done);
    myStub.should.have.been.called;

    const passportStub = sinon.stub(passport, 'use').returns({});
    Facebook.facebookStrategy();
    passportStub.should.have.been.called;
  });
});
