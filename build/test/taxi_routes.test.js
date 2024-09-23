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
const mockPrisma = new client_1.PrismaClient();
describe('Taxis Routes', () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Limpia los mocks antes de cada prueba
    });
    // Test para la ruta de obtener todos los taxis
    it('should return all taxis on GET /api/taxis', () => __awaiter(void 0, void 0, void 0, function* () {
        const mockTaxis = [
            { id: 1, name: 'Taxi 1', registration_number: 'ABC123' },
            { id: 2, name: 'Taxi 2', registration_number: 'DEF456' },
        ];
        // Mockeamos la respuesta de la base de datos
        mockPrisma.taxi.findMany.mockResolvedValue(mockTaxis);
        const res = yield (0, supertest_1.default)(app_1.default).get('/api/taxis');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveLength(2);
        expect(res.body[0]).toHaveProperty('name', 'Taxi 1');
        expect(res.body[0]).toHaveProperty('registration_number', 'ABC123');
    }));
    // Test para la ruta de filtro de taxis
    it('should return filtered taxis on GET /api/taxis/filter', () => __awaiter(void 0, void 0, void 0, function* () {
        const filteredTaxis = [
            { id: 3, name: 'Filtered Taxi', registration_number: 'XYZ789' },
        ];
        // Mockeamos la respuesta de la base de datos
        mockPrisma.taxi.findMany.mockResolvedValue(filteredTaxis);
        const res = yield (0, supertest_1.default)(app_1.default).get('/api/taxis/filter').query({
            registration_number: 'XYZ789',
        });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveLength(1);
        expect(res.body[0]).toHaveProperty('name', 'Filtered Taxi');
        expect(res.body[0]).toHaveProperty('registration_number', 'XYZ789');
    }));
    // Test para obtener las últimas trayectorias de los taxis
    it('should return last trajectories on GET /api/taxis/lastTrajectories', () => __awaiter(void 0, void 0, void 0, function* () {
        const mockLastTrajectories = [
            { taxi_id: 1, date: '2023-09-22', latitude: 40.7128, longitude: -74.0060 },
        ];
        // Mockeamos la respuesta de la base de datos
        mockPrisma.trajectory.findMany.mockResolvedValue(mockLastTrajectories);
        const res = yield (0, supertest_1.default)(app_1.default).get('/api/taxis/lastTrajectories');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveLength(1);
        expect(res.body[0]).toHaveProperty('taxi_id', 1);
        expect(res.body[0]).toHaveProperty('date', '2023-09-22');
        expect(res.body[0]).toHaveProperty('latitude', 40.7128);
        expect(res.body[0]).toHaveProperty('longitude', -74.0060);
    }));
});
