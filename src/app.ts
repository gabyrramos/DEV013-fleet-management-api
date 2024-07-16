import express, { Application, Request, Response } from 'express';
import routes from '../src/routes';
import { PrismaClient } from '@prisma/client'


const app: Application = express();

const PORT: number = 3001;


const prisma = new PrismaClient()

app.use(express.json());
app.use('/api', routes);

//Estableciendo el puerto://
app.listen(PORT, (): void => {
    console.log('Escuchando el siguiente puerto :', PORT);
});

export default app;

