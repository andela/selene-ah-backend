/**
 * @param {object} sequelize
 * @param {object} DataTypes
 * @returns {object} model
 */export default (sequelize, DataTypes) => {
  const Article = sequelize.define('Article', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    title: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'Title cannot be empty',
        },
        len: {
          args: [5, 200],
          msg: 'Title must be between 5 and 200 characters'
        }
      }
    },
    body: {
      type: DataTypes.TEXT,
      validate: {
        notEmpty: {
          msg: 'Body cannot be empty'
        }
      }
    },
    readingStat: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    slug: DataTypes.TEXT,
    published: DataTypes.BOOLEAN,
    readTime: DataTypes.INTEGER,
  });
  Article.associate = (models) => {
    Article.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'author',
    });
    Article.hasMany(models.Rating, {
      foreignKey: 'articleId',
      as: 'articleRating'
    });
    Article.belongsTo(models.Category, {
      foreignKey: 'categoryId',
      as: 'category'
    });
    Article.belongsToMany(models.Tag, {
      foreignKey: 'articleId',
      as: 'Tags',
      through: 'ArticleTag'
    });
    Article.hasMany(models.ReportArticle, {
      foreignKey: 'articleId',
      as: 'articleReport'
    });
  };
  return Article;
};
