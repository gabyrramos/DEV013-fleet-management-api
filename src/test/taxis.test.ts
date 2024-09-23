import request from 'supertest';
import app from '../app';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

describe('Taxi Endpoints', () => {

  // Mock para limpiar la base de datos antes de cada test
  beforeEach(async () => {
    await prisma.taxi.deleteMany({});
    await prisma.trajectory.deleteMany({});
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('GET /taxis', () => {
    it('should fetch all taxis with pagination', async () => {
      // Preparar los datos
      await prisma.taxi.createMany({
        data: [
          { id: 1, plate: 'ABC123' },
          { id: 2, plate: 'XYZ789' }
        ]
      });

      const res = await request(app).get('/taxis?page=1&size=2');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('data');
      expect(res.body.data.length).toEqual(2);
    });

    it('should return error for invalid pagination parameters', async () => {
      const res = await request(app).get('/taxis?page=invalid&size=10');
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('Page or limit is not valid');
    });
  });

  describe('GET /taxis/filter', () => {
    it('should filter taxis by id or plate', async () => {
      // Insertar taxis
      await prisma.taxi.create({
        data: { id: 1, plate: 'ABC123' }
      });

      const res = await request(app).get('/taxis/filter?search=ABC123');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('data');
      expect(res.body.data[0]).toHaveProperty('plate', 'ABC123');
    });

    it('should return error if no search param is provided', async () => {
      const res = await request(app).get('/taxis/filter');
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('error', 'Parametros son requeridos para la busqueda');
    });
  });

  describe('GET /taxis/lastTrajectories', () => {
    it('should fetch last trajectory for each taxi', async () => {
      // Crear taxis y trayectorias
      const taxi = await prisma.taxi.create({
        data: { id: 1, plate: 'ABC123' }
      });

      await prisma.trajectory.create({
        data: {
          taxi_id: taxi.id,
          date: new Date(),
          latitude: 40.7128,  // Latitud de ejemplo
          longitude: -74.0060 // Longitud de ejemplo
        }
      });
      const res = await request(app).get('/taxis/lastTrajectories');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('data');
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    it('should return error if no trajectories are found', async () => {
      const res = await request(app).get('/taxis/lastTrajectories');
      expect(res.statusCode).toEqual(200);
      expect(res.body.data.length).toEqual(0);
    });
  });
});
