import sequelizeTestHelper from 'sequelize-test-helpers';
import { expect } from 'chai';
import tags from '../../server/models/tags';

const {
  sequelize,
  dataTypes
} = sequelizeTestHelper;

describe('Model for Tags', () => {
  const tagModel = tags(sequelize, dataTypes);
  const newTag = new tagModel();
  context('Tag properties', () => {
    it('should have model name of Tags', () => {
      expect(tagModel.modelName).to.equal('Tags');
    });
    it('should have property tag', () => {
      expect(newTag).to.have.property('tag');
    });
  });
});
