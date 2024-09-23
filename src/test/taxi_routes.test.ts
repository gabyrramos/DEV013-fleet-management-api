import request from 'supertest';
import app from '../app'; 
import { PrismaClient } from '@prisma/client';

// Mockeamos PrismaClient y sus métodos
jest.mock('@prisma/client', () => {
    const mockPrisma = {
        taxis: {
            findMany: jest.fn(),
        },
        trajectories: {
            findMany: jest.fn(),
        },
    };
    return { PrismaClient: jest.fn(() => mockPrisma) };
});

const mockPrisma = new PrismaClient();

describe('Taxis Routes', () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Limpia los mocks antes de cada prueba
    });

    // Test para la ruta de obtener todos los taxis
    it('should return all taxis on GET /api/taxis', async () => {
        const mockTaxis = [
            { id: 1, name: 'Taxi 1', registration_number: 'ABC123' },
            { id: 2, name: 'Taxi 2', registration_number: 'DEF456' },
        ];

        // Mockeamos la respuesta de la base de datos
        (mockPrisma.taxi.findMany as jest.Mock).mockResolvedValue(mockTaxis);

        const res = await request(app).get('/api/taxis');

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveLength(2);
        expect(res.body[0]).toHaveProperty('name', 'Taxi 1');
        expect(res.body[0]).toHaveProperty('registration_number', 'ABC123');
    });

    // Test para la ruta de filtro de taxis
    it('should return filtered taxis on GET /api/taxis/filter', async () => {
        const filteredTaxis = [
            { id: 3, name: 'Filtered Taxi', registration_number: 'XYZ789' },
        ];

        // Mockeamos la respuesta de la base de datos
        (mockPrisma.taxi.findMany as jest.Mock).mockResolvedValue(filteredTaxis);

        const res = await request(app).get('/api/taxis/filter').query({
            registration_number: 'XYZ789',
        });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveLength(1);
        expect(res.body[0]).toHaveProperty('name', 'Filtered Taxi');
        expect(res.body[0]).toHaveProperty('registration_number', 'XYZ789');
    });

    // Test para obtener las últimas trayectorias de los taxis
    it('should return last trajectories on GET /api/taxis/lastTrajectories', async () => {
        const mockLastTrajectories = [
            { taxi_id: 1, date: '2023-09-22', latitude: 40.7128, longitude: -74.0060 },
        ];

        // Mockeamos la respuesta de la base de datos
        (mockPrisma.trajectory.findMany as jest.Mock).mockResolvedValue(mockLastTrajectories);

        const res = await request(app).get('/api/taxis/lastTrajectories');

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveLength(1);
        expect(res.body[0]).toHaveProperty('taxi_id', 1);
        expect(res.body[0]).toHaveProperty('date', '2023-09-22');
        expect(res.body[0]).toHaveProperty('latitude', 40.7128);
        expect(res.body[0]).toHaveProperty('longitude', -74.0060);
    });
});
