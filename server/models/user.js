/**
 * @description this creates the User Model
 * @param {Object} sequelize
 * @param {Object} DataTypes
 * @return {Object} User
 */
const user = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User', {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
      },
      firstname: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isAlpha: {
            msg: 'Invalid firstname. The firstname can only contain letters.'
          },
          isEmpty: {
            msg: 'Empty firstname. The firstname is required.'
          }
        }
      },
      lastname: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isAlpha: {
            msg: 'Invalid Lastname. The Lastname can only contain letters.'
          },
          isEmpty: {
            msg: 'Empty lastname. The Lastname is required.'
          }
        }
      },
      username: {
        type: DataTypes.STRING,
        unique: {
          msg: 'This username has been taken.'
        },
        validate: {
          isEmpty: {
            msg: 'Empty username. The username is required.'
          },
        },
        allowNull: false
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
      email_notification: {
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
    }, {
      tableName: 'users'
    }
  );

  User.associate = (models) => {
    User.hasMany(models.Articles, {
      foreignKey: 'userId',
      as: 'articles'
    });
    User.hasMany(models.Comment, {
      foreignKey: 'userId',
      as: 'com'
    });

    User.hasMany(models.Followers, {
      foreignKey: 'userId',
      as: 'fol'
    });
    User.hasMany(models.Tags, {
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

    User.hasMany(models.ReportArticles, {
      foreignKey: 'userId',
      as: 'report'
    });
  };
  return User;
};

export default user;
