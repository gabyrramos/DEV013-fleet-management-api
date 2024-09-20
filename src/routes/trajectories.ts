import { Router } from 'express';
import { getAllTrajectories, filterTrajectories  } from '../controller/trajectories_controller';
import { exportTrajectories } from '../export';

const router = Router();

router.get('/', getAllTrajectories);
router.get('/filter', filterTrajectories);
router.get('/export', exportTrajectories)

export default router;