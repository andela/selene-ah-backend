import { Factory } from 'rosie';
import faker from 'faker';

const UserFactory = new Factory()
      .attrs({
        id: faker.random.uuid,
        email: faker.internet.email,
        password: faker.internet.password,
        firstName: faker.name.firstName,
        lastName: faker.name.lastName,
        userName: faker.name.lastName,
        verified: faker.random.boolean,
        blocked: faker.random.boolean,
        emailNotification: faker.random.boolean
      });

export default UserFactory;
