import sequelizeTestHelper from 'sequelize-test-helpers';
import { expect } from 'chai';
import tagModel from '../../server/models/tag';

const {
  sequelize,
  dataTypes
} = sequelizeTestHelper;

describe('Model for Tags', () => {
  const Tag = tagModel(sequelize, dataTypes);
  const newTag = new Tag();
  context('Tag properties', () => {
    it('should have model name of Tags', () => {
      expect(Tag.modelName).to.equal('Tag');
    });
    it('should have property tag', () => {
      expect(newTag).to.have.property('tag');
    });
  });
});
