/* Our ArticleExpression Model */
export default (sequelize, DataTypes) => {
  const ArticleExpression = sequelize.define(
    'ArticleExpression',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUID
      },
      emotion: {
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

  // Our ArticleExpression assocation
  ArticleExpression.associate = (models) => {
    // Articles association
    ArticleExpression.belongsTo(
      models.Article,
      {
        foriegnKey: 'articleId',
        onDelete: 'CASCADE',
      }
    );

    // Users association
    ArticleExpression.belongsTo(
      models.Users,
      {
        foriegnKey: 'userId',
        onDelete: 'CASCADE'
      }
    );
  };

  return ArticleExpression;
};
