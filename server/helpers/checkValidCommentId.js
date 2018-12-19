import db from '../models';

const { Comment} = db;

/**
 * @description checks is an comment exists in the database
 * @param {string} id - req from route
 * @returns {boolean} - depending on if ID is valid
 */
const checkCommentId = async (id) => {
  try {
    const comment = await Comment.findOne({
      where: { id }
    });
    if (comment.dataValues) {
      return comment.dataValues.userId;
    }
    return null;
  } catch (error) {
    return false;
  }
};

export default checkCommentId;
