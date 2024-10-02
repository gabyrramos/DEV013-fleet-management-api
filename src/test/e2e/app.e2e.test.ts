import request from 'supertest';
import express, { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { jwtMiddleware, isAuthenticated, isAdmin, requireAuth, requireAdmin } from '../../middleware/authorization';

const app = express();
app.use(express.json());

const secretKey = 'test_secret_key';

// Ruta protegida que requiere autenticación
app.get('/protected', jwtMiddleware(secretKey), requireAuth, (req: Request, res: Response) => {
    res.status(200).json({ message: 'Acceso concedido a ruta protegida' });
});

// Ruta protegida que requiere que el usuario sea admin
app.get('/admin', jwtMiddleware(secretKey), requireAdmin, (req: Request, res: Response) => {
    res.status(200).json({ message: 'Acceso concedido a ruta de administrador' });
});

describe('Middleware Tests', () => {
    let userToken: string;
    let adminToken: string;

    beforeAll(() => {
        // Creamos un token de usuario normal y un token de administrador
        userToken = jwt.sign({ id: 1, email: 'user@test.com', role: 'user' }, secretKey, { expiresIn: '1h' });
        adminToken = jwt.sign({ id: 2, email: 'admin@test.com', role: 'admin' }, secretKey, { expiresIn: '1h' });
    });

    it('should return 401 if no authorization header is provided for a protected route', async () => {
        const response = await request(app).get('/protected');
        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Falta el token de autorización');
    });

    it('should return 400 if token format is incorrect', async () => {
        const response = await request(app)
            .get('/protected')
            .set('Authorization', `Basic ${userToken}`);
        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Formato de token incorrecto');
    });

    it('should return 403 if token is invalid', async () => {
        const response = await request(app)
            .get('/protected')
            .set('Authorization', `Bearer invalid_token`);
        expect(response.status).toBe(403);
        expect(response.body.message).toBe('No tienes permiso para acceder');
    });

    it('should allow access to a protected route with a valid token', async () => {
        const response = await request(app)
            .get('/protected')
            .set('Authorization', `Bearer ${userToken}`);
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Acceso concedido a ruta protegida');
    });

    it('should return 403 if non-admin user tries to access an admin route', async () => {
        const response = await request(app)
            .get('/admin')
            .set('Authorization', `Bearer ${userToken}`);
        expect(response.status).toBe(403);
        expect(response.body.message).toBe('Acceso restringido: no eres administrador');
    });

    it('should allow access to an admin route with a valid admin token', async () => {
        const response = await request(app)
            .get('/admin')
            .set('Authorization', `Bearer ${adminToken}`);
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Acceso concedido a ruta de administrador');
    });
});

