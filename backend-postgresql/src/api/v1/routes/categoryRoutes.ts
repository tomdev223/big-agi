// Express
import express from 'express';
// Middleware
import { authenticateUser } from '../middleware/authenticate';
// Controllers
import {
  createCategory,
  getCategory,
  updateCategory,
  getCategories,
  deleteCategory,
} from '../controllers/categoryController';

const router = express.Router();

router.get('/', getCategories);

router.get('/:categoryId', getCategory);

router.delete('/:categoryId', deleteCategory);

router.post('/create', createCategory);

router.post('/update', updateCategory);

export default router;
