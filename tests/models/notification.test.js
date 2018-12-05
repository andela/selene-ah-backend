import sequelizeTestHelper from 'sequelize-test-helpers';
import { expect } from 'chai';
import notificationModel from '../../server/models/notification';
import user from '../../server/models/user';

const {
  sequelize,
  dataTypes,
} = sequelizeTestHelper;

describe('Notification models', () => {
  const Notification = notificationModel(sequelize, dataTypes);
  const newNotification = new Notification();

  context('properties', () => {
    it('shouold have model name property of Notification', () => {
      expect(Notification.modelName).to.equal('Notification');
    });
    it('should have property isSeen', () => {
      expect(newNotification).to.have.property('isSeen');
    });
    it('should have property notificationType', () => {
      expect(newNotification).to.have.property('notificationType');
    });
    it('should have property contentTypeId', () => {
      expect(newNotification).to.have.property('contentTypeId');
    });
    it('should have property contentType', () => {
      expect(newNotification).to.have.property('contentType');
    });
    it('should have property ownerId', () => {
      expect(newNotification).to.have.property('ownerId');
    });
  });
  context('Notification associations', () => {
    const User = user(sequelize, dataTypes);
    before(() => {
      Notification.associate({ User });
    });

    it('should have a belongsTo association with User', () => {
      expect(Notification.belongsTo.calledWith(User)).to.equal(true);
    });
  });
});
