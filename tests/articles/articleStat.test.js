import chai, {expect} from 'chai';
import sinon from 'sinon';
import server from '../../server/index';
import getRandomCategory from '../../server/helpers/category/checkCategory';
import signupFactory from '../mocks/factories/userFactory';
import articleFactory from '../mocks/factories/articlesFactory';
import models from '../../server/models';
import articleController from
  '../../server/controllers/article/articlesController';

const { Article } = models;
const user = signupFactory.build({
  email: 'ettaigona@gmail.com',
  password: 'password123*',
  userName: 'show@#*&$^#@'
});

let userId, token, articleId;
describe('Reading stat', () => {
  before(async () => {
    const categoryId = await getRandomCategory();
    const res = await chai.request(server)
      .post('/api/v1/auth/signup')
      .send(user);
    userId = res.body.user.id;
    token = res.body.token;

    const articleParams = articleFactory.build({
      title: 'TO ME',
      body: 'I am home',
      categoryId,
      userId
    });
    const article = await chai.request(server)
      .post('/api/v1/article')
      .set('Authorization', `Bearer ${token}`)
      .send(articleParams);
    articleId = article.body.article.id;

  await chai.request(server)
    .get(`/api/v1/article/${articleId}`);
  });

  after(async () => {
    Article.destroy({
      where: {id:articleId}
    });
  });


  it('should update reading stat in the database', async () => {
    const article = await Article.findOne({where:{id: articleId}});
    expect(article.readingStat).to.be.equals(1);
  });

  it('should return all the user article stat', async () => {
    const res = await chai.request(server)
    .get('/api/v1//articles/stat')
    .set('Authorization', `Bearer ${token}`);
    expect(res).to.have.status(200);
    expect(res.body.message).to.equal('success');
    expect(res.body.data.count).to.be.equals(1);
  });

  it(  'should stub error for user article stat', async () => {
    const req = {
      user: {
        id: 3,
        role: true,
        ownerId: 4
      }
    };
    const res = {};
    const next = sinon.stub();
    sinon.stub(Article, 'findAndCountAll').throws();
    await articleController.getArticlesStatByUser(req, res, next);
    expect(next.called).to.be.true;
  });
});
