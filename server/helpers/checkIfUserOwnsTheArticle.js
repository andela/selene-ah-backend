import models from '../models';

const { Article } = models;

const checkIfUserOwnsArticle = async (articleId, userId) => {
  const article = await Article.findOne({
    where: {
      id: articleId,
      userId: userId,
    }
  });

  return article;
};
export default checkIfUserOwnsArticle;
