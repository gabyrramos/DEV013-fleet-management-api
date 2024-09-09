import { Router } from 'express';
import taxisRouter from './taxis';
import trajectoriesRouter from './trajectories';
import usersRouter from './user';

const router = Router();


router.use(taxisRouter);
router.use(trajectoriesRouter);
router.use(usersRouter);

export default router;
