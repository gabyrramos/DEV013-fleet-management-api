import jwt from 'jsonwebtoken';
import { Request, Response, Application } from 'express';
import prisma from '../db';
const bcrypt = require('bcrypt');

export const loginFunction = (app:Application) => {
    const secretKey = 'secret_key';
    const adminUser = {
        id: 1,
        email: 'admin@localhost',
        password: '12345',
        role: 'user'
     };
    
    // const hashedPassword = bcrypt.hashSync(user.password, 10);

    app.post('/login', async (req:Request, res:Response) => {
        try {
            const { email, password } = req.body;
            if (!email && !password) {
                return res.status(400).json({message: 'Los datos son invalidos' });
            }
            const admin = await prisma.users.findUnique({
                where: { email },
            });
            if (!admin) {
                console.error("No se encontro el usuario", Error);
                return res.status(400).json({ "No existe un usuario con esos datos": Error });
            };

            //aqui validamos la contraseña
            const validateAdmin = await bcrypt.compare(password, admin.password)
            if (!validateAdmin) {
                return res.status(404).json({ "No se pudo validar la contraseña": Error })
            }
            // Generamos token
            const token = jwt.sign({ id: admin.id, email: admin.email, role: admin.role }, secretKey, { expiresIn: '1h' });
            console.log('Generando token:', token);
            return res.status(200).send(token);

        } catch (error) {
            console.error("No se pudo generar token", error);
            return res.status(500).send("Algo salio mal")
        };
    });
};

