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
const client_1 = require("@prisma/client");
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
const mockPrisma = new client_1.PrismaClient();
describe('Trajectories Routes', () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Limpia los mocks antes de cada prueba
    });
    // Test para obtener todas las trayectorias
    it('should return all trajectories on GET /api/trajectories', () => __awaiter(void 0, void 0, void 0, function* () {
        const mockTrajectories = [
            { id: 1, taxi_id: 1, date: new Date(), latitude: 40.7128, longitude: -74.0060 },
            { id: 2, taxi_id: 2, date: new Date(), latitude: 34.0522, longitude: -118.2437 },
        ];
        mockPrisma.trajectory.findMany.mockResolvedValue(mockTrajectories);
        const res = yield (0, supertest_1.default)(app_1.default).get('/api/trajectories');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveLength(2);
        expect(res.body[0]).toHaveProperty('taxi_id', 1);
    }));
    // Test para filtrar trayectorias
    it('should filter trajectories on GET /api/trajectories/filter', () => __awaiter(void 0, void 0, void 0, function* () {
        const filteredTrajectories = [
            { id: 3, taxi_id: 1, date: new Date(), latitude: 40.7128, longitude: -74.0060 },
        ];
        mockPrisma.trajectory.findMany.mockResolvedValue(filteredTrajectories);
        const res = yield (0, supertest_1.default)(app_1.default).get('/api/trajectories/filter').query({
            taxi_id: 1,
            date: new Date().toISOString(),
        });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveLength(1);
        expect(res.body[0]).toHaveProperty('taxi_id', 1);
    }));
    // Test para exportar trayectorias
    it('should export trajectories on GET /api/trajectories/export', () => __awaiter(void 0, void 0, void 0, function* () {
        // Simulamos la exportación aquí, ajusta según tu lógica de exportación
        const res = yield (0, supertest_1.default)(app_1.default).get('/api/trajectories/export');
        expect(res.statusCode).toEqual(200);
        expect(res.headers['content-type']).toMatch(/application\/json/); // Cambia según el formato de exportación
    }));
});
