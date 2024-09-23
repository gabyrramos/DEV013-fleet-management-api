"use strict";
// import { Request, Response } from 'express';
// import { exportTrajectories } from '../export'; // Ajusta la ruta de tu archivo
// import prisma from '../db';
// import { generateExcel } from '../download_script';
// import nodemailer from 'nodemailer';
// // Mocks
// jest.mock('../src/db', () => ({
//     trajectory: {
//         findMany: jest.fn(),
//     },
// }));
// jest.mock('../src/download_script', () => ({
//     generateExcel: jest.fn(),
// }));
// jest.mock('nodemailer');
// describe('exportTrajectories', () => {
//     let req: Partial<Request>;
//     let res: Partial<Response>;
//     let sendMailMock: jest.Mock;
//     beforeEach(() => {
//         req = {
//             query: {
//                 taxi_id: '1',
//                 date: '2023-09-20',
//                 email: 'test@localhost.com',
//             },
//         };
//         res = {
//             status: jest.fn().mockReturnThis(),
//             json: jest.fn(),
//             download: jest.fn((filePath: string, filename?: string, options?: any, callback?: (err?: any) => void) => {
//                 if (typeof options === 'function') {
//                     callback = options;
//                 } else if (typeof filename === 'function') {
//                     callback = filename;
//                 }
//                 if (callback) {
//                     callback(null); // Simulamos una descarga exitosa
//                 }
//             }),
//         };
//         // Mock de nodemailer transporter
//         sendMailMock = jest.fn().mockResolvedValue(true);
//         (nodemailer.createTransport as jest.Mock).mockReturnValue({
//             sendMail: sendMailMock,
//         });
//     });
//     afterEach(() => {
//         jest.clearAllMocks();
//     });
//     it('should return 400 if parameters are missing', async () => {
//         req.query = {}; // Sin parámetros
//         await exportTrajectories(req as Request, res as Response);
//         expect(res.status).toHaveBeenCalledWith(400);
//         expect(res.json).toHaveBeenCalledWith({
//             error: 'Se necesitan parametros para realizar la descarga de trayectorias',
//         });
//     });
//     it('should return 400 for invalid taxi_id', async () => {
//         req.query.taxi_id = 'invalid';
//         await exportTrajectories(req as Request, res as Response);
//         expect(res.status).toHaveBeenCalledWith(400);
//         expect(res.json).toHaveBeenCalledWith({ error: 'ID de taxi no válido' });
//     });
//     it('should return 400 for invalid date', async () => {
//         req.query.date = 'invalid-date';
//         await exportTrajectories(req as Request, res as Response);
//         expect(res.status).toHaveBeenCalledWith(400);
//         expect(res.json).toHaveBeenCalledWith({ error: 'Fecha no válida' });
//     });
//     it('should call generateExcel and send email after file download', async () => {
//         const mockTrajectories = [
//             { id: 1, taxi_id: 1, latitude: 10.123, longitude: -84.123, date: new Date() },
//         ];
//         (prisma.trajectory.findMany as jest.Mock).mockResolvedValue(mockTrajectories);
//         (generateExcel as jest.Mock).mockReturnValue('/path/to/excel/file.xlsx');
//         await exportTrajectories(req as Request, res as Response);
//         expect(prisma.trajectory.findMany).toHaveBeenCalledWith({
//             where: {
//                 taxi_id: 1,
//                 date: {
//                     gte: new Date(req.query.date as string),
//                     lte: expect.any(D
