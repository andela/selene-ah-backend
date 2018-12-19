/**
 * @description function to calculate the time it takes to read an article
 * @param {string} article - article title
 * @returns {function} string
 */
const calculateArticleReadTime = (article) => {
  const wpm = 270;
  const count = article.split(' ').length;
  let timeToRead = count / wpm;
  return timeToRead = `${timeToRead.toFixed(0)} min read`;
};
export default calculateArticleReadTime;
