/**
 * @param {object} sequelize
 * @param {object} DataTypes
 * @returns {object} Category
 */
const category = (sequelize, DataTypes) => {
  const Category = sequelize.define('Category', {
    title: DataTypes.STRING,
    validate: {
      isEmpty: {
        msg: 'Empty firstname. The firstname is required.'
      }
    }
  }, {});
  Category.associate = (models) => {
    Category.hasMany(models.Article, {
      foreignKey: 'categoryId',
    });
  };
  return Category;
};

export default category;
