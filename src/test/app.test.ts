import request from 'supertest';
import app from '../app'; // Importamos la app principal
import prisma from '../db';
import { PrismaClient } from '@prisma/client';

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

    it('should return 200 on login route', async () => {
        const res = await request(app)
            .post('/login')
            .send({ email: 'admin@localhost', password: '12345' });

        expect(res.statusCode).toEqual(200);
        expect(res.text).toBeTruthy(); // Debe devolver el token
    });

    it('should return 401 if no token is provided for protected routes', async () => {
        const res = await request(app).get('/api/users');
        expect(res.statusCode).toEqual(401);
        expect(res.body).toHaveProperty('message', 'Falta el token de autorización');
    });

    it('should return 403 if not admin user for admin-protected routes', async () => {
        const token = 'invalid_admin_token'; // Un token no válido
        const res = await request(app)
            .get('/api/users')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(403);
        expect(res.body).toHaveProperty('message', 'No tienes permiso para acceder');
    });

    it('should return 200 on taxis route', async () => {
        (prisma.taxi.findMany as jest.Mock).mockResolvedValue([
            { id: 1, name: 'Taxi 1' },
            { id: 2, name: 'Taxi 2' },
        ]);

        const res = await request(app).get('/api/taxis');

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveLength(2);
        expect(res.body[0]).toHaveProperty('name', 'Taxi 1');
    });

    it('should return 200 on trajectories route', async () => {
        (prisma.trajectory.findMany as jest.Mock).mockResolvedValue([
            { id: 1, taxi_id: 1, date: '2023-09-22', latitude: 40.7128, longitude: -74.0060 },
        ]);

        const res = await request(app).get('/api/trajectories');

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveLength(1);
        expect(res.body[0]).toHaveProperty('taxi_id', 1);
    });

    it('should return 200 on user route if authenticated as admin', async () => {
        const adminToken = 'valid_admin_token'; // Simulamos un token de admin válido

        (prisma.users.findMany as jest.Mock).mockResolvedValue([
            { id: 1, name: 'Admin', email: 'admin@localhost' },
        ]);

        const res = await request(app)
            .get('/api/users')
            .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveLength(1);
        expect(res.body[0]).toHaveProperty('name', 'Admin');
    });

    it('should return 404 for unknown routes', async () => {
        const res = await request(app).get('/unknown_route');
        expect(res.statusCode).toEqual(404);
    });
});
