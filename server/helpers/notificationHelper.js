import models from '../models';
import notification from '../config/notification';

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
        where: { emailNotification: 1, userId: userId },
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

    if(options.authorId) {
      const dbResult = await User.findByPk(options.authorId);
      authorName = `${dbResult.dataValues.firstName} 
                    ${dbResult.dataValues.lastName}`;
    }

    if(options.articleSlug) {
      const dbResult = await Article.findOne({
        where: { slug: options.articleSlug }
      });
      articleTitle = `${dbResult.dataValues.title}`;
    }
    switch (type) {
      case 'article':
        data = {
          action: notification.publishArticle,
          message: `${authorName} just pulished a new article 🚀 `,
          link: options.articleSlug ? options.articleSlug : null,
        };

        emailTemplate = {
          subject: `${authorName} pubished a new article`,
          from: notification.emailAddress,
          text: `${authorName} just pulished a new article 🚀`,
          link: options.articleSlug ? options.articleSlug : null
        };
        break;
      case 'comment':
        data = {
          action: notification.comment,
          message: `${articleTitle} has a new comment 🎉`,
          link: options.articleSlug ? options.articleSlug : null,
        };

        emailTemplate = {
          subject: 'Someone commented on your article',
          from: notification.emailAddress,
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
          from: notification.emailAddress,
          text: `${options.followeeName} just followed you 🎉`
        };
        break;

      default:
        break;
    }

    return [data, emailTemplate];
  }
}

export default NotificationHelper;
