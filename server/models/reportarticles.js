module.exports = (sequelize, DataTypes) => {
  const ReportArticles = sequelize.define('ReportArticles', {
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
  ReportArticles.associate = (models) => {
    ReportArticles.belongsTo(models.User, {
      foreignKey: 'userId',
    });
    ReportArticles.belongsTo(models.Article, {
      foreignKey: 'articleId',
    });
  };
  return ReportArticles;
};
