import { Router } from 'express';

import CategoryController
  from '../../../controllers/categories/categoryController';

const router = Router();
/**
 * @description - Route is use get all categories
 * @returns - It returns a categories object
 */
router.get('/categories', CategoryController.getCategories);

export default router;
