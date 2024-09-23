import request from 'supertest';
import app from '../app'; // Asegúrate de tener tu app exportada
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

describe('User Endpoints', () => {
    
    beforeEach(async () => {
        await prisma.users.deleteMany({});
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    describe('POST /users', () => {
        it('should create a new user', async () => {
            const res = await request(app)
                .post('/users')
                .send({
                    name: 'John Doe',
                    email: 'john@example.com',
                    password: 'password123',
                    role: 'user'
                });
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('email', 'john@example.com');
        });

        it('should return 400 if required fields are missing', async () => {
            const res = await request(app)
                .post('/users')
                .send({
                    name: 'John Doe',
                    email: ''
                });
            expect(res.statusCode).toEqual(400);
            expect(res.body).toHaveProperty('error', 'Nombre o email invalido');
        });

        it('should return 409 if email already exists', async () => {
            // Crear usuario inicial
            await prisma.users.create({
                data: {
                    name: 'Jane Doe',
                    email: 'jane@example.com',
                    password: await bcrypt.hash('password123', 5),
                    role: 'user'
                }
            });

            const res = await request(app)
                .post('/users')
                .send({
                    name: 'Jane Doe',
                    email: 'jane@example.com',
                    password: 'password123',
                    role: 'user'
                });
            expect(res.statusCode).toEqual(409);
            expect(res.body).toHaveProperty('error', 'El correo electronico ya existe');
        });
    });

    describe('GET /users', () => {
        it('should fetch all users', async () => {
            await prisma.users.create({
                data: {
                    name: 'John Doe',
                    email: 'john@example.com',
                    password: await bcrypt.hash('password123', 5),
                    role: 'user'
                }
            });

            const res = await request(app).get('/users');
            expect(res.statusCode).toEqual(200);
            expect(res.body.length).toBeGreaterThan(0);
            expect(res.body[0]).toHaveProperty('email', 'john@example.com');
        });
    });

    describe('PUT /users/:id', () => {
        it('should update a user', async () => {
            const user = await prisma.users.create({
                data: {
                    name: 'John Doe',
                    email: 'john@example.com',
                    password: await bcrypt.hash('password123', 5),
                    role: 'user'
                }
            });

            const res = await request(app)
                .put(`/users/${user.id}`)
                .send({
                    name: 'John Updated',
                    email: 'johnupdated@example.com',
                    password: 'newpassword123',
                    role: 'admin'
                });
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('Usuario actualizado correctamente');
            expect(res.body['Usuario actualizado correctamente']).toHaveProperty('email', 'johnupdated@example.com');
        });

        it('should return 400 if required fields are missing', async () => {
            const user = await prisma.users.create({
                data: {
                    name: 'John Doe',
                    email: 'john@example.com',
                    password: await bcrypt.hash('password123', 5),
                    role: 'user'
                }
            });

            const res = await request(app)
                .put(`/users/${user.id}`)
                .send({
                    name: '',
                    email: '',
                    password: 'newpassword123',
                    role: 'admin'
                });
            expect(res.statusCode).toEqual(400);
            expect(res.body).toHaveProperty('error', 'Datos incompletos');
        });
    });

    describe('DELETE /users/:identifier', () => {
        it('should delete a user by ID', async () => {
            const user = await prisma.users.create({
                data: {
                    name: 'John Doe',
                    email: 'john@example.com',
                    password: await bcrypt.hash('password123', 5),
                    role: 'user'
                }
            });

            const res = await request(app).delete(`/users/${user.id}`);
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('Usuario eliminado');
        });

        it('should delete users by name', async () => {
            await prisma.users.createMany({
                data: [
                    { name: 'John Doe', email: 'john@example.com', password: await bcrypt.hash('password123', 5), role: 'user' },
                    { name: 'John Doe', email: 'john2@example.com', password: await bcrypt.hash('password123', 5), role: 'user' }
                ]
            });

            const res = await request(app).delete(`/users/John Doe`);
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('Usuarios eliminados');
            expect(res.body['Usuarios eliminados'].count).toBe(2);
        });

        it('should return 404 if user is not found', async () => {
            const res = await request(app).delete(`/users/9999`);
            expect(res.statusCode).toEqual(404);
            expect(res.body).toHaveProperty('Usuario no encontrado o error');
        });
    });
});
