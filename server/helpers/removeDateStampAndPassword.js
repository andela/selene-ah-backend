/**
 * @description This function destructures the user object
 * and deletes some properties from the object
 * @param {object} user
 * @returns {object} userObject
 */

const removeDateStampsAndPassword = (user) => {
  if(!user.firstName){
    throw new Error('Please enter a valid user object');
  }
  const {createdAt, updatedAt, password, ...userObject } = user;
  return userObject;
};

export default removeDateStampsAndPassword;
