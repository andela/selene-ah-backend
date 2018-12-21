export default (sequelize, DataTypes) => {
  const Rating = sequelize.define('Rating', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    articleRating: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          msg: 'Empty rating: Sorry! the rating is required.'
        },
      }
    },
    userId: {
      type: DataTypes.UUID,
      validate: {
        notEmpty: {
          msg: 'Empty userId: The userId for the rating is required.'
        },
      }
    },
    articleId: {
      type: DataTypes.UUID,
      validate: {
        notEmpty: {
          msg: 'Empty articleId: The articleId is required.'
        },
      }
    }
  });

  return Rating;
};
