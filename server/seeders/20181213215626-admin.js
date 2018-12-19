import UserFactory from '../../tests/mocks/factories/userFactory';
import passwordHash from '../helpers/passwordHash';

const hashed = passwordHash.hashPassword('password123!');

const user = UserFactory.build({
  email: 'admin@admin.com',
  password: hashed,
  role: 'superAdmin'
});

export default {
  up: queryInterface => queryInterface.bulkInsert('Users', [ user ]),
  down: queryInterface => queryInterface.bulkDelete('Users', null, {})
};
