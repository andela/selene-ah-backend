import {expect} from 'chai';
import sinon from 'sinon';

import model from '../../server/models';
import createNewSocialMediaUser from
  '../../server/helpers/createNewSocialMediaUser';

const {Profile} = model;

describe('New SocialMedia User Profile', () => {
  afterEach(() => sinon.restore());
  it('should create a new profile', async () => {
    const user = {};
    const created = false;
    const userDetails={};
    const spy = sinon.spy(Profile, 'create');

    await createNewSocialMediaUser(user,created,userDetails);
    expect (spy.called).to.be.equal(false);
  });
});
