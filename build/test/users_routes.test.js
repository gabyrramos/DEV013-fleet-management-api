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
const app_1 = __importDefault(require("../app"));
const client_1 = require("@prisma/client");
// Mock de PrismaClient
jest.mock('@prisma/client', () => {
    const mockPrisma = {
        users: {
            create: jest.fn(),
            findMany: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            findUnique: jest.fn(),
        },
    };
    return { PrismaClient: jest.fn(() => mockPrisma) };
});
const mockPrisma = new client_1.PrismaClient();
describe('Users Routes', () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Limpia los mocks antes de cada prueba
    });
    // Test para crear un nuevo usuario
    it('should create a user on POST /api/users', () => __awaiter(void 0, void 0, void 0, function* () {
        const newUser = { name: 'John Doe', email: 'john@example.com', password: 'password', role: 'user' };
        mockPrisma.users.create.mockResolvedValue(newUser);
        const res = yield (0, supertest_1.default)(app_1.default)
            .post('/api/users')
            .send(newUser);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toMatchObject(newUser);
    }));
    // Test para obtener todos los usuarios
    it('should return all users on GET /api/users', () => __awaiter(void 0, void 0, void 0, function* () {
        const mockUsers = [
            { id: 1, name: 'John Doe', email: 'john@example.com', role: 'user' },
            { id: 2, name: 'Jane Doe', email: 'jane@example.com', role: 'admin' },
        ];
        mockPrisma.users.findMany.mockResolvedValue(mockUsers);
        const res = yield (0, supertest_1.default)(app_1.default).get('/api/users');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveLength(2);
        expect(res.body[0]).toHaveProperty('name', 'John Doe');
    }));
    // Test para editar un usuario
    it('should update a user on PUT /api/users/:id', () => __awaiter(void 0, void 0, void 0, function* () {
        const updatedUser = { name: 'John Smith', email: 'johnsmith@example.com', role: 'user' };
        mockPrisma.users.update.mockResolvedValue(Object.assign({ id: 1 }, updatedUser));
        const res = yield (0, supertest_1.default)(app_1.default)
            .put('/api/users/1')
            .send(updatedUser);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('Usuario actualizado correctamente');
        expect(res.body['Usuario actualizado correctamente']).toMatchObject(Object.assign({ id: 1 }, updatedUser));
    }));
    // Test para eliminar un usuario
    it('should delete a user on DELETE /api/users/:identifier', () => __awaiter(void 0, void 0, void 0, function* () {
        const deletedUser = { id: 1, name: 'John Doe' };
        mockPrisma.users.delete.mockResolvedValue(deletedUser);
        const res = yield (0, supertest_1.default)(app_1.default).delete('/api/users/1');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('Usuario eliminado');
        expect(res.body['Usuario eliminado']).toMatchObject(deletedUser);
    }));
});
