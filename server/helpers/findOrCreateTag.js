import models from '../models';

const { Tag } = models;

const tagsAdded = [];
const findOrCreateTag = async (tagsArray) => {
  const tagData = await Promise.all(tagsArray.map(tagName =>
    Tag.findOrCreate({
      where: { tag: tagName },
      defaults: {
        tag: tagName
      }
    })));
  tagData.forEach((tags) => {
    tagsAdded.push(tags[0].id);
  });
  return tagsAdded;
};


export default findOrCreateTag;
