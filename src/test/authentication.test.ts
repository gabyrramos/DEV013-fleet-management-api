import request from 'supertest';
import  app from '../app'; // Asegúrate de que tu app esté exportada
import prisma from '../db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Simulamos un usuario existente para los tests
const secretKey = 'secret_key';

const adminUser = {
    id: 1,
    email: 'admin@localhost',
    password: 'hashed_password', // Cambia esto según el hash generado en la DB
    role: 'user',
};

// Mockeamos las funciones de prisma y bcrypt
jest.mock('../db', () => ({
    users: {
        findUnique: jest.fn(),
    },
}));

jest.mock('bcrypt', () => ({
    compare: jest.fn(),
}));

describe('Login Function', () => {
    
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return 400 if email and password are not provided', async () => {
        const res = await request(app)
            .post('/login')
            .send({});

        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('message', 'Los datos son invalidos');
    });

    it('should return 404 if user does not exist', async () => {
        (prisma.users.findUnique as jest.Mock).mockResolvedValue(null);

        const res = await request(app)
            .post('/login')
            .send({ email: adminUser.email, password: '12345' });

        expect(res.statusCode).toEqual(404);
        expect(res.body).toHaveProperty('message', 'No existe un usuario con esos datos');
    });

    it('should return 404 if password is incorrect', async () => {
        (prisma.users.findUnique as jest.Mock).mockResolvedValue(adminUser);
        (bcrypt.compare as jest.Mock).mockResolvedValue(false);

        const res = await request(app)
            .post('/login')
            .send({ email: adminUser.email, password: 'incorrect_password' });

        expect(res.statusCode).toEqual(404);
        expect(res.body).toHaveProperty('message', 'Contraseña incorrecta');
    });

    it('should return 200 and a token if login is successful', async () => {
        (prisma.users.findUnique as jest.Mock).mockResolvedValue(adminUser);
        (bcrypt.compare as jest.Mock).mockResolvedValue(true);

        const res = await request(app)
            .post('/login')
            .send({ email: adminUser.email, password: '12345' });

        expect(res.statusCode).toEqual(200);
        const token = res.text; // El token está en el cuerpo de la respuesta
        expect(token).toBeTruthy();

        // Verificamos que el token sea válido
        const decodedToken = jwt.verify(token, secretKey);
        expect(decodedToken).toHaveProperty('id', adminUser.id);
        expect(decodedToken).toHaveProperty('email', adminUser.email);
        expect(decodedToken).toHaveProperty('role', adminUser.role);
    });

    it('should return 500 if something goes wrong during login', async () => {
        (prisma.users.findUnique as jest.Mock).mockRejectedValue(new Error('DB error'));

        const res = await request(app)
            .post('/login')
            .send({ email: adminUser.email, password: '12345' });

        expect(res.statusCode).toEqual(500);
        expect(res.body).toHaveProperty('message', 'Algo salio mal');
    });
});
