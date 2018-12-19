import faker from 'faker';

const fakeRequest1 = {
  user: {
    displayName: faker.name.findName(),
    id: faker.random.number({ min: 0, max: 30 }),
    token: faker.random.number({ min: 0, max: 30 }),
    isNewUser: false
  },
  params: {
    id: 9272
  },
  body: {
    role: 'admin'
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
