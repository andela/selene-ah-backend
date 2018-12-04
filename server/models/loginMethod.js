/**
 * @param {*} sequelize
 * @param {*} DataTypes
 *
 * @returns {object} LoginMethod
 */
const loginMethod = (sequelize, DataTypes) => {
  const LoginMethod = sequelize.define(
    'LoginMethod',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUID
      },
      authMethodUsed: {
        type: DataTypes.STRING,
        allowNull: true
      },
      createdAt: {
        type: DataTypes.DATE
      },
      updatedAt: {
        type: DataTypes.DATE
      }
    }
  );

  LoginMethod.associate = (models) => {
    LoginMethod.belongsTo(
      models.User,
      {
        foriegnKey: 'userId'
      }
    );
  };

  return LoginMethod;
};

export default loginMethod;
