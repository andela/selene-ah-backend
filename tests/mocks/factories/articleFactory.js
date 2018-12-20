import { Factory } from 'rosie';
import faker from 'faker';

const ArticleFactory = new Factory()
    .attrs({
      id: faker.random.uuid,
      title: faker.lorem.words(8),
      body: faker.lorem.words(200),
      categoryId: faker.random.uuid,
      published: faker.random.boolean,
      createdAt: faker.date.recent,
      updatedAt: faker.date.recent
    });

export default ArticleFactory;
