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
exports.editUser = exports.postUser = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma = new client_1.PrismaClient();
const postUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //el cuerpo debe tener email y password
        const { name, email, password } = req.body;
        console.log('Received body:', req.body);
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Nombre o email invalido' });
        }
        //luego validamos que el correo no exista en la db
        const existingEmail = yield prisma.users.findUnique({
            where: { email }
        });
        if (existingEmail) {
            return res.status(409).json({ error: 'El correo electronico ya existe' });
        }
        //debemos hashear pw para que se guarde la contraseña encriptada
        const hashedPassword = yield bcrypt_1.default.hash(password, 5);
        //despues posteamos dentro de data el usuario 
        const user = yield prisma.users.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });
        res.status(200).json(user);
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            error: 'Hubo un error con la operación'
        });
    }
});
exports.postUser = postUser;
const editUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //quiero poder acceder al cuerpo del request
        const { name, email, password } = req.body;
        //quiero decirle que el nuevo cuerpo debe de tener email, name y password si o si
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Datos incompletos' });
        }
        //    const updatedInfo = prisma.users.update({
        //     data: {
        //     name,
        //     email,
        //     password,
        //     },
        // });
    }
    catch (error) {
    }
});
exports.editUser = editUser;
