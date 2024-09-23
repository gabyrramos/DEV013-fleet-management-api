"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const taxis_1 = __importDefault(require("./routes/taxis"));
const trajectories_1 = __importDefault(require("./routes/trajectories"));
const user_1 = __importDefault(require("./routes/user"));
const client_1 = require("@prisma/client");
const authentication_1 = require("./routes/authentication");
const authorization_1 = require("./middleware/authorization");
const app = (0, express_1.default)();
const PORT = 3001;
const prisma = new client_1.PrismaClient();
app.use(express_1.default.json());
app.use('/api/taxis', taxis_1.default);
app.use('/api/trajectories', trajectories_1.default);
app.use('/api/users', authorization_1.requireAuth, authorization_1.requireAdmin, user_1.default);
//registrando el endpoitn de log in
(0, authentication_1.loginFunction)(app);
//Estableciendo el puerto://
app.listen(PORT, () => {
    console.log('Escuchando el siguiente puerto :', PORT);
});
exports.default = app;
