import chai, { expect } from 'chai';
import {
  sequelize,
  dataTypes,
} from 'sequelize-test-helpers';
import followers from '../../server/models/followers';
import user from '../../server/models/user';

describe('models/followers', () => {
  const follower = followers(sequelize, dataTypes)
  const followerInstance = new follower();
  it('should have valid model name ', () => {
    expect(follower.modelName).to.equal('Followers')
  })
  it('should have property of followerId', () => {
    expect(followerInstance).to.have.property('followerId');
  })

  context('should have followers associations', () => {
    const User = user 
    before(() => {
      follower.associate({ User })
    })
    it('should defined a belongsTo association with user', () => {
      expect(follower.belongsTo.calledWith(User)).to.equal(true)
    })
    
  })
  
})
