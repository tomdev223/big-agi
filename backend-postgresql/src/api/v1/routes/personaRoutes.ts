// Express
import express from 'express';
// Middleware
import { authenticateUser } from '../middleware/authenticate';
// Controllers
import {
  createPersona,
  getPersona,
  updatePersona,
  getPersonas,
  deletePersona,
  findByTitle,
  findByCategory,
} from '../controllers/personaController';

const router = express.Router();

router.get('/', getPersonas);

router.get('/:personaId', getPersona);

router.delete('/:personaId', deletePersona);

router.post('/create', createPersona);

router.post('/update', updatePersona);
router.post('/findByTitle', findByTitle);
router.post('/findByCategory', findByCategory);

export default router;
