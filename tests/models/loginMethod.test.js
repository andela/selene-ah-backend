import { sequelize, dataTypes } from 'sequelize-test-helpers';
import { expect } from 'chai';
import LoginMethodModel from '../../server/models/loginMethod';
import User from '../../server/models/user';


describe('LoginMethod', () => {
  const LoginMethod = LoginMethodModel(sequelize, dataTypes);
  const instanceOfLoginMethod = new LoginMethod();

  it('should have a model named LoginMethod', () => {
    expect(LoginMethod.modelName).to.equal('LoginMethod');
  });

  context('properties test', () => {
    it('should have a property authMethodUsed', () => {
      expect(instanceOfLoginMethod).to.have.property('authMethodUsed');
    });
  });

  context('assocation test', () => {
    before(() => {
      LoginMethod.associate({ User });
    });

    it('should have a belongsTo relationship with User', () => {
      expect(LoginMethod.belongsTo.calledWith(User)).to.equal(true);
    });
  });
});