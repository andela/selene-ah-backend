import { expect } from 'chai';
import {
  sequelize,
  dataTypes,
} from 'sequelize-test-helpers';
import followerModel from '../../server/models/follower';
import user from '../../server/models/user';

describe('models/followers', () => {
  const follower = followerModel(sequelize, dataTypes);
  const followerInstance = new follower();
  it('should have valid model name ', () => {
    expect(follower.modelName).to.equal('Follower');
  });
  it('should have property of followerId', () => {
    expect(followerInstance).to.have.property('followerId');
  });

  context('should have followers associations', () => {
    const User = user;
    before(() => {
      follower.associate({ User });
    });
    it('should defined a belongsTo association with user', () => {
      expect(follower.belongsTo.calledWith(User)).to.equal(true);
    });
  });
});
