//import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();


export const postUser = async (req: Request, res:Response) => {
    
    try { 
        
        //el cuerpo debe tener email y password
        const {name, email, password} = req.body;

        if(!name || email ){
            res.status(400).json({error: 'Nombre o email invalido'})
        }
    
        //luego validamos que el correo no exista en la db
        const existingEmail = await prisma.user.findUnique({
            where: { email }
        });
    
        if (existingEmail){
            res.status(409).json({error: 'El correo electronico ya existe'});
        }
    
    //debemos hashear pw para que se guarde la contraseña encriptada
     const hashedPassword = await bcrypt.hash(password, 5);
    
    //despues posteamos dentro de data el usuario 
       const user = await prisma.user.create({
        data: {
        name,
        email,
        password: hashedPassword,
       },
    });
    res.status(200).json(user);

    } catch (error) {
    
     res.status(500).json({
        error: 'Hubo un error con la operación'
     })
    }
}

