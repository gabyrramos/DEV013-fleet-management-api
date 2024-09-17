import jwt from 'jsonwebtoken';
import { users } from '@prisma/client';
import { Request, Response, NextFunction, Application } from 'express';
import { error } from 'console';
import prisma from '../db';
const bcrypt = require('bcrypt');

module.exports = (app:Application, next:NextFunction) => {
    // const user = {
    //     id: 7,
    //     email: 'admin@localhost',
    //     password: '12345'
    // };
    const secretKey = 'secret_key';
    // const hashedPassword = bcrypt.hashSync(user.password, 10);

    app.post('/login', async (req:Request, res:Response) => {
        try {
            const { email, password } = req.body;
            if (!email && !password) {
                return res.status(400).json({ 'Los datos son invalidos': error });
            }
            const admin = await prisma.users.findUnique({
                where: { email }
            });
            if (!admin) {
                console.error("No se encontro el usuario", error);
                return res.status(400).json({ "No existe un usuario con esos datos": error });
            };

            //aqui validamos la contraseña
            const validateAdmin = await bcrypt.compare(password, admin.password)
            if (!validateAdmin) {
                return res.status(404).json({ "No se pudo validar la contraseña": error })
            }
            // Generamos token
            const token = jwt.sign({ id: admin.id, email: admin.email }, secretKey, { expiresIn: '1h' });
            console.log('Generando token:', token);
            return res.status(200).send(token);

        } catch (error) {
            console.error("No se pudo generar token", error);
            return res.status(500).send("Algo salio mal")
        };
    });
    next();
};

