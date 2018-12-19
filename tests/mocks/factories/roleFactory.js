import { Factory } from 'rosie';
import faker from 'faker';

const userProfileFactory = new Factory()
  .attr({
    id: faker.random.uuid,
    type: faker.name.title,
    createdAt: faker.date.recent,
    updatedAt: faker.date.recent
  });


export default userProfileFactory;
