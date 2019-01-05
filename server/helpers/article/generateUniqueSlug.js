import slug from 'slug';
/**
 * @description function to generate unique slug
 * @param {string} title - article title
 * @returns {function} random string
 */
const generateUniqueSlug = (title) => {
  return `${slug(title)}-${Math.random().toString(36).substr(2, 10)}`;
};
export default generateUniqueSlug;
