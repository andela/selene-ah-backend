
const notification = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Notifications', {
      id: {
        allowNull: false,
        type: Sequelize.UUID,
        primaryKey: true,
        default: Sequelize.UUIDV4
      },
      isSeen: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      notificationType: {
        type: Sequelize.STRING,
        allowNull: false
      },
      contentTypeId: {
        type: Sequelize.UUID,
        allowNull: false
      },
      contentType: {
        type: Sequelize.STRING,
        allowNull: false
      },
      userId: {
        type: Sequelize.UUID,
        onDelete: 'CASCADE',
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      ownerId: {
        type: Sequelize.UUID,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: queryInterface => queryInterface.dropTable('Notifications')
};

export default notification;
