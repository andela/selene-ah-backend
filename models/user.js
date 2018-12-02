
const user = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      default: DataTypes.UUIDV4
    },
    firstname: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isAlpha: {
          msg: 'Invalid firstname. The firstname can only contain letters.'
        }
      }
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isAlpha: {
          msg: 'Invalid firstname. The firstname can only contain letters.'
        }
      }
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: {
          msg: 'Please enter a valid email address. Example: you@gmail.com'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isAlphanumeric: {
          msg: 'Invalid password: Passwords must be alphanumeric.'
        },
        len: {
          args: [8],
          msg: 'Passwords must be more than 8 characters.'
        },
      }
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
  },
  {
    tableName: 'users'
  });

  User.associate = (models) => {
    User.hasMany(models.Articles, {
      foreignKey: 'userId',
      as: 'articles'
    });
    User.hasMany(models.Comments, {
      foreignKey: 'userId',
      as: 'com'
    });
    User.hasMany(models.Expressions, {
      foreignKey: 'userId',
      as: 'exp'
    });
    User.hasMany(models.Followers, {
      foreignKey: 'userId',
      as: 'fol'
    });
    User.hasMany(models.Tags, {
      foreignKey: 'userId',
      as: 'tags'
    });
    User.hasMany(models.CommentHistory, {
      foreignKey: 'userId',
      as: 'comhis'
    });
    User.hasMany(models.ArticleExpressions, {
      foreignKey: 'userId',
      as: 'artex'
    });
    User.hasMany(models.CommentExpressions, {
      foreignKey: 'userId',
      as: 'comex'
    });
    User.hasOne(models.Login, {
      foreignKey: 'userId',
      as: 'login'
    });
    User.hasOne(models.Profile, {
      foreignKey: 'userId',
      as: 'profile'
    });
  };
  return User;
};
export default user;
