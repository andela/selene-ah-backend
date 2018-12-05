/**
 * @param {*} sequelize
 * @param {*} DataTypes
 * @returns {object} - model
 */
export default (sequelize, DataTypes) => {
  const ArticleTag = sequelize.define('ArticleTag', {
    articleId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false
    },
    tagId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false
    }
  });
  ArticleTag.associate = (models) => {
    ArticleTag.belongsTo(models.Article, {
      foreignKey: 'articleId'
    });
    ArticleTag.belongsTo(models.Tag, {
      foreignKey: 'tagId'
    });
  };
  return ArticleTag;
};
