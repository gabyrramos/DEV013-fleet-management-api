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
Object.defineProperty(exports, "__esModule", { value: true });
const taxis_controller_1 = require("../controller/taxis_controller"); // Adjust this import path as necessary
const client_1 = require("@prisma/client"); // Import the mocked Prisma client
jest.mock('@prisma/client'); // Mock the entire Prisma client module
describe('Get All Taxis function', () => {
    let mockRequest;
    let mockResponse;
    beforeEach(() => {
        mockRequest = {
            query: {
                page: '1',
                size: '10',
            },
        };
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        // Mock the data returned by Prisma
        const taxisData = [{ id: 1, plate: 'AAAA-1111' }];
        // Assert PrismaClient taxi methods are mocks
        const prisma = new client_1.PrismaClient();
        prisma.taxi.findMany.mockResolvedValue(taxisData);
        prisma.taxi.count.mockResolvedValue(taxisData.length);
    });
    afterEach(() => {
        jest.clearAllMocks(); // Clear mocks after each test
    });
    it('should return all taxis with pagination info', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, taxis_controller_1.getAllTaxis)(mockRequest, mockResponse);
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith({
            data: [{ id: 1, plate: 'AAAA-1111' }],
            page: 1,
            size: 10,
            totalPages: 1,
            totalTaxis: 1,
        });
    }));
});
