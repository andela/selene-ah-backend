import chai, {expect} from 'chai';
import server from '../../server/index';
import getRandomCategory from '../../server/helpers/checkCategory';
import signupFactory from '../mocks/factories/userFactory';
import articleFactory from '../mocks/factories/articlesFactory';
import models from '../../server/models';

const { Article } = models;
const user = signupFactory.build({
  email: 'ettaigona@gmail.com',
  password: 'password123*'
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
});
