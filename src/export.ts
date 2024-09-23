import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { generateExcel } from './download_script';
import nodemailer from 'nodemailer';
import * as path from 'path';

const prisma = new PrismaClient();

const sendEmailWithAttachment = async (filePath: string, recipientEmail: string) => {
    // Configuración del transportador de Nodemailer
    const transporter = nodemailer.createTransport({
        service: 'gmail', // O el servicio que estés usando
        auth: {
            user: 'gabyr.contact@gmail.com', // Tu dirección de correo electrónico
            pass: 'kkzkulrczxcakzsc', //generado por gmail
        },
    });

    // Configuración del correo electrónico
    const mailOptions = {
        from: 'gabyr.contact@gmail.com',
        to: 'gabyr.contact@gmail.com',
        subject: 'Enviando Trayectorias',
        text: 'Adjunto encontrarás el archivo Excel con las trayectorias.',
        attachments: [
            {
                filename: 'trayectorias.xlsx',
                path: filePath,
            },
        ],
    };

    // Enviando aqui el correo electrónico
    try {
        await transporter.sendMail(mailOptions);
        console.log('Correo enviado exitosamente');
        return true; // Indica éxito
    } catch (error) {
        console.error('Error al enviar el correo:', error);
        return false; // Indica error
    }
};

export const exportTrajectories = async (req: Request, res: Response) => {
    try {
        const { taxi_id, date, email } = req.query;

        if (!taxi_id && date && email ) {
            return res.status(400).json({ error: 'Se necesitan parametros para realizar la descarga de trayectorias' });
        }
        const taxiID = parseInt(taxi_id as string);
        if (isNaN(taxiID)) {
            return res.status(400).json({ error: 'ID de taxi no válido' });
        }
        const searchDate = new Date(date as string);
        if (isNaN(searchDate.getTime())) {
            return res.status(400).json({ error: 'Fecha no válida' });
        }
        const endDate = new Date(searchDate);
        endDate.setDate(endDate.getDate() + 1)

        const searchTrajectory = await prisma.trajectory.findMany({
            where: {
                taxi_id: taxiID,
                date: {
                    gte: searchDate,
                    lte: endDate
                },
            },
            select: {
                id: true,
                taxi_id: true,
                latitude: true,
                longitude: true,
                date: true,
            },

        });
        console.log("Aqui viendo si busqueda por id y fecha funciona:", searchTrajectory);
        const filePath = generateExcel(searchTrajectory, res);
        
        // Responder la descarga del archivo
        res.download(filePath, 'trayectorias.xlsx', async (err) => {
            if (err) {
                console.error('Error al descargar el archivo', err);
                return res.status(500).json({ error: 'Error al descargar el archivo' });
            } else {
                // Enviar el correo solo después de descargar el archivo
                const emailSent = await sendEmailWithAttachment(filePath, email as string);
                if (!emailSent) {
                    console.error('Error al enviar el correo');
                }
            }
        });
    } catch (error) {
        console.error('Error en la búsqueda de ubicaciones de un taxi', error);
        return res.status(400).json({ error: 'No se puede concretar la búsqueda' });
    }
};


