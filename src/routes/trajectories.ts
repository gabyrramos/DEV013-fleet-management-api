import { Router } from 'express';
import { getAllTrajectories, filterTrajectories  } from '../controller/trajectories_controller';

const router = Router();

router.get('/', getAllTrajectories);
router.get('/filter', filterTrajectories);

export default router;