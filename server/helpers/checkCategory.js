import models from '../models';

const { Category } = models;

const getRandomCategory = async () => (
  await Category.findAll({ attributes: ['id'] })
)[0].id;

export default getRandomCategory;
