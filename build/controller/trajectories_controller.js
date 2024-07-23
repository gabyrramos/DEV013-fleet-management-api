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
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterTrajectories = exports.getAllTrajectories = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getAllTrajectories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = parseInt(req.query.page) || 1;
        const size = parseInt(req.query.size) || 10;
        const offset = (page - 1) * size;
        const trajectories = yield prisma.trajectory.findMany({
            skip: offset,
            take: size
        });
        console.log("Aqui probando el resultado de trajectorias:", trajectories);
        const totalTrajectories = yield prisma.trajectory.count();
        const totalPages = Math.ceil(totalTrajectories / size);
        res.status(200).json({
            data: trajectories,
            page,
            size,
            totalPages,
            totalTrajectories
        });
    }
    catch (error) {
        res.status(400).json({ 'Page or limit is not valid': error });
    }
});
exports.getAllTrajectories = getAllTrajectories;
const filterTrajectories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { search, date } = req.query;
        if (!search && !date) {
            res.status(400).json({ error: 'Se necesitan parametros para realizar busqueda de trajectorias' });
        }
        ;
        const searchID = parseInt(search);
        const isNumberSearch = !isNaN(searchID);
        const searchDate = new Date(date);
        const isDateSearch = searchDate;
        const endDate = new Date(searchDate);
        endDate.setDate(endDate.getDate() + 1);
        const searchTrajectory = yield prisma.trajectory.findMany({
            where: {
                taxi_id: searchID, date: { gte: searchDate, lte: endDate }
            },
        });
        console.log("Aqui viendo si busqueda por id y fecha funciona:", searchTrajectory);
        res.status(200).json({
            data: searchTrajectory,
        });
    }
    catch (error) {
        console.error('Error en la busqueda de trayectorias', error);
        res.status(400).json({ error: 'Hubo un error en la busqueda de trayectoras' });
    }
});
exports.filterTrajectories = filterTrajectories;
