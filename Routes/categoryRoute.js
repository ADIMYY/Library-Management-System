import express from 'express';

import { 
    createCategory, 
    getAllCategories, 
    deleteCategory 
} from '../Controller/categoryController.js';

import { protect, restrictTo } from '../Controller/authController.js';

const router = express.Router();

router.use(protect);

router.route('/').get(getAllCategories).post(restrictTo('admin'), createCategory);
router.route('/:id').delete(restrictTo('admin'), deleteCategory);

export default router;