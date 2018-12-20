export default (sequelize, DataTypes) => {
  const ReportArticle = sequelize.define('ReportArticle', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    report: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Report cannot be empty',
        }
      }
    },
  });
  ReportArticle.associate = (models) => {
    ReportArticle.belongsTo(models.Article,{
      foreignKey: 'articleId',
      onDelete: 'CASCADE',
      as: 'articleReport'
    });
    ReportArticle.belongsTo(models.User,{
      foreignKey: 'userId',
      onDelete: 'CASCADE',
    });
  };
  return ReportArticle;
};
