"use strict";
// import jwt from 'jsonwebtoken';
// //import { PrismaClient } from '@prisma/client';
// import { Request, Response, NextFunction } from 'express';
// const bcrypt = require('bcrypt');
// const user = {
//     id: 0,
//     email: 'admin@localhost',
//     password: '123456'
// };
// const secretKey = 'secret_key';
// const hashedPassword = bcrypt.hashSync(user.password, 10); 
// // const userWithHashedPassword = {
// //     ...user,
// //     password: hashedPassword
// // };
// // Generamos token
// const token = jwt.sign({ id: user.id, email: user.email }, secretKey, { expiresIn: '1h' });
// console.log('Generando token:', token);
// //Aqui verificamos con un middleware el token
// const jwtMiddleware = (secretKey: string) => {
//     return async (req: Request, res: Response, next: NextFunction) => {
//         const { authorization } = req.headers;
//         if (!authorization) return next(); 
//         const [type, token] = authorization.split(' ');
//         if (type.toLowerCase() !== 'bearer') return next(); 
//         try {
//             const decodedToken = jwt.verify(token, secretKey) as any; 
//             req.user = {
//                 id: decodedToken.id,
//                 email: decodedToken.email
//             };
//             console.log("Aqui el decoded token:", decodedToken);
//         } catch (error) {
//             return res.status(403).json({ message: 'No tienes permiso para acceder' }); 
//         }
//         next(); 
//     };
// };
// export { jwtMiddleware };
