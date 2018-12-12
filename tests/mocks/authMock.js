import faker from 'faker';

export default () => {
  const profile = {
    name: {
      givenName: faker.name.firstName(),
      familyName: faker.name.lastName(),

    },
    id: '4b2a1e1d-7e9f-406a-b22a-950a101d7675',
    emails: [{
      value: `f${faker.name.firstName()}@gmail.com`
    }],
  };
  const twitterProfile = {
    _json: {
        firstname: ' ',
        lastname: ' ',
        screen_name: faker.name.lastName(),
        id: '4b2a8e1d-7e9f-406a-b22a-950a101d7675',
        email: `f${faker.name.firstName()}@gmail.com`
    }
  };
  const user = {
    isNewUser: true,
    token: faker.random.number({
      min: 0,
      max: 40
    }),
    id: faker.random.uuid(),
  };
  const oldUser = {
    isNewUser: false,
    token: faker.random.number({
      min: 0,
      max: 40
    }),
    id: profile.id,
  };
  const loginMessage = {
    message: 'login successfull',
    token: faker.random.number({
      min: 0,
      max: 40
    }),
  };
  const signupMessage = {
    message: 'registration successfull',
    token: faker.random.number({
      min: 0,
      max: 40
    }),
  };
  const tokens = {
    accessToken: faker.random.number({
      min: 0,
      max: 40
    }),
    refreshToken: null,
  };
  return {
    profile,
    tokens,
    user,
    loginMessage,
    signupMessage,
    oldUser,
    twitterProfile,
  };
};
