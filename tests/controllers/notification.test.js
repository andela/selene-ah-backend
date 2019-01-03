import chai, { expect, should } from 'chai';
import sinon from 'sinon';
import faker from 'faker';
import sinonChai from 'sinon-chai';
import Notifications from '../../server/controllers/NotificationController';
import NotificationHelper from '../../server/helpers/notificationHelper';
import models from '../../server/models';

chai.use(sinonChai);
should();

const authorsId = faker.random.uuid;
const articleSlug = faker.lorem.slug;
const next = sinon.stub();

const { Notification } = models;

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
      sinon.stub(NotificationHelper, 'getAuthorsFollowers').returns([1]);
      await Notifications.emitPublishArticleNotificaiton(authorsId,
                                                        articleSlug,
                                                        next);
      expect(stripOptedOutUsersSpy).to.have.been.called;
    });

    it('should have an array of author followers', async () => {
      const followers = sinon.stub(NotificationHelper, 'getAuthorsFollowers')
                             .returns([1]);
      await Notifications.emitPublishArticleNotificaiton(authorsId,
                                                        articleSlug,
                                                        next);
      expect(followers(2)).to.be.an('Array');
    });

    it('should call bulkCreate fuction', async () => {
      const bulkCreateSpy = sinon.spy(Notification, 'bulkCreate');
      sinon.stub(NotificationHelper, 'getAuthorsFollowers')
           .returns([{ id: 1 }]);
      sinon.stub(NotificationHelper, 'stripOptedOutUsers').returns([1]);
      sinon.stub(NotificationHelper, 'getNotificationMessage')
           .returns([1,{ link: 1 }]);
      await Notifications.emitPublishArticleNotificaiton(authorsId,
                                                        articleSlug,
                                                        next);
      expect(bulkCreateSpy).to.have.been.called;
    });
  });
});
