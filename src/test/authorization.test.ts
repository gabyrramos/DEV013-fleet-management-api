import request from 'supertest';
import app from '../app'; // Asegúrate de que tu app esté exportada
import jwt from 'jsonwebtoken';

const secretKey = 'test_secret_key'; // Cambia esto por tu clave secreta de prueba

// Simulando un usuario y token
const user = {
    id: 1,
    email: 'test@example.com',
    role: 'admin',
};
const token = jwt.sign(user, secretKey);

describe('Authentication Middleware', () => {
    
    describe('JWT Middleware', () => {
        it('should return 401 if no authorization header is provided', async () => {
            const res = await request(app).get('/protected-endpoint');
            expect(res.statusCode).toEqual(401);
            expect(res.body).toHaveProperty('message', 'Falta el token de autorización');
        });

        it('should return 400 if the token format is incorrect', async () => {
            const res = await request(app)
                .get('/protected-endpoint')
                .set('Authorization', 'InvalidToken');
            expect(res.statusCode).toEqual(400);
            expect(res.body).toHaveProperty('message', 'Formato de token incorrecto');
        });

        it('should return 403 if the token is invalid', async () => {
            const res = await request(app)
                .get('/protected-endpoint')
                .set('Authorization', 'Bearer invalid_token');
            expect(res.statusCode).toEqual(403);
            expect(res.body).toHaveProperty('message', 'No tienes permiso para acceder');
        });

        it('should allow access to a protected endpoint with a valid token', async () => {
            const res = await request(app)
                .get('/protected-endpoint')
                .set('Authorization', `Bearer ${token}`);
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('message', 'Acceso concedido'); // Cambia esto según tu lógica
        });
    });

    describe('isAuthenticated Middleware', () => {
        it('should return 401 if user is not authenticated', async () => {
            const res = await request(app).get('/protected-endpoint');
            expect(res.statusCode).toEqual(401);
            expect(res.body).toHaveProperty('message', 'Falta el token de autorización');
        });

        it('should allow access if user is authenticated', async () => {
            const res = await request(app)
                .get('/protected-endpoint')
                .set('Authorization', `Bearer ${token}`);
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('message', 'Acceso concedido'); // Cambia esto según tu lógica
        });
    });

    describe('isAdmin Middleware', () => {
        it('should return 403 if user is not an admin', async () => {
            const nonAdminUser = {
                id: 2,
                email: 'nonadmin@example.com',
                role: 'user',
            };
            const nonAdminToken = jwt.sign(nonAdminUser, secretKey);

            const res = await request(app)
                .get('/admin-endpoint')
                .set('Authorization', `Bearer ${nonAdminToken}`);
            expect(res.statusCode).toEqual(403);
            expect(res.body).toHaveProperty('message', 'Acceso restringido: no eres administrador');
        });

        it('should allow access if user is an admin', async () => {
            const res = await request(app)
                .get('/admin-endpoint')
                .set('Authorization', `Bearer ${token}`);
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('message', 'Acceso concedido'); // Cambia esto según tu lógica
        });
    });
});
