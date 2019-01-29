/* eslint-disable max-len */
import models from '../../models';
import notification from '../../config/notification';
import { SUPERADMIN } from '../constants';

const { Follower, User, Article, ArticleVote } = models;
/**
 * @description Our notification helper class
 * @class
 */
class NotificationHelper {
  /**
   * @description Gets the authors followers
   * @param {uuid} authorId
   * @returns {Array} Array of followers
   */
  static async getAuthorsFollowers(authorId) {
    const followers = await Follower.findAll({
      where: { userId: authorId },
      raw: true
    });
    return followers;
  }

  /**
   * @description Strip out users who have opted out of notification
   * @param {Array} userIds
   * @returns {Array} User
   */
  static async stripOptedOutUsers(userIds) {
    const usersForEmailNotification = userIds.map(async userId => {
      await User.findAll({
        where: { emailNotification: true, id: userId.userId },
        raw: true,
        attributes: ['email']
      });
    });

    return usersForEmailNotification;
  }

  /**
   * @description Function gets all the users that liked an article
   * @param {uuid} articleId
   * @returns {Array} Array of users
   */
  static async getUsersWhoLikedArticle(articleId) {
    const users = await ArticleVote.findAll({
      where: { articleId },
      attributes: ['userId'],
      raw: true
    });

    return users;
  }

  /**
   * @description Gets all admin users from the database
   * @returns {object} Admin object
   */
  static async getAdmins() {
    const dbResponse =  await User.findAll({
      where: { role: SUPERADMIN },
      raw: true,
      attributes: ['firstName', 'lastName', 'id']
    });

    return dbResponse;
  }

  /**
   * @description Gets the notifcation for a message
   * @param {string} type - Type of notification
   * @param {object} options - Our authors ID
   * @param {string} articleSlug - The article slug
   * @returns {string} Message
   */
  static async getNotificationMessage(type, options) {
    let data;
    let emailTemplate;
    let authorName;
    let articleTitle;
    const emailAddress = notification.emailAddress;

    if(options.userId) {
      const id = options.userId;
      const dbResult = await User.findByPk(id);
      authorName = `${dbResult.dataValues.firstName} ${dbResult.dataValues.lastName}`;
    }

    if(options.articleSlug) {
      const dbResult = await Article.findOne({
        where: { slug: options.articleSlug }
      });
      articleTitle = `${dbResult.dataValues.title}`;
    }

    if(options.articleId) {
      const dbResult = await Article.findOne({
        where: { id: options.articleId }
      });
      articleTitle = `${dbResult.dataValues.title}`;
    }
    switch (type) {
      case 'publishArticle':
        data = {
          action: notification.publishArticle,
          message: `${authorName} just pulished a new article 🚀 `,
          link: options.articleSlug ? options.articleSlug : null,
        };

        emailTemplate = {
          subject: `${authorName} pubished a new article`,
          from: emailAddress,
          text: `${authorName} just pulished a new article 🚀`,
          link: options.articleSlug ? options.articleSlug : null
        };
        break;
      case 'commentOnArticle':
        data = {
          action: notification.comment,
          message: `Your article ${articleTitle} has a new comment 🎉`,
          link: options.articleSlug ? options.articleSlug : null,
        };

        emailTemplate = {
          subject: 'Someone commented on your article',
          from: emailAddress,
          text: `${articleTitle} has a new comment 🎉`,
          link: options.articleSlug ? options.articleSlug : null,
        };
        break;

      case 'follower':
        data = {
          action: notification.folllowUser,
          message: `${options.followeeName} just followed you 🎉`
        };

        emailTemplate = {
          subject: 'You have a new follower',
          from: emailAddress,
          text: `${options.followeeName} just followed you 🎉`
        };
        break;
      case 'like':
        data = {
          action: notification.like,
          message: options.likeType == 'article'
                   ? `${options.articleTitle} was just liked`
                   : `Your comment on ${options.articleSlug} was liked`
        };
        break;
      case 'report':
        data = {
          action: notification.report,
          message: `${options.user} reported this article ${options.articleSlug} 🚨`
        };
        break;

      default:
        break;
    }
    return [data, emailTemplate];
  }
}

export default NotificationHelper;
