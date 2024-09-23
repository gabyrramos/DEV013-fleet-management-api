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
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app")); // Asegúrate de que tu app esté exportada
const db_1 = __importDefault(require("../db"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Simulamos un usuario existente para los tests
const secretKey = 'secret_key';
const adminUser = {
    id: 1,
    email: 'admin@localhost',
    password: 'hashed_password', // Cambia esto según el hash generado en la DB
    role: 'user',
};
// Mockeamos las funciones de prisma y bcrypt
jest.mock('../db', () => ({
    users: {
        findUnique: jest.fn(),
    },
}));
jest.mock('bcrypt', () => ({
    compare: jest.fn(),
}));
describe('Login Function', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('should return 400 if email and password are not provided', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .post('/login')
            .send({});
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('message', 'Los datos son invalidos');
    }));
    it('should return 404 if user does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
        db_1.default.users.findUnique.mockResolvedValue(null);
        const res = yield (0, supertest_1.default)(app_1.default)
            .post('/login')
            .send({ email: adminUser.email, password: '12345' });
        expect(res.statusCode).toEqual(404);
        expect(res.body).toHaveProperty('message', 'No existe un usuario con esos datos');
    }));
    it('should return 404 if password is incorrect', () => __awaiter(void 0, void 0, void 0, function* () {
        db_1.default.users.findUnique.mockResolvedValue(adminUser);
        bcrypt_1.default.compare.mockResolvedValue(false);
        const res = yield (0, supertest_1.default)(app_1.default)
            .post('/login')
            .send({ email: adminUser.email, password: 'incorrect_password' });
        expect(res.statusCode).toEqual(404);
        expect(res.body).toHaveProperty('message', 'Contraseña incorrecta');
    }));
    it('should return 200 and a token if login is successful', () => __awaiter(void 0, void 0, void 0, function* () {
        db_1.default.users.findUnique.mockResolvedValue(adminUser);
        bcrypt_1.default.compare.mockResolvedValue(true);
        const res = yield (0, supertest_1.default)(app_1.default)
            .post('/login')
            .send({ email: adminUser.email, password: '12345' });
        expect(res.statusCode).toEqual(200);
        const token = res.text; // El token está en el cuerpo de la respuesta
        expect(token).toBeTruthy();
        // Verificamos que el token sea válido
        const decodedToken = jsonwebtoken_1.default.verify(token, secretKey);
        expect(decodedToken).toHaveProperty('id', adminUser.id);
        expect(decodedToken).toHaveProperty('email', adminUser.email);
        expect(decodedToken).toHaveProperty('role', adminUser.role);
    }));
    it('should return 500 if something goes wrong during login', () => __awaiter(void 0, void 0, void 0, function* () {
        db_1.default.users.findUnique.mockRejectedValue(new Error('DB error'));
        const res = yield (0, supertest_1.default)(app_1.default)
            .post('/login')
            .send({ email: adminUser.email, password: '12345' });
        expect(res.statusCode).toEqual(500);
        expect(res.body).toHaveProperty('message', 'Algo salio mal');
    }));
});
