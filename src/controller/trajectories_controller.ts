import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllTrajectories = async (req: Request, res: Response): Promise<void> => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const size = parseInt(req.query.size as string) || 10;
        const offset = (page - 1) * size;

        const trajectories = await prisma.trajectory.findMany({
            skip: offset,
            take: size
        });
        console.log("Aqui probando el resultado de trajectorias:", trajectories);

        const totalTrajectories = await prisma.trajectory.count();
        const totalPages = Math.ceil(totalTrajectories / size);

        res.status(200).json({
            data: trajectories,
            page,
            size,
            totalPages,
            totalTrajectories
        });
    } catch (error) {
        res.status(400).json({ 'Page or limit is not valid': error });
    }
};


export const filterTrajectories = async (req: Request, res: Response) => {
    try {
        //para buscar necesitas:
        //acceder al query y si no hay query no se puede realizar busqueda
        const { search, date } = req.query;

        if (!search) {
            res.status(400).json({ error: 'Se necesitan parametros para realizar busqueda de trajectorias' });
        };
        //en la busqueda necesitas poder usar el numero de id como string
        const searchID = parseInt(search as string);
        const searchDate = new Date (date as string);
        //le asignamos a esta constante la variable donde le decimos que no es numero
        //lo usaremos dentro de .findMany
        const isNumberSearch = !isNaN(searchID);
        const isDateSearch = !isNaN(searchDate.getTime());
        //quieres decirle que va a buscar id y fecha 
        //aqui esta busqueda la depositamos en una variable
        
        const searchTrajectory = prisma.trajectory.findMany({
            where: {
                OR: [
                    isNumberSearch ? { id: searchID } : {},
                    isDateSearch ? { date : searchDate } : {},
                ],
            },
        });
        //tiene que incluir latitude y longitud y el timestamp // aqui aplicamos lo que prisma no enseño
        //devolvemos la respuesta con un 200 
        console.log("Aqui viendo si busqueda por id y fecha funciona:", searchTrajectory);

        res.status(200).json({
            data: searchTrajectory,
        });
    } catch (error) {
        console.error('Error en la busqueda de trayectorias', error);
        res.status(400).json({error: 'Hubo un error en la busqueda de trayectoras'})

    }
};