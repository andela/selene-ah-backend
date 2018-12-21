/**
 *
 * Represent the Article Tag model
 * @param {object} sequelize
 * @param {object} DataTypes The datatype
 * @returns {object} - Tags
 */
export default (sequelize, DataTypes) => {
  const Tag = sequelize.define('Tag', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    tag: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });
  Tag.associate = (models) => {
    Tag.belongsToMany(models.Article, {
      foreignKey: 'tagId',
      as: 'articles',
      through: 'ArticleTag'
    });
  };
  return Tag;
};
