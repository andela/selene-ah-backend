import faker from 'faker';

const fakeRequest1 = {
  user: {
    displayName: faker.name.findName(),
    id: faker.random.number({ min: 0, max: 30 }),
    token: faker.random.number({ min: 0, max: 30 }),
    isNewUser: false
  }
};

const fakeRequest2 = {
  user: {
    displayName: faker.name,
    id: faker.random.number({ min: 0, max: 30 }),
    token: faker.random.number({ min: 0, max: 30 }),
    isNewUser: true
  }
};

export default {
  fakeRequest1,
  fakeRequest2
};
