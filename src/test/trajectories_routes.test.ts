import request from 'supertest';
import app from '../app'; 
import { PrismaClient } from '@prisma/client';

// Mock de PrismaClient
jest.mock('@prisma/client', () => {
    const mockPrisma = {
        trajectories: {
            findMany: jest.fn(),
            count: jest.fn(),
        },
    };
    return { PrismaClient: jest.fn(() => mockPrisma) };
});

const mockPrisma = new PrismaClient();

describe('Trajectories Routes', () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Limpia los mocks antes de cada prueba
    });

    // Test para obtener todas las trayectorias
    it('should return all trajectories on GET /api/trajectories', async () => {
        const mockTrajectories = [
            { id: 1, taxi_id: 1, date: new Date(), latitude: 40.7128, longitude: -74.0060 },
            { id: 2, taxi_id: 2, date: new Date(), latitude: 34.0522, longitude: -118.2437 },
        ];

        (mockPrisma.trajectory.findMany as jest.Mock).mockResolvedValue(mockTrajectories);

        const res = await request(app).get('/api/trajectories');

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveLength(2);
        expect(res.body[0]).toHaveProperty('taxi_id', 1);
    });

    // Test para filtrar trayectorias
    it('should filter trajectories on GET /api/trajectories/filter', async () => {
        const filteredTrajectories = [
            { id: 3, taxi_id: 1, date: new Date(), latitude: 40.7128, longitude: -74.0060 },
        ];

        (mockPrisma.trajectory.findMany as jest.Mock).mockResolvedValue(filteredTrajectories);

        const res = await request(app).get('/api/trajectories/filter').query({
            taxi_id: 1,
            date: new Date().toISOString(),
        });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveLength(1);
        expect(res.body[0]).toHaveProperty('taxi_id', 1);
    });

    // Test para exportar trayectorias
    it('should export trajectories on GET /api/trajectories/export', async () => {
        // Simulamos la exportación aquí, ajusta según tu lógica de exportación
        const res = await request(app).get('/api/trajectories/export');

        expect(res.statusCode).toEqual(200);
        expect(res.headers['content-type']).toMatch(/application\/json/); // Cambia según el formato de exportación
    });
});
