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
const app_1 = __importDefault(require("../app")); // Importamos la app principal
const db_1 = __importDefault(require("../db"));
// Mockeamos PrismaClient y las rutas
jest.mock('../db', () => ({
    users: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
    },
    taxis: {
        findMany: jest.fn(),
    },
    trajectories: {
        findMany: jest.fn(),
    },
}));
jest.mock('@prisma/client', () => ({
    PrismaClient: jest.fn().mockImplementation(() => ({
        users: { findUnique: jest.fn(), findMany: jest.fn() },
        taxis: { findMany: jest.fn() },
        trajectories: { findMany: jest.fn() },
    })),
}));
describe('App', () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Limpia todos los mocks antes de cada prueba
    });
    it('should return 200 on login route', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .post('/login')
            .send({ email: 'admin@localhost', password: '12345' });
        expect(res.statusCode).toEqual(200);
        expect(res.text).toBeTruthy(); // Debe devolver el token
    }));
    it('should return 401 if no token is provided for protected routes', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).get('/api/users');
        expect(res.statusCode).toEqual(401);
        expect(res.body).toHaveProperty('message', 'Falta el token de autorización');
    }));
    it('should return 403 if not admin user for admin-protected routes', () => __awaiter(void 0, void 0, void 0, function* () {
        const token = 'invalid_admin_token'; // Un token no válido
        const res = yield (0, supertest_1.default)(app_1.default)
            .get('/api/users')
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toEqual(403);
        expect(res.body).toHaveProperty('message', 'No tienes permiso para acceder');
    }));
    it('should return 200 on taxis route', () => __awaiter(void 0, void 0, void 0, function* () {
        db_1.default.taxi.findMany.mockResolvedValue([
            { id: 1, name: 'Taxi 1' },
            { id: 2, name: 'Taxi 2' },
        ]);
        const res = yield (0, supertest_1.default)(app_1.default).get('/api/taxis');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveLength(2);
        expect(res.body[0]).toHaveProperty('name', 'Taxi 1');
    }));
    it('should return 200 on trajectories route', () => __awaiter(void 0, void 0, void 0, function* () {
        db_1.default.trajectory.findMany.mockResolvedValue([
            { id: 1, taxi_id: 1, date: '2023-09-22', latitude: 40.7128, longitude: -74.0060 },
        ]);
        const res = yield (0, supertest_1.default)(app_1.default).get('/api/trajectories');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveLength(1);
        expect(res.body[0]).toHaveProperty('taxi_id', 1);
    }));
    it('should return 200 on user route if authenticated as admin', () => __awaiter(void 0, void 0, void 0, function* () {
        const adminToken = 'valid_admin_token'; // Simulamos un token de admin válido
        db_1.default.users.findMany.mockResolvedValue([
            { id: 1, name: 'Admin', email: 'admin@localhost' },
        ]);
        const res = yield (0, supertest_1.default)(app_1.default)
            .get('/api/users')
            .set('Authorization', `Bearer ${adminToken}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveLength(1);
        expect(res.body[0]).toHaveProperty('name', 'Admin');
    }));
    it('should return 404 for unknown routes', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).get('/unknown_route');
        expect(res.statusCode).toEqual(404);
    }));
});
