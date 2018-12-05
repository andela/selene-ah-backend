/**
 * @param {object} sequelize
 * @param {object} DataTypes
 * @returns {object} Category
 */
export default (sequelize, DataTypes) => {
  const Category = sequelize.define('Category', {
    title: {
      type: DataTypes.STRING
    }
  });
  Category.associate = (models) => {
    Category.hasMany(models.Article, {
      foreignKey: 'categoryId',
    });
  };
  return Category;
};
