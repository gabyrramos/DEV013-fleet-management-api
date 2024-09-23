import request from 'supertest';
import app from '../../app';
import { PrismaClient } from '@prisma/client';

// Mock de PrismaClient
jest.mock('@prisma/client', () => {
    const mockPrisma = {
        users: {
            create: jest.fn(),
            findMany: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            findUnique: jest.fn(),
        },
    };
    return { PrismaClient: jest.fn(() => mockPrisma) };
});

const mockPrisma = new PrismaClient();

describe('Users Routes', () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Limpia los mocks antes de cada prueba
    });

    // Test para crear un nuevo usuario
    it('should create a user on POST /api/users', async () => {
        const newUser = { name: 'John Doe', email: 'john@example.com', password: 'password', role: 'user' };

        (mockPrisma.users.create as jest.Mock).mockResolvedValue(newUser);

        const res = await request(app)
            .post('/api/users')
            .send(newUser);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toMatchObject(newUser);
    });

    // Test para obtener todos los usuarios
    it('should return all users on GET /api/users', async () => {
        const mockUsers = [
            { id: 1, name: 'John Doe', email: 'john@example.com', role: 'user' },
            { id: 2, name: 'Jane Doe', email: 'jane@example.com', role: 'admin' },
        ];

        (mockPrisma.users.findMany as jest.Mock).mockResolvedValue(mockUsers);

        const res = await request(app).get('/api/users');

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveLength(2);
        expect(res.body[0]).toHaveProperty('name', 'John Doe');
    });

// Test para editar un usuario
it('should update a user on PUT /api/users/:id', async () => {
    const updatedUser = { name: 'John Smith', email: 'johnsmith@example.com', role: 'user' };
    
    (mockPrisma.users.update as jest.Mock).mockResolvedValue({ id: 1, ...updatedUser });

    const res = await request(app)
        .put('/api/users/1')
        .send(updatedUser);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('Usuario actualizado correctamente');
    expect(res.body['Usuario actualizado correctamente']).toMatchObject({ id: 1, ...updatedUser });
});

// Test para eliminar un usuario
it('should delete a user on DELETE /api/users/:identifier', async () => {
    const deletedUser = { id: 1, name: 'John Doe' };

    (mockPrisma.users.delete as jest.Mock).mockResolvedValue(deletedUser);

    const res = await request(app).delete('/api/users/1');

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('Usuario eliminado');
    expect(res.body['Usuario eliminado']).toMatchObject(deletedUser);
});
});
