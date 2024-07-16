import express, { Application, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client'

const app: Application = express();

const PORT: number = 3001;


const prisma = new PrismaClient()

app.use('/taxis', async(req: Request, res: Response): Promise<void> => {
    const taxis = await prisma.taxi.findMany()
    console.log(taxis);
    res.json(taxis)
});

app.listen(PORT, (): void => {
    console.log('Escuchando el puerto siguiente :', PORT);
});

