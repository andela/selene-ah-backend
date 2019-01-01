export default (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    firstName: {
      type: DataTypes.STRING,
    },
    lastName: {
      type: DataTypes.STRING,
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
          msg: `Invalid value. The value for verified
          can only be "true" or "false"`
        }
      }
    },
    blocked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      validate: {
        isBoolean: {
          args: [true, false],
          msg: `Invalid value. The value for blocked
          can only be "true" or "false"`
        }
      }
    },
    imageUrl: {
      type: DataTypes.TEXT,
    },
    bio: {
      type: DataTypes.TEXT,
    },
    gender: {
      type: DataTypes.STRING,
    },
    twitterUrl: {
      type: DataTypes.STRING,
    },
    facebookUrl: {
      type: DataTypes.STRING,
    },
    dateOfBirth: {
      type: DataTypes.DATE,
      validate: {
        isDate: {
          msg: 'Error: must be a valid date type',
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
          msg: `Invalid value. The value for email notification
            can only be "true" or "false"`
        }
      }
    }
  });
  User.associate = (models) => {
    User.hasMany(models.Article, {
      foreignKey: 'userId',
      as: 'articles'
    });
    User.hasMany(models.Rating, {
      foreignKey: 'userId',
      as: 'userRating'
    });
    User.hasMany(models.Follower, {
      foreignKey: 'userId',
      as: 'followers'
    });
    User.hasMany(models.Report, {
      foreignKey: 'userId',
      as: 'userReport'
    });
    User.belongsToMany(models.HighlightedComment,{
      foreignKey: 'userId',
      through: 'UserHighlightedComment',
      as: 'UsersHighlights'
    });
  };

  return User;
};
