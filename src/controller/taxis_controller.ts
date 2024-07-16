import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllTaxis = async(req: Request, res: Response): Promise<void> => {
    try {
        const taxis = await prisma.taxi.findMany()
        console.log(taxis);
        res.status(200).json(taxis);
} catch (error) {
    res.status(500).json({'Algo salio mal': error});
}
};