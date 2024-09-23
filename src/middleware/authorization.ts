import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';

//Aqui verificamos el token con un middleware
export const jwtMiddleware = (secretKey: string) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const { authorization } = req.headers;
        if (!authorization) {
            console.error("Error: No authorization header provided");
            return res.status(401).json({ message: 'Falta el token de autorización' });
        }

        const [type, token] = authorization.split(' ');
        if (type.toLowerCase() !== 'bearer' || !token) {
            console.error("Error: Formato de token incorrecto");
            return res.status(400).json({ message: 'Formato de token incorrecto' });
        }

        try {
            const decodedToken = jwt.verify(token, secretKey) as any;
            console.log("Token decodificado:", decodedToken);

            req.user = {
                id: decodedToken.id,
                email: decodedToken.email,
                role: decodedToken.role  
            };            
            next();
        } catch (error) {
            console.error("Token verification error:", error);
            return res.status(403).json({ message: 'No tienes permiso para acceder' });
        }
    };
};

//aqui verificamos si el usuario esta autenticado
export const isAuthenticated = (req:Request, res:Response, next:NextFunction) => {
    console.log(req.user);
    if (!req.user) {        
        return res.status(401).json({ message: 'Falta el token de autorización' });
    }
    next();
};
//verificamos si el usuario es admin
export const isAdmin = (req:Request, res:Response, next:NextFunction) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return res.status(403).json({ message: 'Acceso restringido: no eres administrador' });
    }
};

//requiere autenticacion
export const requireAuth = (req:Request, res:Response, next:NextFunction) => {
    isAuthenticated(req, res, next);
};

//requiere que el usuario sea el admin
export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
        return res.status(401).json({ message: 'No estás autenticado' });
    }
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Acceso restringido: no eres administrador' });
    }
    next();
};
