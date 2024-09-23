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
const app_1 = __importDefault(require("../../app")); // Ajusta la ruta según tu estructura de archivos
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
let token;
describe('E2E Tests', () => {
    // Configuración inicial
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.$disconnect();
    }));
    // Prueba para el login
    it('should login and return a token', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .post('/login')
            .send({ email: 'admin@localhost', password: '12345' });
        expect(res.statusCode).toEqual(200);
        expect(res.text).toBeTruthy(); // Debe devolver el token
    }));
    // Prueba para obtener taxis
    it('should get all taxis', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .get('/api/taxis')
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toBeInstanceOf(Array); // Debe devolver un array
    }));
    // Prueba para filtrar taxis
    it('should filter taxis', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .get('/api/taxis/filter')
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toEqual(200);
    }));
    // Prueba para obtener trayectorias
    it('should get all trajectories', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .get('/api/trajectories')
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toBeInstanceOf(Array); // Debe devolver un array
    }));
    // Prueba para exportar trayectorias
    it('should export trajectories', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .get('/api/trajectories/export?taxi_id=1&date=2024-09-22&email=test@example.com')
            .set('Authorization', `Bearer ${token}`); // Usa un token válido
        expect(res.statusCode).toEqual(200);
        expect(res.header['content-type']).toEqual('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    }));
});
