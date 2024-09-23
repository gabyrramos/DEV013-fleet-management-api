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
const prisma = new client_1.PrismaClient();
describe('Taxi Endpoints', () => {
    // Mock para limpiar la base de datos antes de cada test
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.taxi.deleteMany({});
        yield prisma.trajectory.deleteMany({});
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.$disconnect();
    }));
    describe('GET /taxis', () => {
        it('should fetch all taxis with pagination', () => __awaiter(void 0, void 0, void 0, function* () {
            // Preparar los datos
            yield prisma.taxi.createMany({
                data: [
                    { id: 1, plate: 'ABC123' },
                    { id: 2, plate: 'XYZ789' }
                ]
            });
            const res = yield (0, supertest_1.default)(app_1.default).get('/taxis?page=1&size=2');
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('data');
            expect(res.body.data.length).toEqual(2);
        }));
        it('should return error for invalid pagination parameters', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app_1.default).get('/taxis?page=invalid&size=10');
            expect(res.statusCode).toEqual(400);
            expect(res.body).toHaveProperty('Page or limit is not valid');
        }));
    });
    describe('GET /taxis/filter', () => {
        it('should filter taxis by id or plate', () => __awaiter(void 0, void 0, void 0, function* () {
            // Insertar taxis
            yield prisma.taxi.create({
                data: { id: 1, plate: 'ABC123' }
            });
            const res = yield (0, supertest_1.default)(app_1.default).get('/taxis/filter?search=ABC123');
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('data');
            expect(res.body.data[0]).toHaveProperty('plate', 'ABC123');
        }));
        it('should return error if no search param is provided', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app_1.default).get('/taxis/filter');
            expect(res.statusCode).toEqual(400);
            expect(res.body).toHaveProperty('error', 'Parametros son requeridos para la busqueda');
        }));
    });
    describe('GET /taxis/lastTrajectories', () => {
        it('should fetch last trajectory for each taxi', () => __awaiter(void 0, void 0, void 0, function* () {
            // Crear taxis y trayectorias
            const taxi = yield prisma.taxi.create({
                data: { id: 1, plate: 'ABC123' }
            });
            yield prisma.trajectory.create({
                data: {
                    taxi_id: taxi.id,
                    date: new Date(),
                    latitude: 40.7128, // Latitud de ejemplo
                    longitude: -74.0060 // Longitud de ejemplo
                }
            });
            const res = yield (0, supertest_1.default)(app_1.default).get('/taxis/lastTrajectories');
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('data');
            expect(res.body.data.length).toBeGreaterThan(0);
        }));
        it('should return error if no trajectories are found', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app_1.default).get('/taxis/lastTrajectories');
            expect(res.statusCode).toEqual(200);
            expect(res.body.data.length).toEqual(0);
        }));
    });
});
