import { Router } from 'express';
import { getAllTaxis, filterTaxis } from '../controller/taxis_controller';

const router = Router();

router.get('/', getAllTaxis);
router.get('/filter', filterTaxis);


export default router;