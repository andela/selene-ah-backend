/* eslint-disable max-len */
/**
 * @class
 */
class Validation {
/**
 * @description checks if an email syntax is right or wrong
 * @param {String} email
 * @returns {Boolean} Boolean
 */
  static isEmailValid(email) {
    const emailRegex = /^([a-z_.!@#$%^&*0-9]{3,25})@([a-z]{3,20})\.([a-z]){3,7}(\.[a-z]{2,5})?$/i;
    return emailRegex.test(email);
  }

/**
 * @description checks if a password syntax is right
 * @param {String} password to be tested
 * @returns {Boolean} returns true or false
 */
  static isPasswordValid(password) {
    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^.&_*])([a-zA-Z0-9!@#$.%^&*]{8,20})$/;
    return passwordRegex.test(password);
  }

/**
 * @description checks if a name syntax is right
 * @param {String} name to be tested
 * @return {Boolean} returns true or false
 */
  static isNameValid(name) {
    const nameRegex = /^([a-zA-Z]){3,20}$/;
    return nameRegex.test(name);
  }

/**
 * @description checks if a username syntax is right
 * @param {String} name to be tested
 * @return {Boolean} returns true or false
 */
  static isUsernameValid(name) {
    const usernameRegex = /^([a-zA-Z0-9!@#$%^_&.*]){3,20}$/;
    return usernameRegex.test(name);
  }
/**
 * @description checks if a uuid is valid
 * @param {uuid} uuid to be tested
 * @return {Boolean} returns true or false
 */
  static isUUIDValid(uuid) {
    const uuidRegex = /^[A-F\d]{8}-[A-F\d]{4}-4[A-F\d]{3}-[89AB][A-F\d]{3}-[A-F\d]{12}$/i; // UUID Regex credit to @jakewtaylor
    return uuidRegex.test(uuid);
  }
  /**
   * @description Checks if email is a social email
   * @param {string} email
   * @returns {boolean} True or False
   */
  static isSocialMediaEmail(email) {
    return email.includes('@facebook.com') || email.includes('@twitter.com');
  }

/**
 * @param {object} model - Model
 * @param {object} options - The parameters for the where clause
 * @returns {boolean} - true or false
 */
  static async entityExistsInTable(model, options) {
    const count = await model.count({
      where: options
    });

    return count >= 1;
  }

/**
 * @param {string} input argument to be checked
 * @param {integer} length of the string to make it valid
 * @returns {boolean} a values of true or false is returned
 */
  static isFieldValid(input, length=1) {
    if (!input || input.trim().length < 1 || input.trim().length < length ) {
      return false;
    }

    return true;
  }

/**
 * @description Validates a text field Length
 * @param {String} text
 * @return {Boolean} returns true or false
 */
static validateTextLength(text) {
  if (text.length >= 2 && text.length <= 200 && !!text.trim()) {
    return true;
  }
  return false;
}
}

export default Validation;
