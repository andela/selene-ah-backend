 /**
 * @param {object} sequelize
 * @param {object} DataTypes
 * @returns {object} Comment model
 */
export default (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'comment cannot be empty',
        },
        len: {
          args: [2, 150],
          msg: 'comment must be between 2 and 150 characters'
        }
      }
    }
  });
  Comment.associate = (models) => {
    Comment.belongsTo(models.Article, {
      foreignKey: 'articleId',
      onDelete: 'CASCADE'
    });
    Comment.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'author',
      onDelete: 'CASCADE',
    });
    Comment.hasMany(models.CommentHistory, {
      foreignKey: 'commentId',
    });
    Comment.hasMany(models.CommentReaction, {
      foreignKey: 'commentId',
      as: 'commentReaction',
      onDelete: 'CASCADE'
    });
  };
  return Comment;
};
