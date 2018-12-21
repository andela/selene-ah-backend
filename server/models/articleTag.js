/**
 * @param {*} sequelize
 * @param {*} DataTypes
 * @returns {object} - model
 */
export default (sequelize, DataTypes) => {
  const ArticleTag = sequelize.define('ArticleTag', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
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
  return ArticleTag;
};
