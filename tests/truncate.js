// https://medium.com/riipen-engineering/testing-with-sequelize-cc51dafdfcf4
import map from 'lodash/map';
import models from '../server/models';
/**
 * @description - Truncate all data in sequelize tables
 * @returns {object}- Delete all data from sequelize tables
 */
export default async () => {
  return await Promise.all(
    map(Object.keys(models), (key) => {
      if (['sequelize', 'Sequelize'].includes(key)) return null;
      return models[key].destroy({ where: {}, force: true });
    })
  );
};
