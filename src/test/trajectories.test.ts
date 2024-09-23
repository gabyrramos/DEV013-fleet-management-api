import request from 'supertest';
import app from '../app'; // Asegúrate de tener tu app exportada
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Trajectory Endpoints', () => {
    
    // Limpiar la base de datos antes de cada test
    beforeEach(async () => {
        await prisma.trajectory.deleteMany({});
        await prisma.taxi.deleteMany({});
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    describe('GET /trajectories', () => {
        it('should fetch all trajectories with pagination', async () => {
            // Preparar datos
            const taxi = await prisma.taxi.create({
                data: { plate: 'ABC123' }
            });

            await prisma.trajectory.createMany({
                data: [
                    { taxi_id: taxi.id, date: new Date(), latitude: 40.7128, longitude: -74.0060 },
                    { taxi_id: taxi.id, date: new Date(), latitude: 40.7128, longitude: -74.0060 }
                ]
            });

            const res = await request(app).get('/trajectories?page=1&size=2');
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('data');
            expect(res.body.data.length).toEqual(2);
        });

        it('should return error for invalid pagination parameters', async () => {
            const res = await request(app).get('/trajectories?page=invalid&size=10');
            expect(res.statusCode).toEqual(400);
            expect(res.body).toHaveProperty('Page or limit is not valid');
        });
    });

    describe('GET /trajectories/filter', () => {
        it('should filter trajectories by taxi_id and date', async () => {
            // Insertar datos para la prueba
            const taxi = await prisma.taxi.create({
                data: { plate: 'XYZ789' }
            });

            const date = new Date();

            await prisma.trajectory.createMany({
                data: [
                    { taxi_id: taxi.id, date, latitude: 40.7128, longitude: -74.0060 },
                    { taxi_id: taxi.id, date, latitude: 40.7128, longitude: -74.0060 }
                ]
            });

            const res = await request(app)
                .get(`/trajectories/filter?search=${taxi.id}&date=${date.toISOString()}&page=1&size=2`);

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('data');
            expect(res.body.data.length).toEqual(2);
        });

        it('should return error if search and date are missing', async () => {
            const res = await request(app).get('/trajectories/filter');
            expect(res.statusCode).toEqual(400);
            expect(res.body).toHaveProperty('error', 'Se necesitan parametros para realizar busqueda de trajectorias');
        });
    });
});
