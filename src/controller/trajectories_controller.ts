import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { isDate } from 'node:util/types';

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
    
        const { search, date, page, size } = req.query;

        if (!search && !date) {
            res.status(400).json({ error: 'Se necesitan parametros para realizar busqueda de trajectorias' });
        };
        
        const searchID = parseInt(search as string);
        const isNumberSearch = !isNaN(searchID);

        const searchDate = new Date (date as string);
        const endDate = new Date (searchDate);
        endDate.setDate(endDate.getDate() + 1)
    
        //agregando variables para la paginacion aqui
         const filterPage = parseInt(page as string) || 1;
         const pageSize = parseInt(size as string) || 10;
         const offset = (filterPage - 1) * pageSize;

        const searchTrajectory = await prisma.trajectory.findMany({
            where: {
                 taxi_id: searchID, date : {gte:searchDate,lte:endDate}
            },
            //para paginacion
            skip: offset,
            take: pageSize,
        });

        console.log("Aqui viendo si busqueda por id y fecha funciona:", searchTrajectory);

        //para que la paginacion muestre el total de items y paginas
         const totalFilteredTrajectories = await prisma.trajectory.count({ where:{ taxi_id: searchID, date : {gte:searchDate,lte:endDate}}});
         const totalFilteredPages = Math.ceil(totalFilteredTrajectories / pageSize);

        res.status(200).json({
            data: searchTrajectory,
            //agregando para que imprima la informacion de la paginacion
            page: filterPage,
            size: pageSize,
            totalFilteredPages,
            totalFilteredTrajectories,
        });
    } catch (error) {
        console.error('Error en la busqueda de trayectorias', error);
        res.status(400).json({error: 'Hubo un error en la busqueda de trayectoras'})

    }
};

