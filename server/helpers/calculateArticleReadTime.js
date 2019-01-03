/**
 * @description function to calculate the time it takes to read an article
 * @param {string} article - article title
 * @returns {function} string
 */
const calculateArticleReadTime = (article) => {
  const wordsPerMinute = 275;
  const count = article.split(' ').length;
  const timeToRead = (count / wordsPerMinute).toFixed(0);
  return timeToRead == 0 ? 1 : timeToRead;
};
export default calculateArticleReadTime;
