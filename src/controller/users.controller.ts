//import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';


const prisma = new PrismaClient();


export const postUser = async (req: Request, res: Response) => {

    try {
        //el cuerpo debe tener email y password
        const { name, email, password, role } = req.body;
        console.log('Received body:', req.body);


        if (!name || !email || !password || !role ) {
            return res.status(400).json({ error: 'Nombre o email invalido' })
        }

        //luego validamos que el correo no exista en la db
        const existingEmail = await prisma.users.findUnique({
            where: { email }
        });

        if (existingEmail) {
            return res.status(409).json({ error: 'El correo electronico ya existe' });
        }

        //debemos hashear pw para que se guarde la contraseña encriptada
        const hashedPassword = await bcrypt.hash(password, 5);

        //despues posteamos dentro de data el usuario 
        const user = await prisma.users.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: 'user'
            },
        });

        res.status(200).json(user);

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Hubo un error con la operación' });
    }
}



export const getUsers = async (req: Request, res: Response) => {
    console.log("User autenticado:", req.user);
    try {
        const users = await prisma.users.findMany();
        console.log("Aqui probando respuesta usuarios:", users);
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: 'Error al buscar usuarios' });
    }
};

export const editUser = async (req: Request, res: Response) => {

    try {

        //obtenemos el id para identificar el usuario que vamos a editar 
        const { id } = req.params;
        console.log("Id recibido:", id);
        
        //quiero poder acceder al cuerpo del request 
        const { name, email, password, role } = req.body;

        //quiero decirle que el nuevo cuerpo debe de tener email, name y password si o si

        if (!name || !email || !password || !role) {
            return res.status(400).json({ error: 'Datos incompletos' });
        }


        const updatedInfo = await prisma.users.update({
            where: {id: parseInt(id) },
            data: {
                name,
                email,
                password,
                role
            },
        });
        console.log("Informacion de usuario actualizada:", updatedInfo);

        res.status(200).json({"Usuario actualizado correctamente": updatedInfo});
        

    } catch (error) {
        console.error("Error al actualizar cambios", error);
        
        return res.status(400).json({"Error al hacer cambios": error});
    }
}


export const deleteUser = async (req: Request, res: Response) => {
    try {
        const { identifier } = req.params;

        // Verifica si el identifier es un número
        const id = parseInt(identifier);

        if (!isNaN(id)) {
            // Si es un número, elimina el usuario por ID
            const eliminarUser = await prisma.users.delete({
                where: { id: id },
            });
            console.log("Usuario fue eliminado", eliminarUser);
            return res.status(200).json({ "Usuario eliminado": eliminarUser });
        } else {
            // Si no es un número, se asume que es un nombre
            const eliminarUser = await prisma.users.deleteMany({
                where: { name: identifier },
            });
            console.log("Usuario fue eliminado", eliminarUser);
            return res.status(200).json({ "Usuario eliminado": eliminarUser });
        }
    } catch (error) {
        console.error("Error al tratar de eliminar usuario", error);
        return res.status(404).json({ "Usuario no encontrado o error": error });
    }
}
