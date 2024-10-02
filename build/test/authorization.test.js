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
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authorization_1 = require("../middleware/authorization");
const app = (0, express_1.default)();
app.use(express_1.default.json());
const secretKey = 'test_secret_key';
// Ruta protegida que requiere autenticación
app.get('/protected', (0, authorization_1.jwtMiddleware)(secretKey), authorization_1.isAuthenticated, (req, res) => {
    res.status(200).json({ message: 'Acceso concedido' });
});
// Ruta protegida que requiere que el usuario sea admin
app.get('/admin', (0, authorization_1.jwtMiddleware)(secretKey), authorization_1.isAdmin, (req, res) => {
    res.status(200).json({ message: 'Acceso como administrador' });
});
describe('Middleware Tests', () => {
    let userToken;
    let adminToken;
    beforeAll(() => {
        // Creamos un token de usuario normal y un token de administrador
        userToken = jsonwebtoken_1.default.sign({ id: 1, email: 'user@test.com', role: 'user' }, secretKey, { expiresIn: '1h' });
        adminToken = jsonwebtoken_1.default.sign({ id: 2, email: 'admin@test.com', role: 'admin' }, secretKey, { expiresIn: '1h' });
    });
    it('should return 401 if no authorization header is provided', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get('/protected');
        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Falta el token de autorización');
    }));
    it('should return 400 if token format is incorrect', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .get('/protected')
            .set('Authorization', `Basic ${userToken}`);
        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Formato de token incorrecto');
    }));
    it('should return 403 if token is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .get('/protected')
            .set('Authorization', `Bearer invalid_token`);
        expect(response.status).toBe(403);
        expect(response.body.message).toBe('No tienes permiso para acceder');
    }));
    it('should allow access with a valid token', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .get('/protected')
            .set('Authorization', `Bearer ${userToken}`);
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Acceso concedido');
    }));
    it('should return 403 if non-admin user tries to access admin route', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .get('/admin')
            .set('Authorization', `Bearer ${userToken}`);
        expect(response.status).toBe(403);
        expect(response.body.message).toBe('Acceso restringido: no eres administrador');
    }));
    it('should allow access to admin route with a valid admin token', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .get('/admin')
            .set('Authorization', `Bearer ${adminToken}`);
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Acceso como administrador');
    }));
});
