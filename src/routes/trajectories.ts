import { Router } from 'express';
import { getAllTrajectories } from '../controller/trajectories_controller';

const router = Router();

router.get('/', getAllTrajectories);

export default router;