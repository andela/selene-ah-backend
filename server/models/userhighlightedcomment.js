export default (sequelize, DataTypes) => {
  const UserHighlightedComment = sequelize.define('UserHighlightedComment', {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    userId: {
      allowNull: false,
      type: DataTypes.UUID,
    },
    highlightedCommentId: {
      allowNull: false,
      type: DataTypes.UUID,
    },
  }, {});
  return UserHighlightedComment;
};
