/* eslint-disable max-len */
import chai, { expect, should } from 'chai';
import sinon from 'sinon';
import faker from 'faker';
import sinonChai from 'sinon-chai';
import Notifications
from '../../server/controllers/notification/NotificationController';
import NotificationHelper
from '../../server/helpers/notification/notificationHelper';
import models from '../../server/models';
import fakeResponse from '../mocks/auth/fakeResponse';
import pusher from '../../server/services/pusher';
import ArticleHelper from '../../server/helpers/article/articleHelper';
import notification from '../../server/config/notification';

chai.use(sinonChai);
should();

const authorsId = faker.random.uuid();
const articleSlug = faker.lorem.slug();
const next = sinon.stub();


const { Notification, User, Article } = models;

describe('#Notifications', () => {
  afterEach(() => sinon.restore());
  context('function test', () => {
    it('should have a function called emitPublishArticleNotificaiton', () => {
      expect(Notifications.emitPublishArticleNotificaiton).to.exist;
    });

    it('should be a function emitPublishArticleNotificaiton', () => {
      expect(Notifications.emitPublishArticleNotificaiton).to.be.a('function');
    });

    it('should have a function called emitFollowNotifcation', () => {
      expect(Notifications.emitFollowNotifcation).to.exist;
    });

    it('should be a function emitFollowNotifcation', () => {
      expect(Notifications.emitFollowNotifcation).to.be.a('function');
    });

    it('should have a function called emitCommentArticleNotification', () => {
      expect(Notifications.emitCommentArticleNotification).to.exist;
    });

    it('should be a function emitCommentArticleNotification', () => {
      expect(Notifications.emitCommentArticleNotification).to.be.a('function');
    });
  });

  context('emitPublishArticleNotificaiton Unit Test', () => {
    it('should call getAuthorsFollowers', async () => {
      const getAuthorsFollowersSpy = sinon.spy(NotificationHelper,
                                              'getAuthorsFollowers');
      await Notifications.emitPublishArticleNotificaiton(authorsId,
                                                        articleSlug,
                                                        next);
      getAuthorsFollowersSpy.should.have.been.called;
    });

    it('should call stripOptedOutUsers', async () => {
      const stripOptedOutUsersSpy = sinon.stub(NotificationHelper,
                                              'stripOptedOutUsers');
      sinon.stub(NotificationHelper, 'getAuthorsFollowers')
                            .returns([{id: faker.random.uuid()}]);
      await Notifications.emitPublishArticleNotificaiton(authorsId,
                                                        articleSlug,
                                                        next);
      expect(stripOptedOutUsersSpy).to.have.been.called;
    });

    it('should have an array of author followers', async () => {
      const followers = sinon.stub(NotificationHelper, 'getAuthorsFollowers')
                             .returns([{id:faker.random.uuid()}]);
      const admins = await NotificationHelper.getAdmins();
      const id = admins[0].id;
      await Notifications.emitPublishArticleNotificaiton(id,
                                                        articleSlug,
                                                        next);
      expect(followers(2)).to.be.an('Array');
    });

    it('should call bulkCreate fuction', async () => {
      const bulkCreateSpy = sinon.spy(Notification, 'bulkCreate');
      const admins = await NotificationHelper.getAdmins();
      const id = admins[0].id;
      sinon.stub(NotificationHelper, 'getAuthorsFollowers')
           .returns([{ id: faker.random.uuid() }]);
      sinon.stub(NotificationHelper, 'stripOptedOutUsers')
           .returns([{email: faker.internet.email()}]);
      sinon.stub(NotificationHelper, 'getNotificationMessage')
           .returns([true,{ link: articleSlug }]);
      await Notifications.emitPublishArticleNotificaiton(id,
                                                        articleSlug,
                                                        next);
      expect(bulkCreateSpy).to.have.been.called;
    });

    it('should call pusher fuction', async () => {
      const pusherSpy = sinon.spy(pusher, 'triggerBatch');
      const admins = await NotificationHelper.getAdmins();
      const id = admins[0].id;
      sinon.stub(NotificationHelper, 'getAuthorsFollowers')
           .returns([{ id: faker.random.uuid() }]);
      sinon.stub(NotificationHelper, 'stripOptedOutUsers')
           .returns([{email: faker.internet.email()}]);
      sinon.stub(NotificationHelper, 'getNotificationMessage')
           .returns([true,{ link: articleSlug }]);
      await Notifications.emitPublishArticleNotificaiton(id,
                                                        articleSlug,
                                                        next);
      expect(pusherSpy).to.have.been.called;
    });
  });

  context('Notification optInOut Tests', () => {
    it('should update a user details', async () => {
      const req = { user: { id: faker.random.uuid(), emailNotification: true } };
      const updateStub = sinon.stub(User, 'update');
      await Notifications.notificationOptInOut(req, fakeResponse, next);
      updateStub.should.have.been.called;
    });

    it('should test the if blocks', async () => {
      const req = { user: { id: faker.random.uuid(), emailNotification: false } };
      const updateStub = sinon.stub(User, 'update');
      await Notifications.notificationOptInOut(req, fakeResponse, next);
      updateStub.should.have.been.called;
    });

    it('should reach the catch block for undefined errors',async () => {
      const req = { user: { id: faker.random.uuid(), emailNotification: false } };
      sinon.stub(User, 'update').throws();
      await Notifications.notificationOptInOut(req, fakeResponse, next);
      next.should.have.been.called;
    });
  });

  context('emitCommentArticleNotification Test', () => {
    it('should call bulkCreate fuction', async () => {
      const bulkCreateSpy = sinon.spy(Notification, 'bulkCreate');
      const admins = await NotificationHelper.getAdmins();
      const id = admins[0].id;
      sinon.stub(NotificationHelper, 'getAuthorsFollowers')
           .returns([{ id: faker.random.uuid() }]);
      sinon.stub(NotificationHelper, 'stripOptedOutUsers')
           .returns([{email: faker.internet.email()}]);
      sinon.stub(NotificationHelper, 'getNotificationMessage')
           .returns([true,{ link: articleSlug }]);
      sinon.stub(NotificationHelper, 'getUsersWhoLikedArticle')
           .returns([{ userId: faker.random.uuid() }]);
      sinon.stub(ArticleHelper, 'getField')
            .returns([articleSlug]);
      await Notifications.emitCommentArticleNotification(id,
                                                        articleSlug);
      expect(bulkCreateSpy).to.have.been.called;
    });
  });

  context('emitFollowNotifcation Test', () => {
    it('should reach the catch block for undefined errors',async () => {
      const admins = await NotificationHelper.getAdmins();
      const id = admins[0].id;
      sinon.stub(NotificationHelper, 'getNotificationMessage').throws();
      await Notifications.emitFollowNotifcation(authorsId, id, articleSlug, next);
      next.should.have.been.called;
    });
  });

  context('emitLikeNotification Test', () => {
    it('should reach the catch block for undefined errors',async () => {
      sinon.stub(NotificationHelper, 'getNotificationMessage').throws();
      await Notifications.emitLikeNotification(authorsId, 'comment', articleSlug, next);
      next.should.have.been.called;
    });

    it('should reach the else block',async () => {
      sinon.stub(NotificationHelper, 'getNotificationMessage').throws();
      await Notifications.emitLikeNotification(authorsId, 'hfue', articleSlug, next);
      next.should.have.been.called;
    });
  });

  context('notificationHelper test', () => {
    it('should hit the article switch case', async () => {
      sinon.stub(Article, 'findOne').returns({dataValues: {title: 'jdah'}});
      await NotificationHelper.getNotificationMessage(notification.publishArticle, {articleId: faker.random.uuid(), articleSlug});
    });

    it('should hit the article switch case', async () => {
      sinon.stub(Article, 'findOne').returns({dataValues: {title: 'jdah'}});
      await NotificationHelper.getNotificationMessage(notification.publishArticle, {articleId: faker.random.uuid()});
    });

    it('should hit the comment switch case', async () => {
      sinon.stub(Article, 'findOne').returns({dataValues: {title: 'jdah'}});
      await NotificationHelper.getNotificationMessage(notification.comment, {articleSlug});
    });

    it('should hit the like switch case', async () => {
      await NotificationHelper.getNotificationMessage(notification.like, {likeType: 'article'});
    });

    it('should hit the like switch case', async () => {
      await NotificationHelper.getNotificationMessage(notification.like, {likeType: 'comment'});
    });

    it('should hit the default switch case', async () => {
      await NotificationHelper.getNotificationMessage('default', {});
    });
  });
});
