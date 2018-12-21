import { LIMIT_DEFAULT, PAGE_DEFAULT } from './constants';
/**
 * @param {object} query
 * @returns {object} - object containing limit and offset
 */
const paginationHelper = (query) => {
  const page = parseInt(query.page) || PAGE_DEFAULT;
  const limit = parseInt(query.limit) || LIMIT_DEFAULT;
  const offset = limit * (page - 1);
  return {limit, offset};
};

export default {
  paginationHelper
};
