/* Our ArticleExpression Model */
export default (sequelize, DataTypes) => {
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

  // Our LoginMethod assocation
  LoginMethod.associate = (models) => {
    // Users association
    LoginMethod.belongsTo(
      models.Users,
      {
        foreignKey: 'userId'
      }
    );
  };

  return LoginMethod;
};
