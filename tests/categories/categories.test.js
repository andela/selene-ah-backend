import chaiHttp from 'chai-http';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import app from '../../server/index';
import models from '../../server/models';
import CategoryController
  from '../../server/controllers/categories/categoryController';

import {
  GOT_CATEGORIES_MESSAGE,
} from '../../server/helpers/category/responseMessages';

chai.use(chaiHttp);

const { Category } = models;

const getCategoriesUrl = '/api/v1/categories';

describe('Category controller', () => {

  afterEach(sinon.restore);

  /**
   * @description tests for getting all categories
   */
  describe(`#GET ${getCategoriesUrl} - Endpoint to get an article's ratings -`,
  async () => {
    it('should get all categories', async () => {
      const response = await chai.request(app)
        .get(getCategoriesUrl);
          expect(response).to.have.status(200);
          expect(response.body).to.be.an('object');
          expect(response.body.message).to.equal(GOT_CATEGORIES_MESSAGE);
    });

    it('should return a 500 error if it can not get an article\'s ratings.',
    async () =>{
      const req = {};
      const res = {};
      const next = sinon.stub();

      sinon.stub(Category, 'findAll').throws();
      await CategoryController.getCategories(req, res, next);
      expect(next.called).to.be.true;
      sinon.restore();
    });

    it('should return 404 if no category is found', async () => {
      const req = {};
      const res = {
        status() {},
        json() {}
      };
      const next = () => {};

      sinon.stub(res, 'status').returnsThis();
      sinon.stub(Category, 'findAll').returns(false);
      await CategoryController.getCategories(req, res, next);
      expect(res.status).to.have.been.calledWith(404);
    });
  });
});
