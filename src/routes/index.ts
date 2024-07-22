import { Router } from 'express';
import taxisRouter from './taxis';
import trajectoriesRouter from './trajectories';

const router = Router();


router.use(taxisRouter);
router.use(trajectoriesRouter);

export default router;
