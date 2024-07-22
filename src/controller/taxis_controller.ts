import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { skip } from "node:test";

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
        res.status(500).json({ 'Algo salio mal': error });
    }
};