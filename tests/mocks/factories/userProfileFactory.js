import { Factory } from 'rosie';
import faker from 'faker';

const userProfileFactory = new Factory()
  .attr({
    id: faker.random.uuid,
    bio: faker.lorem.bio,
  });


export default userProfileFactory;
