"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prismaMock = void 0;
// test/mocks/prisma.ts
exports.prismaMock = {
    taxi: {
        findMany: jest.fn(),
        count: jest.fn(),
    },
    trajectory: {
        findFirst: jest.fn(),
    },
    // Agrega otros métodos según sea necesario
};
exports.default = exports.prismaMock;
