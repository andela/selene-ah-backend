import { Factory } from 'rosie';
import faker from 'faker';

const articlesFactory = new Factory()
  .attrs({
    title: faker.random.words(8),
    categoryId: faker.random.uuid,
    body: faker.random.words(200),
    userId: faker.random.uuid,
    published: faker.random.boolean,
  });


export default articlesFactory;
