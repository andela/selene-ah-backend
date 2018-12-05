export default (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Empty firstname. The firstname is required.'
        },
        isAlpha: {
          msg: 'Invalid firstname. The firstname can only contain letters.'
        },
      }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isAlpha: {
          msg: 'Invalid Lastname. The Lastname can only contain letters.'
        },
        notEmpty: {
          msg: 'Empty lastname. The Lastname is required.'
        }
      }
    },
    userName: {
      type: DataTypes.STRING,
      unique: {
        msg: 'This userName has been taken.'
      },
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Empty username. The username is required.'
        },
      }
    },
    email: {
      type: DataTypes.STRING,
      unique: {
        msg: 'This email address has been taken.'
      },
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
    },
    verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      validate: {
        isBoolean: {
          args: [true, false],
          msg: 'Invalid value. The value for verified can only be "true" or "false"'
        }
      }
    },
    blocked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      validate: {
        isBoolean: {
          args: [true, false],
          msg: 'Invalid value. The value for blocked can only be "true" or "false"'
        }
      }
    },
    emailNotification: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      unique: {
        msg: 'This username has been taken.'
      },
      validate: {
        isBoolean: {
          args: [true, false],
          msg: 'Invalid value. The value for email notification can only be "true" or "false"'
        }
      }
    }
  });
  User.associate = (models) => {
    User.hasMany(models.Article, {
      foreignKey: 'userId',
      as: 'articles'
    });
    User.hasMany(models.Comment, {
      foreignKey: 'userId',
      as: 'com'
    });

    User.hasMany(models.Follower, {
      foreignKey: 'userId',
      as: 'fol'
    });
    User.hasMany(models.Tag, {
      foreignKey: 'userId',
      as: 'tags'
    });
    User.hasMany(models.ArticleExpression, {
      foreignKey: 'userId',
      as: 'artex'
    });
    User.hasMany(models.CommentExpression, {
      foreignKey: 'userId',
      as: 'comex'
    });
    User.hasOne(models.LoginMethod, {
      foreignKey: 'userId',
      as: 'login'
    });
    User.hasOne(models.Profile, {
      foreignKey: 'userId',
      as: 'profile'
    });

    User.hasMany(models.Bookmark, {
      foreignKey: 'userId',
      as: 'book'
    });

    User.hasMany(models.ReportArticle, {
      foreignKey: 'userId',
      as: 'report'
    });
  };

  return User;
};
