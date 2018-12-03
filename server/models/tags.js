/**
 *
 * Represent the Article Tag model
 * @param {object} sequelize
 * @param {object} DataTypes The datatype
 * @returns {object} - Tags
 */
const tags = (sequelize, DataTypes) => {
  const Tags = sequelize.define('Tags', {
    tag: DataTypes.STRING,
    allowNull: false
  });
  Tags.associate = (models) => {
    Tags.belongsToMany(models.articles, {
      as: 'Articles',
      through: 'ArticleTag',
      foreignKey: 'tagId',
      onDelete: 'Cascade'
    });
  };
  return Tags;
};

export default tags;
