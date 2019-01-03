/* eslint-disable no-unused-vars */
import models from '../models';
import pusher from '../services/pusher';
import NotificationHelper from '../helpers/notificationHelper';
import ArticleHelper from '../helpers/articleHelper';
import notification from '../config/notification';
import mailTransport from '../helpers/sendEmail';

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
   * @returns {void} No return
   */
  static async emitPublishArticleNotificaiton(authorId, articleSlug, next) {
    try {
      const options = { authorId, articleSlug };
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

      await Notification.bulkCreate(dbEntryBatch);
      usersForEmailNotification.map(email => {
        mailTransport(email, emailTemplate, emailTemplate.link);
      });
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
   * @returns {void} - No return
   */
  static async emitFollowNotifcation(followee, followeeID, followerID) {
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
      throw error;
    }
  }

  /**
   * @description Emit event when a bookmark I liked is commented on
   * @param {uuid} userId - Our user ID
   * @param {uuid} articleId - Our article ID
   * @returns {void} No return
   */
  static async emitCommentArticleNotification(userId, articleId) {
    const notificationType = notification.comment;
    const recieverIds = await NotificationHelper
                      .getUsersWhoLikedArticle(articleId);
    const usersForEmailNotification = await NotificationHelper
                                     .stripOptedOutUsers(recieverIds);

    const articleSlug = await ArticleHelper.getField(articleId, 'slug');

    const [data, emailTemplate] = await NotificationHelper
                         .getNotificationMessage(notificationType, articleSlug);

    const dbEntryBatch = recieverIds.map(receiverId => ({
      isSeen: false,
      notificationType,
      receiverId,
      userId,
    }));

    const batchEvents = recieverIds.map(() => ({
      channel: notification.notificationChannel,
      name: notification.comment,
      data
    }));

    usersForEmailNotification.map(email => {
      mailTransport(email, emailTemplate, emailTemplate.link);
    });

    await Notification.bulkCreate(dbEntryBatch);
    pusher.triggerBatch(batchEvents);
  }
}

export default Notifications;
