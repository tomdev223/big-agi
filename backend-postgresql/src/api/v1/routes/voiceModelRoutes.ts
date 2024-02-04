// Express
import express from 'express';
// Middleware
import { authenticateUser } from '../middleware/authenticate';
// Controllers
import {
  createVoiceModel,
  getVoiceModel,
  updateVoiceModel,
  getVoiceModels,
  deleteVoiceModel,
} from '../controllers/voiceModelController';

const router = express.Router();

router.get('/', getVoiceModels);

router.get('/:apikeyId', getVoiceModel);

router.delete('/:apikeyId', deleteVoiceModel);

router.post('/create', createVoiceModel);

router.post('/update', updateVoiceModel);

export default router;
