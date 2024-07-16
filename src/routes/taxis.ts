import { Router } from 'express';
import { getAllTaxis } from '../controller/taxis_controller';

const router = Router();

router.get('/', getAllTaxis);

export default router;