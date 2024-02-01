// Express
import { Request, Response } from 'express';
// Entities
import Apikey from '../entity/Apikey';
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

export const findByApiName = async (req: Request, res: Response) => {
  const { apiname } = req.body;

  const apikey = await entityManager.findOne(Apikey, {
    where: { apiname: apiname },
  });

  res.status(200).json(apikey);
};
export const createApikey = async (req: Request, res: Response) => {
  // authenticated user and request body
  const { user, body } = req;

  const { apiname, key } = body;
  console.log('req body', body);
  const apikey = new Apikey({
    apiname,
    key,
  });
  // Validation of input for errors
  const errors = await validateError(apikey, res);
  if (errors) {
    return;
  }

  try {
    // create the food
    await entityManager.save(apikey);
    return res.status(200).json(apikey);
  } catch (error) {
    return databaseError(error, res);
  }
};
export const getApikey = async (req: Request, res: Response) => {
  const { apikeyId } = req.params;
  console.log('Apikey console:', req.params);
  // check if food id is valid
  if (uuidError(apikeyId, 'apikey', res)) {
    return;
  }

  // find food by the id
  const apikey = await entityManager.findOne(Apikey, {
    where: { id: apikeyId },
  });

  if (apikey) {
    return res.status(200).json({
      code: ResponseCode.SUCCESS,
      message: 'Apikey found.',
      apikey,
    });
  } else {
    return res.status(204).send();
  }
};
export const deleteApikey = async (req: Request, res: Response) => {
  const { apikeyId } = req.params;
  console.log('id', apikeyId);
  // check if apikey id is valid
  if (uuidError(apikeyId, 'apikey', res)) {
    return;
  }

  // find food by the id
  const deleted = await entityManager.delete(Apikey, { id: apikeyId });

  return responseUpdateDelete('Apikey', deleted, 'Deleted', res);
};
export const updateApikey = async (req: Request, res: Response) => {
  // authenticated user
  const { user, body } = req;

  const { id, apiname, key } = body;

  const apikey = new Apikey({
    apiname,
    key,
  });

  // Validation of input for errors
  const errors = await validateError(apikey, res, true);
  if (errors) {
    return;
  }

  try {
    // update food properties
    const updated = await entityManager.update(Apikey, { id: id }, apikey);

    return responseUpdateDelete('Apikey', updated, 'Updated', res);
  } catch (error) {
    return databaseError(error, res);
  }
};
export const getApikeys = async (req: Request, res: Response) => {
  // const { body } = req;

  // // Validate pagination parameters
  // const { limit, offset } = validateLimitOffset(body);

  // find all foods
  const categories = await entityManager.find(Apikey);

  return res.status(200).json(categories);
};
