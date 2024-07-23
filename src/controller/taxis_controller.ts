import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


export const getAllTaxis = async (req: Request, res: Response): Promise<void> => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const size = parseInt(req.query.size as string) || 10;
        const offset = (page - 1) * size;

        const taxis = await prisma.taxi.findMany({
            skip: offset,
            take: size,
        });
        console.log("Aqui probando el resultado de taxis:", taxis);


        const totalTaxis = await prisma.taxi.count();
        const totalPages = Math.ceil(totalTaxis / size);

        res.status(200).json({
            data: taxis,
            page,
            size,
            totalPages,
            totalTaxis
        });
    } catch (error) {
        res.status(400).json({ 'Page or limit is not valid': error });
    }
};

export const filterTaxis = async (req: Request, res: Response) => {
    try {

        const { search } = req.query;

        if (!search) {
            return res.status(400).json({ error: 'Parametros son requeridos para la busqueda' });
          }
          
        const searchID = parseInt(search as string);
        const isNumberSearch = !isNaN(searchID);
        const searchTaxi = await prisma.taxi.findMany({
            where: {
                OR: [
                    isNumberSearch ? { id: searchID } : {},
                    { plate: { contains: search as string } },
                ]
            }
        });

        console.log("Aqui viendo si funciona el search de id o plate:", searchTaxi);
        res.status(200).json({
            data: searchTaxi,
        });
    } catch (error) {
        res.status(400).json({ 'Busqueda no valida': error });
    }
};
