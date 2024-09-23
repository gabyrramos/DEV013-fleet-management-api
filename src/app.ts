import express, { Application, Request, Response } from 'express';
import taxisRoutes from './routes/taxis';
import trajectoriesRoutes from './routes/trajectories';
import userRoutes from './routes/user';
import { PrismaClient } from '@prisma/client'
import { loginFunction } from './routes/authentication';
import { jwtMiddleware } from './middleware/authorization';

const app: Application = express();

const PORT: number = 3001;


const prisma = new PrismaClient()

app.use(express.json());
app.use(jwtMiddleware('secret_key'));
app.use('/api/taxis', taxisRoutes);
app.use('/api/trajectories', trajectoriesRoutes);
app.use('/api/users', userRoutes);

//registrando el endpoint de log in
loginFunction(app);

//Estableciendo el puerto://
app.listen(PORT, (): void => {
console.log('Escuchando el siguiente puerto :', PORT);
});

export default app;
