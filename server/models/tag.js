/**
 *
 * Represent the Article Tag model
 * @param {object} sequelize
 * @param {object} DataTypes The datatype
 * @returns {object} - Tags
 */
export default (sequelize, DataTypes) => {
  const Tag = sequelize.define('Tag', {
    tag: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });
  return Tag;
};
