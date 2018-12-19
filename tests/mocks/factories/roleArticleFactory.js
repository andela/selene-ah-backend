import { Factory } from 'rosie';
import faker from 'faker';

const ArticleFactory = new Factory()
.attrs({
  id: faker.random.uuid,
  title: faker.lorem.sentence,
  slug: faker.lorem.slug,
  body: faker.lorem.paragraphs,
  published: faker.random.boolean,
  createdAt: faker.date.recent,
  updatedAt: faker.date.recent
});

export default ArticleFactory;
