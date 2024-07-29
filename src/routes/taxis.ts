import { Router } from 'express';
import { getAllTaxis, filterTaxis, getAllLastTrajectories } from '../controller/taxis_controller';

const router = Router();

router.get('/', getAllTaxis);
router.get('/filter', filterTaxis);
router.get('/lastTrajectories', getAllLastTrajectories);

export default router;