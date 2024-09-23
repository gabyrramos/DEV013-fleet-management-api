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
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma = new client_1.PrismaClient();
describe('User Endpoints', () => {
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.users.deleteMany({});
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.$disconnect();
    }));
    describe('POST /users', () => {
        it('should create a new user', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app_1.default)
                .post('/users')
                .send({
                name: 'John Doe',
                email: 'john@example.com',
                password: 'password123',
                role: 'user'
            });
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('email', 'john@example.com');
        }));
        it('should return 400 if required fields are missing', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app_1.default)
                .post('/users')
                .send({
                name: 'John Doe',
                email: ''
            });
            expect(res.statusCode).toEqual(400);
            expect(res.body).toHaveProperty('error', 'Nombre o email invalido');
        }));
        it('should return 409 if email already exists', () => __awaiter(void 0, void 0, void 0, function* () {
            // Crear usuario inicial
            yield prisma.users.create({
                data: {
                    name: 'Jane Doe',
                    email: 'jane@example.com',
                    password: yield bcrypt_1.default.hash('password123', 5),
                    role: 'user'
                }
            });
            const res = yield (0, supertest_1.default)(app_1.default)
                .post('/users')
                .send({
                name: 'Jane Doe',
                email: 'jane@example.com',
                password: 'password123',
                role: 'user'
            });
            expect(res.statusCode).toEqual(409);
            expect(res.body).toHaveProperty('error', 'El correo electronico ya existe');
        }));
    });
    describe('GET /users', () => {
        it('should fetch all users', () => __awaiter(void 0, void 0, void 0, function* () {
            yield prisma.users.create({
                data: {
                    name: 'John Doe',
                    email: 'john@example.com',
                    password: yield bcrypt_1.default.hash('password123', 5),
                    role: 'user'
                }
            });
            const res = yield (0, supertest_1.default)(app_1.default).get('/users');
            expect(res.statusCode).toEqual(200);
            expect(res.body.length).toBeGreaterThan(0);
            expect(res.body[0]).toHaveProperty('email', 'john@example.com');
        }));
    });
    describe('PUT /users/:id', () => {
        it('should update a user', () => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield prisma.users.create({
                data: {
                    name: 'John Doe',
                    email: 'john@example.com',
                    password: yield bcrypt_1.default.hash('password123', 5),
                    role: 'user'
                }
            });
            const res = yield (0, supertest_1.default)(app_1.default)
                .put(`/users/${user.id}`)
                .send({
                name: 'John Updated',
                email: 'johnupdated@example.com',
                password: 'newpassword123',
                role: 'admin'
            });
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('Usuario actualizado correctamente');
            expect(res.body['Usuario actualizado correctamente']).toHaveProperty('email', 'johnupdated@example.com');
        }));
        it('should return 400 if required fields are missing', () => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield prisma.users.create({
                data: {
                    name: 'John Doe',
                    email: 'john@example.com',
                    password: yield bcrypt_1.default.hash('password123', 5),
                    role: 'user'
                }
            });
            const res = yield (0, supertest_1.default)(app_1.default)
                .put(`/users/${user.id}`)
                .send({
                name: '',
                email: '',
                password: 'newpassword123',
                role: 'admin'
            });
            expect(res.statusCode).toEqual(400);
            expect(res.body).toHaveProperty('error', 'Datos incompletos');
        }));
    });
    describe('DELETE /users/:identifier', () => {
        it('should delete a user by ID', () => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield prisma.users.create({
                data: {
                    name: 'John Doe',
                    email: 'john@example.com',
                    password: yield bcrypt_1.default.hash('password123', 5),
                    role: 'user'
                }
            });
            const res = yield (0, supertest_1.default)(app_1.default).delete(`/users/${user.id}`);
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('Usuario eliminado');
        }));
        it('should delete users by name', () => __awaiter(void 0, void 0, void 0, function* () {
            yield prisma.users.createMany({
                data: [
                    { name: 'John Doe', email: 'john@example.com', password: yield bcrypt_1.default.hash('password123', 5), role: 'user' },
                    { name: 'John Doe', email: 'john2@example.com', password: yield bcrypt_1.default.hash('password123', 5), role: 'user' }
                ]
            });
            const res = yield (0, supertest_1.default)(app_1.default).delete(`/users/John Doe`);
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('Usuario eliminado');
            expect(res.body['Usuario eliminado'].count).toBe(2);
        }));
        it('should return 404 if user is not found', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app_1.default).delete(`/users/9999`);
            expect(res.statusCode).toEqual(404);
            expect(res.body).toHaveProperty('Usuario no encontrado o error');
        }));
    });
});
