const comment = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      default: DataTypes.UUIDV4
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Invalid comment. comment field is required.'
        }
      }
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      default: DataTypes.now
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      default: DataTypes.now
    }
  });
  Comment.associate = (models) => {
    Comment.belongsTo(models.User, {
      foreignKey: 'userId',
    });
    Comment.belongsTo(models.Article, {
      foreignKey: 'articleId',
    });
  };
  return Comment;
};

export default comment;
