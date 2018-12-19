import db from '../models';

const { Article } = db;

/**
 * @description checks is an article exists in the database
 * @param {string} id - req from route
 * @returns {boolean} - depending on if ID is valid
 */
const checkArticleId = async (id) => {
  try {
    const article = await Article.findOne({
      where: { id }
    });
    if (article.dataValues) {
      return true;
    }
    return null;
  } catch(error) {
    return false;
  }

};

export default checkArticleId;
