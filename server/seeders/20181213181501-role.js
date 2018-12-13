import {Factory} from 'rosie';
import faker from 'faker';

const RoleFactory = new Factory()
.attrs({
  id: faker.random.uuid,
  type: faker.name.title,
  updatedAt: faker.date.recent,
  createdAt: faker.date.recent
});

const roleObject = ['regular', 'superAdmin'].map((role) => {
  return RoleFactory.build({
    type: role
  });
});

export default {
  up: queryInterface => queryInterface.bulkInsert('Roles', roleObject),
  down: queryInterface => queryInterface.bulkDelete('Roles', null)
};
