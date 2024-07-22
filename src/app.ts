import express, { Application, Request, Response } from 'express';
import taxisRoutes from './routes/taxis';
import trajectoriesRoutes from './routes/trajectories';
import { PrismaClient } from '@prisma/client'


const app: Application = express();

const PORT: number = 3001;


const prisma = new PrismaClient()

app.use(express.json());
app.use('/api/taxis', taxisRoutes);
app.use('/api/trajectories', trajectoriesRoutes);

//Estableciendo el puerto://
app.listen(PORT, (): void => {
console.log('Escuchando el siguiente puerto :', PORT);
});

export default app;

