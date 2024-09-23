import request from 'supertest';
import app from '../../app'; // Ajusta la ruta según tu estructura de archivos
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

let token: string;

describe('E2E Tests', () => {
    // Configuración inicial
    beforeAll(async () => {
    });
    afterAll(async () => {
        await prisma.$disconnect();
    });

    // Prueba para el login
    it('should login and return a token', async () => {
        const res = await request(app)
            .post('/login')
            .send({ email: 'admin@localhost', password: '12345' });
        
        expect(res.statusCode).toEqual(200);
        expect(res.text).toBeTruthy(); // Debe devolver el token
    });

    // Prueba para obtener taxis
    it('should get all taxis', async () => {
        const res = await request(app)
            .get('/api/taxis')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toBeInstanceOf(Array); // Debe devolver un array
    });

    // Prueba para filtrar taxis
    it('should filter taxis', async () => {
        const res = await request(app)
            .get('/api/taxis/filter')
            .set('Authorization', `Bearer ${token}`); 

        expect(res.statusCode).toEqual(200);
    });

    // Prueba para obtener trayectorias
    it('should get all trajectories', async () => {
        const res = await request(app)
            .get('/api/trajectories')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toBeInstanceOf(Array); // Debe devolver un array
    });

    // Prueba para exportar trayectorias
    it('should export trajectories', async () => {
        const res = await request(app)
            .get('/api/trajectories/export?taxi_id=1&date=2024-09-22&email=test@example.com')
            .set('Authorization', `Bearer ${token}`); // Usa un token válido

        expect(res.statusCode).toEqual(200);
        expect(res.header['content-type']).toEqual('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    });
});
