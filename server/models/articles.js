/* eslint-disable valid-jsdoc */
/**
 *
 * @param {object} sequelize
 * @param {object} DataTypes
 * @returns {object}
 */
const articles = (sequelize, DataTypes) => {
  const Articles = sequelize.define('Articles', {
    title: DataTypes.STRING,
    body: DataTypes.TEXT,
    published: DataTypes.BOOLEAN
  });
  Articles.associate = (models) => {
    Articles.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'articles',
    });

    Articles.belongsToMany(models.Tags, {
      foreignKey: 'articleId',
      as: 'Tags',
      through: 'ArticleTag'
    });
  };
  return Articles;
};

export default articles;
