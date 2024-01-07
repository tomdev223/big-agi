// Express
import { Request, Response } from 'express';
// Entities
import Category from '../entity/Category';
// Constants, Helpers & Types
import { ResponseCode } from '../types/enum';
import {
  databaseError,
  entityManager,
  limitOffset,
  responseUpdateDelete,
  uuidError,
  validateError,
  validateLimitOffset,
} from '../helpers';

export const createCategory = async (req: Request, res: Response) => {
  // authenticated user and request body
  const { user, body } = req;

  const { title, icon, color, personas } = body;
  console.log('req body', body);
  const category = new Category({
    title,
    icon,
    color,
    // personas
  });
  // Validation of input for errors
  const errors = await validateError(category, res);
  if (errors) {
    return;
  }

  try {
    // create the food
    await entityManager.save(category);
    return res.status(200).json(category);
  } catch (error) {
    return databaseError(error, res);
  }
};
export const getCategory = async (req: Request, res: Response) => {
  const { categoryId } = req.params;
  console.log('Category console:', req.params);
  // check if food id is valid
  if (uuidError(categoryId, 'category', res)) {
    return;
  }

  // find food by the id
  const category = await entityManager.findOne(Category, {
    where: { id: categoryId },
  });

  if (category) {
    return res.status(200).json({
      code: ResponseCode.SUCCESS,
      message: 'Category found.',
      category,
    });
  } else {
    return res.status(204).send();
  }
};
export const deleteCategory = async (req: Request, res: Response) => {
  const { categoryId } = req.params;
  console.log('id', categoryId);
  // check if category id is valid
  if (uuidError(categoryId, 'category', res)) {
    return;
  }

  // find food by the id
  const deleted = await entityManager.delete(Category, { id: categoryId });

  return responseUpdateDelete('Category', deleted, 'Deleted', res);
};
export const updateCategory = async (req: Request, res: Response) => {
  // authenticated user
  const { user, body } = req;

  const { id, title, icon, color } = body;

  const category = new Category({
    title,
    icon,
    color,
  });

  // Validation of input for errors
  const errors = await validateError(category, res, true);
  if (errors) {
    return;
  }

  try {
    // update food properties
    const updated = await entityManager.update(Category, { id: id }, category);

    return responseUpdateDelete('Category', updated, 'Updated', res);
  } catch (error) {
    return databaseError(error, res);
  }
};
export const getCategories = async (req: Request, res: Response) => {
  // const { body } = req;

  // // Validate pagination parameters
  // const { limit, offset } = validateLimitOffset(body);

  // find all foods
  const categories = await entityManager.find(Category);

  return res.status(200).json(categories);
};
