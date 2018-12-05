/**
 * @param {*} sequelize
 * @param {*} DataTypes
 *
 * @returns {object} LoginMethod
 */
export default (sequelize, DataTypes) => {
  const LoginMethod = sequelize.define('LoginMethod', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4
    },
    authMethodUsed: {
      type: DataTypes.STRING,
      allowNull: true
    }
  });

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
