import { Request, Response} from 'express';
import { PrismaClient } from '@prisma/client';
import { log } from 'console';

const prisma = new PrismaClient();

export const getAllTrajectories = async(req: Request, res: Response):Promise<void> => {
 const trajectories = await prisma.trajectory.findMany();
 console.log(trajectories);
 res.status(200).json(trajectories);
 
}