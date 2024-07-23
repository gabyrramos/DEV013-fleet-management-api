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
exports.filterTaxis = exports.getAllTaxis = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getAllTaxis = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = parseInt(req.query.page) || 1;
        const size = parseInt(req.query.size) || 10;
        const offset = (page - 1) * size;
        const taxis = yield prisma.taxi.findMany({
            skip: offset,
            take: size,
        });
        console.log("Aqui probando el resultado de taxis:", taxis);
        const totalTaxis = yield prisma.taxi.count();
        const totalPages = Math.ceil(totalTaxis / size);
        res.status(200).json({
            data: taxis,
            page,
            size,
            totalPages,
            totalTaxis
        });
    }
    catch (error) {
        res.status(400).json({ 'Page or limit is not valid': error });
    }
});
exports.getAllTaxis = getAllTaxis;
const filterTaxis = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { search } = req.query;
        if (!search) {
            return res.status(400).json({ error: 'Parametros son requeridos para la busqueda' });
        }
        const searchID = parseInt(search);
        const isNumberSearch = !isNaN(searchID);
        const searchTaxi = yield prisma.taxi.findMany({
            where: {
                OR: [
                    isNumberSearch ? { id: searchID } : {},
                    { plate: { contains: search } },
                ]
            }
        });
        console.log("Aqui viendo si funciona el search de id o plate:", searchTaxi);
        res.status(200).json({
            data: searchTaxi,
        });
    }
    catch (error) {
        res.status(400).json({ 'Busqueda no valida': error });
    }
});
exports.filterTaxis = filterTaxis;
