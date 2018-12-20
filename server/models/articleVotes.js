export default (sequelize, DataTypes) => {
  const ArticleVote = sequelize.define(
    'ArticleVote',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4
      },
      vote: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      createdAt: {
        type: DataTypes.DATE
      },
      updatedAt: {
        type: DataTypes.DATE
      }
    }
  );

  ArticleVote.associate = (models) => {
    ArticleVote.belongsTo(
      models.Article,
      {
        foreignKey: 'articleId',
        onDelete: 'CASCADE',
      }
    );

    ArticleVote.belongsTo(
      models.User,
      {
        foreignKey: 'userId',
        onDelete: 'CASCADE'
      }
    );
  };

  return ArticleVote;
};
