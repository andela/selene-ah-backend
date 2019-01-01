export default (sequelize, DataTypes) => {
  const HighlightedComment = sequelize.define('HighlightedComment', {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    articleId: {
      allowNull: false,
      type: DataTypes.UUID
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {});
  HighlightedComment.associate = models => {
    HighlightedComment.belongsTo(models.Article,{
      foreignKey: 'articleId',
      as: 'highlights',
      onDelete: 'CASCADE',
    });
    HighlightedComment.belongsToMany(models.User,{
      foreignKey: 'highlightedCommentId',
      through: 'UserHighlightedComment',
      as: 'userhighlights',
      onDelete: 'CASCADE',
    });
  };
  return HighlightedComment;
};
