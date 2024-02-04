// Express
import { Request, Response } from 'express';
// Entities
import VoiceModel from '../entity/VoiceModel';
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

export const createVoiceModel = async (req: Request, res: Response) => {
  // authenticated user and request body
  const { user, body } = req;

  const { language, genre, voiceName } = body;
  console.log('req body', body);
  const voiceModel = new VoiceModel({
    language,
    genre,
    voiceName,
  });
  // Validation of input for errors
  const errors = await validateError(voiceModel, res);
  if (errors) {
    return;
  }

  try {
    // create the voiceModel
    await entityManager.save(voiceModel);
    return res.status(200).json(voiceModel);
  } catch (error) {
    return databaseError(error, res);
  }
};
export const getVoiceModel = async (req: Request, res: Response) => {
  const { voiceModelId } = req.params;
  console.log('VoiceModel console:', req.params);
  // check if voiceModel id is valid
  if (uuidError(voiceModelId, 'voiceModel', res)) {
    return;
  }

  // find voiceModel by the id
  const voiceModel = await entityManager.findOne(VoiceModel, {
    where: { id: voiceModelId },
  });

  if (voiceModel) {
    return res.status(200).json({
      code: ResponseCode.SUCCESS,
      message: 'VoiceModel found.',
      voiceModel,
    });
  } else {
    return res.status(204).send();
  }
};
export const deleteVoiceModel = async (req: Request, res: Response) => {
  const { voiceModelId } = req.params;
  console.log('id', voiceModelId);
  // check if voiceModel id is valid
  if (uuidError(voiceModelId, 'voiceModel', res)) {
    return;
  }

  // find voiceModel by the id
  const deleted = await entityManager.delete(VoiceModel, { id: voiceModelId });

  return responseUpdateDelete('VoiceModel', deleted, 'Deleted', res);
};
export const updateVoiceModel = async (req: Request, res: Response) => {
  // authenticated user
  const { user, body } = req;

  const { id, language, genre, voiceName } = body;

  const voiceModel = new VoiceModel({
    language,
    genre,
    voiceName,
  });

  // Validation of input for errors
  const errors = await validateError(voiceModel, res, true);
  if (errors) {
    return;
  }

  try {
    // update voiceModel properties
    const updated = await entityManager.update(VoiceModel, { id: id }, voiceModel);

    return responseUpdateDelete('VoiceModel', updated, 'Updated', res);
  } catch (error) {
    return databaseError(error, res);
  }
};
export const getVoiceModels = async (req: Request, res: Response) => {
  // const { body } = req;

  // // Validate pagination parameters
  // const { limit, offset } = validateLimitOffset(body);

  // find all voiceModels
  const voiceModels = await entityManager.find(VoiceModel);

  return res.status(200).json(voiceModels);
};
