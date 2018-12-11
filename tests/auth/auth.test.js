import chaiHttp from 'chai-http';
import nock from 'nock';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chai, {
  expect,
  should,
} from 'chai';
import models from '../../server/models';
import app from '../../server/index';
import authMock from '../../server/seeders/authMock';
import GoogleAuth from '../../server/helpers/auth/googleAuthenticate';
import GoogleStrategy
from '../../server/helpers/auth/strategies/googleStrategy';

const {User} = models;
chai.use(chaiHttp);

should();
chai.use(sinonChai);

describe('Users can login through /api/v1/auth/google', () => {
  before((done) => {
    nock('https://accounts.google.com')
      .filteringPath(() => '/')
      .get('/')
      .reply(200, authMock().profile);
    done();
  });
  it('should return 200 if user is successfully', (done) => {
    chai.request(app).get('/api/v1/auth/google')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.id).to.equal('4b2a1e1d-7e9f-406a-b22a-950a101d7675');
        expect(res.body.name.givenName).to.be.a('string');
        expect(res.body.name.familyName).to.be.a('string');
        expect(res.body.emails[0].value).to.be.a('string');
        done();
      });
  });

  it('should generate a hashed password', () => {
    expect(GoogleStrategy.generatePassword()).to.be.a('string');
    expect(GoogleStrategy.generatePassword().length).to.be.at.least(30);
  });
});
describe('Google passport Strategy functions', () => {
  context('Google Strategy Methods', () => {
    it('should be a method', () => {
      expect(GoogleStrategy.googleStrategy).to.be.a('function');
    });
    it('should exist GoogleStrategy function', () => {
      expect(GoogleStrategy.googleStrategy).to.exist;
    });
    it('should exist googleStrategyCallback function', () => {
      expect(GoogleStrategy.googleStrategyCallback).to.exist;
    });
    it('should be a method googleStrategyCallback', () => {
      expect(GoogleStrategy.googleStrategyCallback).to.be.a('function');
    });

  });


});

describe('Google passport authentication',() => {
  context('Google Strategy Methods', () => {
    it('should exist Google Authenticate route', () => {
      expect(GoogleAuth.googleRoute).to.exist;
    });
    it('should be a method - GoogeAuth.googleRoute', () => {
      expect(GoogleAuth.googleRoute).to.exist;
    });
  });
  context('Google Strategy Methods Call', () => {
    it('should exist Google Authenticate route callback', () => {
      expect(GoogleAuth.googleRoute).to.exist;
    });
    it('should be a method - GoogeAuth.googleRoute', () => {
      expect(GoogleAuth.googleRoute).to.be.a('function');
    });

    it('should exist Google Authenticate route callback', () => {
      expect(GoogleAuth.googleRouteCallback).to.exist;
    });
  });
  context('Google callback Route',()=>{
    const {user,loginMessage} = authMock();
    const req = {
      user,
    };
    const res = {
      status() {
        return this;
      },
      json(obj) {
        return obj;
      },
      loginMessage,
    };
    expect(GoogleAuth.googleRouteCallback(req, res))
    .to.have.property('message');
  });

  context('Google callback Route',()=>{
    const {user,loginMessage} = authMock();
    user.isNewUser = false;
    const req = {
      user,
    };
    const res = {
      status() {
        return this;
      },
      json(obj) {
        return obj;
      },
      loginMessage,
    };
    expect(GoogleAuth.googleRouteCallback(req, res))
    .to.have.property('message');
  });

  context('Save a new user authenticated by Google', async () => {
    before(() => {
      sinon.spy(User, 'findOrCreate');
    });

    after(() => {
      User.findOrCreate.restore();
    });

    const done = sinon.stub();
    const {profile} = authMock();
    const {accessToken, refreshToken} = authMock().tokens;
    await GoogleStrategy
    .googleStrategyCallback(accessToken, refreshToken, profile, done);
    User.findOrCreate.called;
  });
});
