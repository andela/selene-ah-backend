import { Factory } from 'rosie';
import faker from 'faker';

const SocialMediaUserFactory = new Factory()
.attrs({
  id: faker.random.uuid,
  email: faker.internet.email,
  password: faker.internet.password,
  firstName: faker.name.firstName,
  lastName: faker.name.firstName,
  userName: faker.internet.userName,
  verified: faker.random.boolean,
  blocked: faker.random.boolean,
  emailNotification: faker.random.boolean,
  createdAt: faker.date.recent,
  updatedAt: faker.date.recent
});

export default SocialMediaUserFactory;
