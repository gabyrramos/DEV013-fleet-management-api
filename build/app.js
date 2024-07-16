"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("../src/routes"));
const client_1 = require("@prisma/client");
const app = (0, express_1.default)();
const PORT = 3001;
const prisma = new client_1.PrismaClient();
app.use(express_1.default.json());
app.use('/api', routes_1.default);
//Estableciendo el puerto://
app.listen(PORT, () => {
    console.log('Escuchando el siguiente puerto :', PORT);
});
exports.default = app;
