/**
 * @param {object} sequelize
 * @param {object} DataTypes
 * @returns {object} model
 */export default (sequelize, DataTypes) => {
  const Article = sequelize.define('Article', {
    title: DataTypes.STRING,
    body: DataTypes.TEXT,
    published: DataTypes.BOOLEAN
  });
  Article.associate = (models) => {
    Article.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'articles',
    });
    Article.belongsTo(models.Category, {
      foreignKey: 'categoryId',
    });
    Article.belongsToMany(models.Tag, {
      foreignKey: 'articleId',
      as: 'Tags',
      through: 'ArticleTag'
    });
  };
  return Article;
};
