import models from '../../models';
import {
  NOT_FOUND_MSG,
  SUCCESSFULLY_CREATED_MSG,
  SUCCESSFULLY_DELETED_MSG,
  INVALID_STRING_MSG,
  ROLE_ALREADY_EXIST_MSG
} from '../../helpers/responseMessages';
import Validation from '../../helpers/validation/validations';

const { Role, User } = models;
/**
 * @class Authorization
 */
class Authorization {
  /**
   * @description Method used to get all roles in the db
   * @memberof Authorization
   * @param {object} req
   * @param {object} res
   * @param {object} next
   * @returns {object} Response
   */
  static async getAllRoles(req, res, next) {
    try {
      const dbResponse = await Role.findAll();
      if(!dbResponse) {
        return res.json({
          error: NOT_FOUND_MSG
         });
      }
      return res.status(200).json({
        data: dbResponse
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @description Method adds a new role
   * @memberof Authorization
   * @param {object} req
   * @param {object} res
   * @param {object} next
   * @returns {object} Response
   */
  static async postANewRole(req, res, next) {
    try {
      const isAValidString = Validation.isNameValid(req.body.type);
      if(!isAValidString){
        return res.status(400).json({ message: INVALID_STRING_MSG });
      }

      const dbResult = await Role
                        .findOrCreate({ where: { type: req.body.type },
                                  defaults: { type: req.body.type } });
      if(dbResult[1]) {
        return res.status(201).json({ message: SUCCESSFULLY_CREATED_MSG });
      }
      return res.status(200).json({ message: ROLE_ALREADY_EXIST_MSG });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @description Deletes a role from the db
   * @param {object} req
   * @param {object} res
   * @param {object} next
   * @returns {object} Response
   */
  static async deleteARole(req, res, next) {
    try {
      const { type } = req.body;
      const isAValidString = Validation.isNameValid(type);
      if(!isAValidString){
        return res.status(400).json({ message: INVALID_STRING_MSG });
      }

      await Role.destroy({ where: { type: type } });
      return res.status(200).json({
        message: SUCCESSFULLY_DELETED_MSG
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @description Updates user's role
   * @param {object} req
   * @param {object} res
   * @param {object} next
   * @returns {object} Response
   */
  static async updateUserRole(req, res, next) {
    try {
      const { id } = req.params;
      User.update({ role: req.body.role }, { where: { id: id } });
      return true;
    } catch (error) {
      return next(error);
    }
  }
}

export default Authorization;
