// Express
import express from 'express';
// Middleware
import { authenticateUser } from '../middleware/authenticate';
// Controllers
import {
  createApikey,
  getApikey,
  updateApikey,
  getApikeys,
  deleteApikey,
  findByApiName,
} from '../controllers/apikeyController';

const router = express.Router();

router.get('/', getApikeys);

router.get('/:apikeyId', getApikey);

router.delete('/:apikeyId', deleteApikey);

router.post('/create', createApikey);

router.post('/update', updateApikey);

router.post('/findByApiName', findByApiName);

export default router;
