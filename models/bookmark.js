/**
* @param {object} sequelize
* @param {object} DataTypes
* @returns {object} - Bookmark model
*/
export default (sequelize, DataTypes) => {
  const Bookmark = sequelize.define('Bookmark', {
    id: {
      allowNull: false,
      type: DataTypes.UUID,
      primaryKey: true,
      default: DataTypes.UUIDV4
    }
  });
  Bookmark.associate = (models) => {
    Bookmark.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
    Bookmark.belongsTo(models.Article, {
      foreignKey: 'articleId',
      onDelete: 'CASCADE'
    });
  };
  return Bookmark;
};
