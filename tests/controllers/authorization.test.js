import chai, { should, expect, request } from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import Authorization from '../../server/controllers/Authorization';
import models from '../../server/models';
import server from '../../server';
import UserFactory from '../mocks/factories/userFactory';
import RoleFactory from '../mocks/factories/roleFactory';
import fakeRequest from '../mocks/auth/fakeRequest';
import fakeResponse from '../mocks/auth/fakeResponse';
import {
  NOT_FOUND_MSG,
  SUCCESSFULLY_CREATED_MSG,
  INVALID_STRING_MSG,
  ROLE_ALREADY_EXIST_MSG,
  SUCCESSFULLY_DELETED_MSG
} from '../../server/helpers/responseMessages';

chai.use(chaiHttp);
chai.use(sinonChai);
should();
const { Role, User } = models;

let token;

const SIGNIN_URL = '/api/v1/auth/signin';
const URL = '/api/v1/role/';

describe('#Authorization Test', () => {
  afterEach(() => sinon.restore());

  before(async() => {
    const user = UserFactory.build({
      email: 'admin@admin.com',
      password: 'password123!'
    });
    const res = await request(server)
      .post(SIGNIN_URL)
      .send(user);
    const jwtToken = res.body.token;
    token = jwtToken;
  });

  context('function test', () => {
    it('should have a function called getAllRoles', () => {
      expect(Authorization.getAllRoles).to.exist;
    });

    it('should be a function getAllRole', () => {
      expect(Authorization.getAllRoles).to.be.a('function');
    });

    it('should have a function called updateUserRole', () => {
      expect(Authorization.updateUserRole).to.exist;
    });

    it('should be a function updateUserRole', () => {
      expect(Authorization.updateUserRole).to.be.a('function');
    });

    it('should have a function called deleteARole', () => {
      expect(Authorization.deleteARole).to.exist;
    });

    it('should be a function deleteARole', () => {
      expect(Authorization.deleteARole).to.be.a('function');
    });

    it('should have a function called postANewRole', () => {
      expect(Authorization.postANewRole).to.exist;
    });

    it('should be a function postANewRole', () => {
      expect(Authorization.postANewRole).to.be.a('function');
    });
  });

  context('getAllRoles Tests', () => {
    it('should get all the role', async () => {
      const res = await request(server)
        .get(URL)
        .set('authorization', `Bearer ${token}`);
      expect(200);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('data');
    });

    it(`should return ${NOT_FOUND_MSG}
        when invalid role is passsed`, async () => {

      sinon.stub(Role, 'findAll').returns(false);
      const next = sinon.stub();
      const res = await Authorization
                          .getAllRoles(fakeRequest, fakeResponse, next);
      expect(res).to.be.an('object');
      expect(res.error).to.exist;
      expect(res.error).to.equal(NOT_FOUND_MSG);
    });

    it('should reach the catch block for undefined errors',async () => {
      sinon.stub(Role, 'findAll').throws();
      const next = sinon.stub();
      await Authorization.getAllRoles(fakeRequest, fakeResponse, next);
      next.should.have.been.called;
    });
  });

  context('postANewRole Test', () => {
    it('should post a new role', async () => {
      const role = RoleFactory.build({
        type: 'admin'
      });
      const res = await request(server)
        .post(URL)
        .set('authorization', `Bearer ${token}`)
        .send(role);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.equal(SUCCESSFULLY_CREATED_MSG);
    });

    it(`should give ${INVALID_STRING_MSG} when type is not valid`, async () => {
      const role = RoleFactory.build({
        type: 1283736
      });
      const res = await request(server)
      .post(URL)
      .set('authorization', `Bearer ${token}`)
      .send(role);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.equal(INVALID_STRING_MSG);
    });

    it(`should return ${ROLE_ALREADY_EXIST_MSG}`, async () => {
      const role = RoleFactory.build({
        type: 'admin'
      });
      const res = await request(server)
        .post(URL)
        .set('authorization', `Bearer ${token}`)
        .send(role);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.equal(ROLE_ALREADY_EXIST_MSG);
    });

    it('should reach the catch block for undefined errors',async () => {
      sinon.stub(Role, 'findOrCreate').throws();
      const next = sinon.stub();
      await Authorization.postANewRole(fakeRequest, fakeResponse, next);
      next.should.have.been.called;
    });
  });

  context('deleteRole Test', () => {
    it(`should give ${INVALID_STRING_MSG} when type is not valid`, async () => {
      const role = RoleFactory.build({
        type: 1283736
      });
      const res = await request(server)
      .delete(URL)
      .set('authorization', `Bearer ${token}`)
      .send(role);
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.property('message');
    expect(res.body.message).to.equal(INVALID_STRING_MSG);
    });

    it(`should return ${ROLE_ALREADY_EXIST_MSG}`, async () => {
      const role = RoleFactory.build({
        type: 'admin'
      });
      const res = await request(server)
        .delete(URL)
        .set('authorization', `Bearer ${token}`)
        .send(role);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.equal(SUCCESSFULLY_DELETED_MSG);
    });

    it('should reach the catch block for undefined errors',async () => {
      sinon.stub(Role, 'destroy').throws();
      const next = sinon.stub();
      await Authorization.deleteARole(fakeRequest, fakeResponse, next);
      next.should.have.been.called;
    });
  });

  context('UpdateUserRole Test', () => {
    it('should reach the catch block for undefined errors',async () => {
      sinon.stub(User, 'update').throws();
      const next = sinon.stub();
      await Authorization.updateUserRole(fakeRequest, fakeResponse, next);
      next.should.have.been.called;
    });

    it('should call the User update method', async() => {
      const updateStub = sinon.stub(User, 'update').returns({});
      const next = sinon.stub();
      await Authorization.updateUserRole(
        fakeRequest.fakeRequest1, fakeResponse, next
        );
      updateStub.should.have.been.called;
    });
  });
});
