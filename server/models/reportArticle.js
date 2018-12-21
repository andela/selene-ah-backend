export default (sequelize, DataTypes) => {
  const Report = sequelize.define('Report', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    content: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Report cannot be empty',
        }
      }
    },
  });
  Report.associate = (models) => {
    Report.belongsTo(models.Article,{
      foreignKey: 'articleId',
      onDelete: 'CASCADE',
      as: 'articleReport'
    });
    Report.belongsTo(models.User,{
      foreignKey: 'userId',
      onDelete: 'CASCADE',
    });
  };
  return Report;
};
