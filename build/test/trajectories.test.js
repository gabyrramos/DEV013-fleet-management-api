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
const app_1 = __importDefault(require("../app")); // Asegúrate de tener tu app exportada
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
describe('Trajectory Endpoints', () => {
    // Limpiar la base de datos antes de cada test
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.trajectory.deleteMany({});
        yield prisma.taxi.deleteMany({});
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.$disconnect();
    }));
    describe('GET /trajectories', () => {
        it('should fetch all trajectories with pagination', () => __awaiter(void 0, void 0, void 0, function* () {
            // Preparar datos
            const taxi = yield prisma.taxi.create({
                data: { plate: 'ABC123' }
            });
            yield prisma.trajectory.createMany({
                data: [
                    { taxi_id: taxi.id, date: new Date(), latitude: 40.7128, longitude: -74.0060 },
                    { taxi_id: taxi.id, date: new Date(), latitude: 40.7128, longitude: -74.0060 }
                ]
            });
            const res = yield (0, supertest_1.default)(app_1.default).get('/trajectories?page=1&size=2');
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('data');
            expect(res.body.data.length).toEqual(2);
        }));
        it('should return error for invalid pagination parameters', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app_1.default).get('/trajectories?page=invalid&size=10');
            expect(res.statusCode).toEqual(400);
            expect(res.body).toHaveProperty('Page or limit is not valid');
        }));
    });
    describe('GET /trajectories/filter', () => {
        it('should filter trajectories by taxi_id and date', () => __awaiter(void 0, void 0, void 0, function* () {
            // Insertar datos para la prueba
            const taxi = yield prisma.taxi.create({
                data: { plate: 'XYZ789' }
            });
            const date = new Date();
            yield prisma.trajectory.createMany({
                data: [
                    { taxi_id: taxi.id, date, latitude: 40.7128, longitude: -74.0060 },
                    { taxi_id: taxi.id, date, latitude: 40.7128, longitude: -74.0060 }
                ]
            });
            const res = yield (0, supertest_1.default)(app_1.default)
                .get(`/trajectories/filter?search=${taxi.id}&date=${date.toISOString()}&page=1&size=2`);
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('data');
            expect(res.body.data.length).toEqual(2);
        }));
        it('should return error if search and date are missing', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app_1.default).get('/trajectories/filter');
            expect(res.statusCode).toEqual(400);
            expect(res.body).toHaveProperty('error', 'Se necesitan parametros para realizar busqueda de trajectorias');
        }));
    });
});
