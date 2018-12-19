import { expect } from 'chai';
import { sequelize, dataTypes } from 'sequelize-test-helpers';
import User from '../../server/models/user';
import RoleModel from '../../server/models/role';

describe('Role Model', () => {
  const Role = RoleModel(sequelize, dataTypes);
  const roleObject = new Role();

  context('Check if the Role model exists', () => {
    it('should have model valid model name (Role) ', () => {
      expect(Role.modelName).to.equal('Role');
    });
  });

  context('Check the properties of the Role Model', () => {
    it('The User model should have the property "id"', () => {
      expect(roleObject).to.have.property('id');
    });

    it('The User model should have the property "type"', () => {
      expect(roleObject).to.have.property('type');
    });
  });

  context('Check the Role Model associations', () => {
    before(() => {
      Role.associate({
        User
      });
    });
    context('Check the uniqueness of emails and usernames', () => {
      it('should have a one-to-many association with the Articles Model',
      () => {
        expect(Role.hasMany.calledWith(User)).to.equal(true);
      });
    });
  });
});
