/**
 * Represent notifications model
 * @param {object} sequelize
 * @param {object} DataTypes
 * @returns {object} - notification
 */
const notification = (sequelize, DataTypes) => {
  const Notification = sequelize.define('Notification', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    isSeen: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    notificationType: {
      type: DataTypes.STRING,
      allowNull: false
    },
    receiverId: {
      type: DataTypes.UUID,
      allowNull: false
    }
  });
  Notification.associate = (models) => {
    Notification.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
  };
  return Notification;
};

export default notification;
