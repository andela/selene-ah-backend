/* eslint-disable no-unused-vars */
import models from '../../models';
import pusher from '../../services/pusher';
import NotificationHelper from '../../helpers/notification/notificationHelper';
import ArticleHelper from '../../helpers/article/articleHelper';
import notification from '../../config/notification';
import mailTransport from '../../helpers/sendgrid/sendEmail';
import fakeResponse from '../../../tests/mocks/auth/fakeResponse';
import CommentController from '../comment/commentController';

const { Notification, User } = models;

/**
 * @description Our notification class
 * @class
 */
class Notifications {
  /**
   * @description Handles user opt in and out of notifications
   * @param {object} req
   * @param {object} res
   * @param {function} next
   * @returns {object} Response object
   */
  static async notificationOptInOut(req, res, next) {
    try {
      const userId = req.user.id;
      const notificationStatus = req.user.emailNotification;
      const emailNotification = notificationStatus ? false : true;

      await User.update(
        { emailNotification },
        { where: { userId } }
      );

      return res.status(200).json({
        message: emailNotification ? 'You have successfully opted in'
                                   : 'You have successfully opted out'
      });
    } catch (error) {
      return next(error);
    }
  }
  /**
   * @description Emit event when follower pulishes an article
   * @param {uuid} authorId - Author's ID
   * @param {string} articleSlug - Our article slug
   * @param {function} next - Express next callback fn
   * @returns {void}
   */
  static async emitPublishArticleNotificaiton(authorId, articleSlug, next) {
    try {
      const options = { userId: authorId, articleSlug };
      const notificationType = notification.publishArticle;
      const authorFollowers = await NotificationHelper
                                    .getAuthorsFollowers(authorId);
      if(authorFollowers.length < 1 || authorFollowers == undefined) {
        return;
      }

      const usersForEmailNotification = await NotificationHelper
                                      .stripOptedOutUsers(authorFollowers);
      const [data, emailTemplate] = await NotificationHelper
                  .getNotificationMessage(notificationType, options);

      const batchEvents = authorFollowers.map(() => ({
        channel: notification.notificationChannel,
        name: notification.publishArticle,
        data
      }));

      const dbEntryBatch = authorFollowers.map(follower => ({
        isSeen: false,
        notificationType,
        receiverId: follower.id,
        userId: authorId
      }));

      usersForEmailNotification.map(user => {
        mailTransport(user.email, emailTemplate, emailTemplate.link);
      });

      await Notification.bulkCreate(dbEntryBatch);
      pusher.triggerBatch(batchEvents);
    } catch (error) {
      next(error);
    }
  }

  /**
   * @description Emit event when a user is followed
   * @param {object} followee - The followee details
   * @param {uuid} followeeID - The followee ID
   * @param {uuid} followerID - The followers ID
   * @param {function} next - The followers ID
   * @returns {void}
   */
  static async emitFollowNotifcation(followee, followeeID, followerID, next) {
    try {
      const followeeName = followee.userName;
      const { email } = followee;
      const options = { followeeName };
      const notificationType = notification.folllowUser;
      const [data, emailTemplate] = await NotificationHelper
                  .getNotificationMessage(notificationType, options);
      await Notification.findOrCreate({
        where: { userId: followeeID, receiverId: followerID, notificationType },
        defaults: {
          isSeen: false,
          receiverId: followerID,
          userId: followeeID,
          notificationType
        }
      });

      mailTransport(email, emailTemplate, emailTemplate.link);
      pusher.trigger(notification.notificationChannel,
                    notification.folllowUser,
                    data);
    } catch (error) {
      next(error);
    }
  }

  /**
   * @description Emit event when a bookmark I liked is commented on
   * @param {uuid} userId - Our user ID
   * @param {uuid} articleId - Our article ID
   * @returns {void}
   */
  static async emitCommentArticleNotification(userId, articleId) {
    const notificationType = notification.comment;
    const articleSlug = await ArticleHelper.getField(articleId, 'slug');
    const options = { articleId, articleSlug };
    const recieverIds = await NotificationHelper
                      .getUsersWhoLikedArticle(articleId);
    const usersForEmailNotification = await NotificationHelper
                                     .stripOptedOutUsers(recieverIds);

    const [data, emailTemplate] = await NotificationHelper
                         .getNotificationMessage(notificationType, options);

    const dbEntryBatch = recieverIds.map(receiverId => ({
      isSeen: false,
      notificationType,
      receiverId: receiverId.userId,
      userId,
    }));

    const batchEvents = recieverIds.map(() => ({
      channel: notification.notificationChannel,
      name: notificationType,
      data
    }));

    usersForEmailNotification.map(email => {
      mailTransport(email, emailTemplate, emailTemplate.link);
    });

    await Notification.bulkCreate(dbEntryBatch);
    pusher.triggerBatch(batchEvents);
  }

  /**
   * @description Sends a notification when an article is reported
   * @param {object} user
   * @param {string} articleSlug
   * @returns {void}
   */
  static async emitReportArticleNotification(user, articleSlug) {
    try {
      const notificationType = notification.report;
      const Admins = await NotificationHelper.getAdmins();
      const reporterName = `${user.firstName} ${user.lastName}`;
      const options = {
        user: reporterName,
        articleSlug: articleSlug
      };
      const [data] = await NotificationHelper
                          .getNotificationMessage(notificationType, options);
      const dbEntryBatch = Admins.map((admin) => ({
        isSeen: false,
        notificationType,
        receiverId: admin.id,
        userId: user.id
      }));

      const batchEvents = Admins.map(() => ({
        channel: notification.notificationChannel,
        name: notificationType,
        data
      }));

      await Notification.bulkCreate(dbEntryBatch);
      pusher.triggerBatch(batchEvents);
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description Notification for the like functionality
   * @param {object} user
   * @param {string} type - Comment or Article Type
   * @param {uuid} typeId
   * @param {function} next
   * @returns {void}
   */
  static async emitLikeNotification(user, type, typeId, next) {
    try {
      const notificationType = notification.like;
      const options = {
        likeType: type
      };

      if (type === 'comment') {
        const req = {
          params: {
            id: typeId
          }
        };
        const response = await CommentController
                          .getSingleComment(req, fakeResponse, next);
        options.articleSlug = response.comment.Article.slug;
        options.articleTitle = response.comment.Article.title;

        const [data] = await NotificationHelper
                      .getNotificationMessage(notificationType, options);
        await Notification.findOrCreate({
          where: {
            userId: user.id,
            receiverId: response.comment.author.id,
            notificationType
          },
          defaults: {
            isSeen: false,
            receiverId: response.comment.author.id,
            userId: user.id,
            notificationType
          }
        });
        pusher.trigger(notification.notificationChannel,
                      notificationType,
                      data);
        return;
      }
    } catch (error) {
      next(error);
    }
  }
}

export default Notifications;
