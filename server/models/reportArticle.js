export default (sequelize, DataTypes) => {
  const ReportArticle = sequelize.define('ReportArticle', {
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
    ReportArticle.belongsTo(models.User, {
      foreignKey: 'userId',
    });
    ReportArticle.belongsTo(models.Article, {
      foreignKey: 'articleId',
    });
  };
  return ReportArticle;
};
