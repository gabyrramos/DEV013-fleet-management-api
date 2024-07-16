import { Router } from 'express';
import taxisRouter from './taxis';
import trajectoriesRouter from './trajectories';

const router = Router();


router.use('./taxis', taxisRouter);
router.use('./trajectories', trajectoriesRouter);

export default router;
