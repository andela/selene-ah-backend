import { expect } from 'chai';
import {
  sequelize,
  dataTypes,
} from 'sequelize-test-helpers';
import followerModel from '../../server/models/follower';
import user from '../../server/models/user';

describe('models/followers', () => {
  const Follower = followerModel(sequelize, dataTypes);
  const followerInstance = new Follower();
  it('should have valid model name ', () => {
    expect(Follower.modelName).to.equal('Follower');
  });
  it('should have property of followerId', () => {
    expect(followerInstance).to.have.property('followerId');
  });

  context('should have followers associations', () => {
    const User = user;
    before(() => {
      Follower.associate({ User });
    });
    it('should defined a belongsTo association with user', () => {
      expect(Follower.belongsTo.calledWith(User)).to.equal(true);
    });
  });
});
