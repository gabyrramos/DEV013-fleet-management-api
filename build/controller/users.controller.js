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
exports.deleteUser = exports.editUser = exports.getUsers = exports.postUser = void 0;
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
                role: 'user'
            },
        });
        res.status(200).json(user);
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Hubo un error con la operación' });
    }
});
exports.postUser = postUser;
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield prisma.users.findMany();
        console.log("Aqui probando respuesta usuarios:", users);
        res.status(200).json(users);
    }
    catch (error) {
        console.error(error);
        res.status(400).json({ error: 'Error al buscar usuarios' });
    }
});
exports.getUsers = getUsers;
const editUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //obtenemos el id para identificar el usuario que vamos a editar 
        const { id } = req.params;
        console.log("Id recibido:", id);
        //quiero poder acceder al cuerpo del request 
        const { name, email, password } = req.body;
        //quiero decirle que el nuevo cuerpo debe de tener email, name y password si o si
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Datos incompletos' });
        }
        const updatedInfo = yield prisma.users.update({
            where: { id: parseInt(id) },
            data: {
                name,
                email,
                password,
            },
        });
        console.log("Informacion de usuario actualizada:", updatedInfo);
        res.status(200).json({ "Usuario actualizado correctamente": updatedInfo });
    }
    catch (error) {
        console.error("Error al actualizar cambios", error);
        return res.status(400).json({ "Error al hacer cambios": error });
    }
});
exports.editUser = editUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { identifier } = req.params;
        // Verifica si el identifier es un número
        const id = parseInt(identifier);
        if (!isNaN(id)) {
            // Si es un número, elimina el usuario por ID
            const eliminarUser = yield prisma.users.delete({
                where: { id: id },
            });
            console.log("Usuario fue eliminado", eliminarUser);
            return res.status(200).json({ "Usuario eliminado": eliminarUser });
        }
        else {
            // Si no es un número, se asume que es un nombre
            const eliminarUser = yield prisma.users.deleteMany({
                where: { name: identifier },
            });
            console.log("Usuario fue eliminado", eliminarUser);
            return res.status(200).json({ "Usuarios eliminados": eliminarUser });
        }
    }
    catch (error) {
        console.error("Error al tratar de eliminar usuario", error);
        return res.status(404).json({ "Usuario no encontrado o error": error });
    }
});
exports.deleteUser = deleteUser;
