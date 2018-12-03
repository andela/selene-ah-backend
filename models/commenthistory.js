/**
 * @description this creates the CommentHistory Model
 * @param {Object} sequelize
 * @param {Object} DataTypes
 * @returns {Object} CommentHistory
 */

const commentHistory = (sequelize, DataTypes) => {
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
          args: true,
          msg: 'The commentId is required. Please supply a valid commentId'
        },
        isInt: {
          args: true,
          msg: 'the commentId must be an Integer'
        }
      }
    },
    comment_history: {
      type: DataTypes.STRING,
      isNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: 'The comment is required. Please supply a valid comment'
        }
      }
    }
  }, { tableName: 'commentHistory' });

  return CommentHistory;
};
export default commentHistory;
