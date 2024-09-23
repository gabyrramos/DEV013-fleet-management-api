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
// Importa tu aplicación Express
describe('GET /taxis', () => {
    it('should return all taxis', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default).get('/taxis');
        expect(response.status).toBe(200);
    }));
    it('should return not found when the limit is less than 10', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default).get("/taxis?page=1&limit=9").send();
        expect(response.statusCode).toBe(400);
    }));
    it('should return not found for a non-existing page', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default).get('/taxis?page=1000&limit=10');
        expect(response.status).toBe(404);
        expect(response.body.message).toBe("No se encontraron usuarios");
    }));
    it('should return taxis in JSON format', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default).get('/taxis?page=1&limit=10');
        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toEqual(expect.stringContaining('application/json'));
    }));
});
