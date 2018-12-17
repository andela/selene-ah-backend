import chaiHttp from 'chai-http';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import server from '../../server/index';
import signupFactory from '../mocks/factories/userFactory';
import articlesFactory from '../mocks/factories/articlesFactory';
import articlesController from '../../server/controllers/articlesController';
import models from '../../server/models';
import getRandomCategory from '../../server/helpers/checkCategory';

chai.should();
chai.use(chaiHttp);
chai.use(sinonChai);

const { Article } = models;

let userId;
let catId;
let token;
let articleId;
const fakeId = '14dd13b2-981c-490d-879c-71edaf5d674d';


describe('API endpoint for create articles', () => {
  const user = signupFactory.build({
    email: 'etta@gmail.com',
    password: 'password123*'
  });

  before(async () => {
    catId = await getRandomCategory();
    const res = await chai.request(server)
      .post('/api/v1/auth/signup')
      .send(user);
    token = res.body.token;
    userId = res.body.user.id;
  });

  it('Should return 404 if article not found', async () => {
    const res = await chai.request(server)
      .get('/api/v1/articles')
      .set('Authorization', `Bearer ${token}`)
      .send();
    expect(res).to.have.status(404);
  });

  it('Should create an article', async () => {
    const articlesData = articlesFactory.build({
      categoryId: catId,
      body: 'Test for Body',
      title: 'test title',
      userId,
      published: true,
    });
    const res = await chai.request(server)
      .post('/api/v1/article/')
      .set('Authorization', `Bearer ${token}`)
      .send(articlesData);
    expect(res).to.have.status(201);
    articleId = res.body.article.id;
    expect(res.body).to.be.an('Object');
    expect(res.body.message).to.be.equals('Article created successfully');
  });

  it('Should return error if title field is empty or null', async () => {
    const articlesData = articlesFactory.build({
      categoryId: catId,
      body: 'Test for Body',
      title: '    ',
      userId,
      published: true,
    });
    const res = await chai.request(server)
      .post('/api/v1/article/')
      .set('Authorization', `Bearer ${token}`)
      .send(articlesData);
    expect(res).to.have.status(400);
    expect(res.body.message).to.be.equals('Title is required');
  });

  it('Should return error if body field is empty or null', async () => {
    const articlesData = articlesFactory.build({
      categoryId: catId,
      body: '   ',
      title: '  Test Title',
      userId,
      published: true,
    });
    const res = await chai.request(server)
      .post('/api/v1/article/')
      .set('Authorization', `Bearer ${token}`)
      .send(articlesData);
    expect(res).to.have.status(400);
    expect(res.body.message).to.be.equals('Body is required');
  });

  it('Should return error if categoryId field is empty or null', async () => {
    const articlesData = articlesFactory.build({
      categoryId: '   ',
      body: 'Test for Body',
      title: 'Test Title',
      userId,
      published: true,
    });
    const res = await chai.request(server)
      .post('/api/v1/article/')
      .set('Authorization', `Bearer ${token}`)
      .send(articlesData);
    expect(res).to.have.status(400);
    expect(res.body.message).to.be.equals('categoryId is required');
  });

  it('Should return 400 error for category does not exist', async () => {
    const articlesData = articlesFactory.build({
      categoryId: fakeId,
      body: 'Test for Body',
      title: 'test title',
      userId,
      published: true,
    });
    const res = await chai.request(server)
      .post('/api/v1/article/')
      .set('Authorization', `Bearer ${token}`)
      .send(articlesData);
    expect(res).to.have.status(400);
  });

  it('Should return 200 get an article', async () => {
    const res = await chai.request(server)
      .get(`/api/v1/article/${articleId}`)
      .send();
    expect(res).to.have.status(200);
  });


  it('Should return 200 for get an author articles', async () => {
    const res = await chai.request(server)
      .get(`/api/v1/article/author/${userId}`)
      .set('Authorization', `Bearer ${token}`)
      .send();
    expect(res).to.have.status(200);
  });

  it('Should return 404 for get an author articles', async () => {
    const res = await chai.request(server)
      .get(`/api/v1/article/author/${fakeId}`)
      .set('Authorization', `Bearer ${token}`)
      .send();
    expect(res).to.have.status(404);
  });

  it('Should return 404 on article not found', async () => {
    const res = await chai.request(server)
      .get(`/api/v1/article/${fakeId}`)
      .set('Authorization', `Bearer ${token}`)
      .send();
    expect(res).to.have.status(404);
  });



  it('Should return 200 on get all articles', async () => {
    const res = await chai.request(server)
      .get('/api/v1/articles')
      .set('Authorization', `Bearer ${token}`)
      .send();
    expect(res).to.have.status(200);
  });

  it('Should return 200 on update an article', async () => {
    const articlesData = articlesFactory.build({
      body: 'Test for Body',
      title: 'test title',
    });

    const res = await chai.request(server)
      .put(`/api/v1/article/${articleId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(articlesData);
    expect(res).to.have.status(200);
  });


  it('Should return article not found', async () => {
    const articlesData = articlesFactory.build({
      userId,
      body: 'Test for Body',
      title: 'test title',
    });

    const res = await chai.request(server)
      .put(`/api/v1/article/${fakeId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(articlesData);
    expect(res).to.have.status(404);
  });

  it('Should delete an article', async () => {
    const res = await chai.request(server)
      .delete(`/api/v1/article/${articleId}`)
      .set('Authorization', `Bearer ${token}`)
      .send();
    expect(res).to.have.status(200);
  });

  it('Should return 404 error', async () => {
    const res = await chai.request(server)
      .delete(`/api/v1/article/${fakeId}`)
      .set('Authorization', `Bearer ${token}`)
      .send();
    expect(res).to.have.status(404);
  });

  it('should fake error for get all articles', async () => {
    const req = {
      body: {
        id: 1
      }
    };

    const res = {};
    const next = sinon.stub();

    sinon.stub(Article, 'findOne').throws();

    await articlesController.getAllArticles(req, res, next);

    expect(next.calledOnce).to.be.true;
    sinon.restore();
  });


  it('should fake error for update article', async () => {
    const req = {
      params: {
        id: 1
      },
      body: {
        title: 'hfhfhff'
      }
    };

    const res = {};
    const next = sinon.stub();

    sinon.stub(Article, 'findOne').throws();

    await articlesController.updateArticle(req, res, next);

    expect(next.calledOnce).to.be.true;
    sinon.restore();
  });

  it('should fake error for getOneArticle', async () => {
    const req = {
      params: {
        id: 1
      }
    };

    const res = {};
    const next = sinon.stub();

    sinon.stub(Article, 'findOne').throws();

    await articlesController.getOneArticle(req, res, next);

    expect(next.called).to.be.true;
    sinon.restore();
  });

  it('should fake error for deleteArticle', async () => {
    const req = {
      params: {
        id: 1
      }
    };

    const res = {};
    const next = sinon.stub();

    sinon.stub(Article, 'findOne').throws();

    await articlesController.deleteArticle(req, res, next);

    expect(next.called).to.be.true;
    sinon.restore();
  });

  it('should fake error for get author article', async () => {
    const req = {
      params: {
        id: 1
      }
    };

    const res = {};
    const next = sinon.stub();

    sinon.stub(Article, 'findOne').throws();

    await articlesController.getAuthorsArticles(req, res, next);

    expect(next.called).to.be.true;
    sinon.restore();
  });
});
