import { Factory } from 'rosie';
import faker from 'faker';

const articlesFactory = new Factory()
  .attr({
    title: faker.lorem.sentence,
    categoryId: faker.random.uuid,
    body: faker.lorem.sentence,
    userId: faker.random.uuid,
    published: faker.random.boolean,
  });


export default articlesFactory;
