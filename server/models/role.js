export default (sequelize, DataTypes) => {
  const Role = sequelize.define('Role', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    type: {
      type: DataTypes.STRING,
      unique: {
        message: 'the role type must be unique'
      },
      validate: {
        isAlphanumeric: {
          msg: 'The role title must be alphanumeric'
        }
      }
    }
  });

  Role.associate = (models) => {
    Role.hasMany(models.User, {
      foreignKey: 'roleId'
    });
  };

  return Role;
};
