import chaiHttp from 'chai-http';
import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import sinon from 'sinon';
import server from '../../server/index';
import signupFactory from '../mocks/factories/userFactory';
import articlesFactory from '../mocks/factories/articlesFactory';
import getRandomCategory from '../../server/helpers/checkCategory';
import JWTHelper from '../../server/helpers/JWTHelper';

import ArticleReporter
 from '../../server/controllers/reportArticleController';
 import models from '../../server/models';

chai.should();
chai.use(chaiHttp);
chai.use(sinonChai);

let userId;
let catId;
let token;
let articleId;
let adminToken;
const { generateToken } = JWTHelper;
const { getReportsOnAnArticle } = ArticleReporter;
const { Report } = models;

describe('API endpoint for create articles', () => {
    const user = signupFactory.build({
      email: 'etta@outlook.com',
      password: 'password123*'
    });
    const adminDetails = {
        email: 'admin@admin.com',
        password: 'password123!'
    };
    const user2 = signupFactory.build({});
    before(async () => {
      catId = await getRandomCategory();
      const res = await chai.request(server)
        .post('/api/v1/auth/signup')
        .send(user);
      token = res.body.token;
      userId = res.body.user.id;
      const admin = await chai.request(server)
        .post('/api/v1/auth/signin')
        .send(adminDetails);
        adminToken = admin.body.token;
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
    it('should create the report for an article', async () => {
        const theReport = {
            content: 'buhari cant solve your problem'
        };
        const res = await chai.request(server)
            .post(`/api/v1/reportarticle/${articleId}`)
            .set('Authorization', `Bearer ${token}`)
            .send(theReport);
            expect(res).to.have.status(201);
            expect(res.body).to.be.an('Object');
            expect(res.body.message).to.be
            .equals('report successfully created');
            expect(res.body).to.haveOwnProperty('content');
    });

    it('should not a create report for an article with invalid input',
     async () => {
        const theReport = {
            content: 'buhari'
        };
        const res = await chai.request(server)
            .post(`/api/v1/reportarticle/${articleId}`)
            .set('Authorization', `Bearer ${token}`)
            .send(theReport);
            expect(res).to.have.status(400);
            expect(res.body).to.be.an('Object');
            expect(res.body.message).to.
            be.equals('report cant be less than 15 characters');
    });

    it('should not a create report for an article that doesnt exists',
     async () => {
        const theReport = {
            content: 'buhari the nimagariaid'
        };
        const res = await chai.request(server)
            .post(`/api/v1/reportarticle/${userId}`)
            .set('Authorization', `Bearer ${token}`)
            .send(theReport);
            expect(res).to.have.status(404);
            expect(res.body).to.be.an('Object');
            expect(res.body.message).to.
            be.equals('article not found');
    });

    it('should not a create report for an article that doesnt exists',
     async () => {
        const theReport = {
            content: 'buhari the nimagariaid'
        };
        const newToken = generateToken(user2, '1d');
        const res = await chai.request(server)
            .post(`/api/v1/reportarticle/${articleId}`)
            .set('Authorization', `Bearer ${newToken}`)
            .send(theReport);
            expect(res).to.have.status(500);
            expect(res.body).to.be.an('Object');
    });

    it('should get all available reports on the platform',
     async () => {
        const res = await chai.request(server)
            .get('/api/v1/allreports/')
            .set('Authorization', `Bearer ${adminToken}`);
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('Object');
            expect(res.body).to.haveOwnProperty('allReports');
    });

    it('should get all reports on a specific article',
     async () => {
        const res = await chai.request(server)
            .get(`/api/v1//articlereports/${articleId}`)
            .set('Authorization', `Bearer ${adminToken}`);
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('Object');
            expect(res.body.message).to.be
            .equals('All reports successfully returned');
            expect(res.body).to.haveOwnProperty('allReports');
    });

    it(`should return an appropriate message if no reports is associated
    with the given article`,
     async () => {
        const res = await chai.request(server)
            .get(`/api/v1//articlereports/${userId}`)
            .set('Authorization', `Bearer ${adminToken}`);
            expect(res).to.have.status(404);
            expect(res.body).to.be.an('Object');
    });

    it('###Faker Test for  getReportsOnAnArticle', async () => {
        const req = {
          params: 'jdjdnjndjjdnjd'
        };
        const res = {};
        const next = sinon.stub();

        sinon.stub(Report, 'findAll').throws();

        await(getReportsOnAnArticle(req, res, next));
        expect(next.called).to.be.true;
        sinon.restore();
      });
});
