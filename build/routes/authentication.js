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
exports.loginFunction = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = __importDefault(require("../db"));
const bcrypt = require('bcrypt');
const loginFunction = (app) => {
    const secretKey = 'secret_key';
    //   const adminUser = {
    //       id: 1,
    //       email: 'admin@localhost',
    //     password: '12345',
    //       role: 'user'
    //    };
    //const hashedPassword = bcrypt.hashSync(user.password, 10);
    app.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { email, password } = req.body;
            if (!email && !password) {
                return res.status(400).json({ message: 'Los datos son invalidos' });
            }
            const admin = yield db_1.default.users.findUnique({
                where: { email },
            });
            if (!admin) {
                console.error("No se encontro el usuario");
                return res.status(404).json({ message: "No existe un usuario con esos datos" });
            }
            ;
            //aqui validamos la contraseña
            const validateAdmin = yield bcrypt.compare(password, admin.password);
            console.log("Admin validado", validateAdmin);
            if (!validateAdmin) {
                return res.status(404).json({ message: "Contraseña incorrecta" });
            }
            // Generamos token
            const token = jsonwebtoken_1.default.sign({ id: admin.id, email: admin.email, role: admin.role }, secretKey, { expiresIn: '1h' });
            console.log('Generando token:', token);
            return res.status(200).send(token);
        }
        catch (error) {
            console.error("No se pudo generar token", error);
            return res.status(500).json({ message: "Algo salio mal" });
        }
    }));
};
exports.loginFunction = loginFunction;
