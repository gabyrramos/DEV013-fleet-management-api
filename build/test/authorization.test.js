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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secretKey = 'test_secret_key';
// Simulando un usuario y token
const user = {
    id: 1,
    email: 'test@example.com',
    role: 'admin',
};
const token = jsonwebtoken_1.default.sign(user, secretKey);
describe('Authentication Middleware', () => {
    describe('JWT Middleware', () => {
        it('should return 401 if no authorization header is provided', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app_1.default).get('/protected-endpoint');
            expect(res.statusCode).toEqual(401);
            expect(res.body).toHaveProperty('message', 'Falta el token de autorización');
        }));
        it('should return 400 if the token format is incorrect', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app_1.default)
                .get('/protected-endpoint')
                .set('Authorization', 'InvalidToken');
            expect(res.statusCode).toEqual(400);
            expect(res.body).toHaveProperty('message', 'Formato de token incorrecto');
        }));
        it('should return 403 if the token is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app_1.default)
                .get('/protected-endpoint')
                .set('Authorization', 'Bearer invalid_token');
            expect(res.statusCode).toEqual(403);
            expect(res.body).toHaveProperty('message', 'No tienes permiso para acceder');
        }));
        it('should allow access to a protected endpoint with a valid token', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app_1.default)
                .get('/protected-endpoint')
                .set('Authorization', `Bearer ${token}`);
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('message', 'Acceso concedido'); // Cambia esto según tu lógica
        }));
    });
    describe('isAuthenticated Middleware', () => {
        it('should return 401 if user is not authenticated', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app_1.default).get('/protected-endpoint');
            expect(res.statusCode).toEqual(401);
            expect(res.body).toHaveProperty('message', 'Falta el token de autorización');
        }));
        it('should allow access if user is authenticated', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app_1.default)
                .get('/protected-endpoint')
                .set('Authorization', `Bearer ${token}`);
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('message', 'Acceso concedido'); // Cambia esto según tu lógica
        }));
    });
    describe('isAdmin Middleware', () => {
        it('should return 403 if user is not an admin', () => __awaiter(void 0, void 0, void 0, function* () {
            const nonAdminUser = {
                id: 2,
                email: 'nonadmin@example.com',
                role: 'user',
            };
            const nonAdminToken = jsonwebtoken_1.default.sign(nonAdminUser, secretKey);
            const res = yield (0, supertest_1.default)(app_1.default)
                .get('/admin-endpoint')
                .set('Authorization', `Bearer ${nonAdminToken}`);
            expect(res.statusCode).toEqual(403);
            expect(res.body).toHaveProperty('message', 'Acceso restringido: no eres administrador');
        }));
        it('should allow access if user is an admin', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app_1.default)
                .get('/admin-endpoint')
                .set('Authorization', `Bearer ${token}`);
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('message', 'Acceso concedido'); // Cambia esto según tu lógica
        }));
    });
});
