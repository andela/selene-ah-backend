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
  return Tags;
};

export default tags;
