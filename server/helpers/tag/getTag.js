import models from '../../models';

const { ArticleTag } = models;

const getRandomTag = async () => (
  await ArticleTag.findAll({ attributes: ['id'] })
)[0].id;

export default getRandomTag;
