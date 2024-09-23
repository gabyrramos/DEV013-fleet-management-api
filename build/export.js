"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportTrajectories = void 0;
const client_1 = require("@prisma/client");
const download_script_1 = require("./download_script");
const nodemailer_1 = __importDefault(require("nodemailer"));
const prisma = new client_1.PrismaClient();
const sendEmailWithAttachment = (filePath, recipientEmail) => __awaiter(void 0, void 0, void 0, function* () {
    // Configuración del transportador de Nodemailer
    const transporter = nodemailer_1.default.createTransport({
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
        yield transporter.sendMail(mailOptions);
        console.log('Correo enviado exitosamente');
        return true; // Indica éxito
    }
    catch (error) {
        console.error('Error al enviar el correo:', error);
        return false; // Indica error
    }
});
const exportTrajectories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { taxi_id, date, email } = req.query;
        if (!taxi_id && date && email) {
            return res.status(400).json({ error: 'Se necesitan parametros para realizar la descarga de trayectorias' });
        }
        const taxiID = parseInt(taxi_id);
        if (isNaN(taxiID)) {
            return res.status(400).json({ error: 'ID de taxi no válido' });
        }
        const searchDate = new Date(date);
        if (isNaN(searchDate.getTime())) {
            return res.status(400).json({ error: 'Fecha no válida' });
        }
        const endDate = new Date(searchDate);
        endDate.setDate(endDate.getDate() + 1);
        const searchTrajectory = yield prisma.trajectory.findMany({
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
        const filePath = (0, download_script_1.generateExcel)(searchTrajectory, res);
        // Responder la descarga del archivo
        res.download(filePath, 'trayectorias.xlsx', (err) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                console.error('Error al descargar el archivo', err);
                return res.status(500).json({ error: 'Error al descargar el archivo' });
            }
            else {
                // Enviar el correo solo después de descargar el archivo
                const emailSent = yield sendEmailWithAttachment(filePath, email);
                if (!emailSent) {
                    console.error('Error al enviar el correo');
                }
            }
        }));
    }
    catch (error) {
        console.error('Error en la búsqueda de ubicaciones de un taxi', error);
        return res.status(400).json({ error: 'No se puede concretar la búsqueda' });
    }
});
exports.exportTrajectories = exportTrajectories;
