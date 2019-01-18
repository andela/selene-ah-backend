import models from '../../models';
import { GOT_CATEGORIES_MESSAGE, NO_CATEGORY_FOUND }
  from '../../helpers/category/responseMessages';

const { Category } = models;

/**
 * @description CategoryController - for handling categories
 */
class CategoryController{
/**
 * @param {object} req - the request object containing the input data
 * @param {object} res - response from database operation
 * @param {object} next - callback function
 * @returns {object} response PropTypes.object,
 * */
  static async getCategories(req, res, next){
    try{
      const categories = await Category.findAll({
        attributes: ['id', 'title'],
        raw: true
      });

      if(categories){
        return res.status(200).json({
          success: true,
          message: GOT_CATEGORIES_MESSAGE,
          categories
        });
      }

      return res.status(404).json({
        success: false,
        message: NO_CATEGORY_FOUND,
      });
    }catch(error){
      return next(error);
    }
  }

}

export default CategoryController;
