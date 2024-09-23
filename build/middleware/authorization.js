"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAdmin = exports.requireAuth = exports.isAdmin = exports.isAuthenticated = exports.jwtMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
//Aqui verificamos el token con un middleware
const jwtMiddleware = (secretKey) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
            const decodedToken = jsonwebtoken_1.default.verify(token, secretKey);
            console.log("Token decodificado:", decodedToken);
            req.user = {
                id: decodedToken.id,
                email: decodedToken.email,
                role: decodedToken.role
            };
            next();
        }
        catch (error) {
            console.error("Token verification error:", error);
            return res.status(403).json({ message: 'No tienes permiso para acceder' });
        }
    });
};
exports.jwtMiddleware = jwtMiddleware;
//aqui verificamos si el usuario esta autenticado
const isAuthenticated = (req, res, next) => {
    console.log(req.user);
    if (!req.user) {
        return res.status(401).json({ message: 'Falta el token de autorización' });
    }
    next();
};
exports.isAuthenticated = isAuthenticated;
//verificamos si el usuario es admin
const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    }
    else {
        return res.status(403).json({ message: 'Acceso restringido: no eres administrador' });
    }
};
exports.isAdmin = isAdmin;
//requiere autenticacion
const requireAuth = (req, res, next) => {
    (0, exports.isAuthenticated)(req, res, next);
};
exports.requireAuth = requireAuth;
//requiere que el usuario sea el admin
const requireAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: 'No estás autenticado' });
    }
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Acceso restringido: no eres administrador' });
    }
    next();
};
exports.requireAdmin = requireAdmin;
