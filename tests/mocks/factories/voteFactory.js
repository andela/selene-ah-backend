import { Factory } from 'rosie';
import faker from 'faker';

const userProfileFactory = new Factory()
  .attrs({
    id: faker.random.uuid,
    vote: 1,
    createdAt: faker.date.recent,
    updatedAt: faker.date.recent
  });


export default userProfileFactory;
