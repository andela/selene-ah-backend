/**
 * @description this creates the CommentHistory Model
 * @param {Object} sequelize
 * @param {Object} DataTypes
 * @returns {Object} CommentHistory
 */
export default (sequelize, DataTypes) => {
  const CommentHistory = sequelize.define('CommentHistory', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    commentId: {
      type: DataTypes.UUID,
      isNull: false,
      validate: {
        notEmpty: {
          msg: 'The commentId is required. Please supply a valid commentId'
        }
      }
    },
    commentHistory: {
      type: DataTypes.STRING,
      isNull: false,
      validate: {
        notEmpty: {
          msg: 'The comment is required. Please supply a valid comment'
        }
      }
    }
  });

  CommentHistory.associate = (models) => {
    CommentHistory.belongsTo(models.Comment, {
      foreignKey: 'commentId',
      onDelete: 'CASCADE'
    });
  };

  return CommentHistory;
};
