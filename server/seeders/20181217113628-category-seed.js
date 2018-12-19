import { Factory } from 'rosie';
import faker from 'faker';

const RoleFactory = new Factory()
  .attrs({
    id: faker.random.uuid,
    title: faker.name.title,
    updatedAt: faker.date.recent,
    createdAt: faker.date.recent
  });
const categories =
  ['Culture', 'Health', 'Politics', 'Design', 'Technology'].map((category) => {
    return RoleFactory.build({
      title: category
    });
  });
export default {
  up: queryInterface => queryInterface.bulkInsert('Categories', categories),
  down: queryInterface => queryInterface.bulkDelete('Categories', null)
};
