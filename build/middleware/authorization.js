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
Object.defineProperty(exports, "__esModule", { value: true });
const console_1 = require("console");
const jwt = require('jsonwebtoken');
//Aqui verificamos el token con un middleware
const jwtMiddleware = (secretKey) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const { authorization } = req.headers;
        if (!authorization) {
            return next();
        }
        //analyzamos el header
        const [type, token] = authorization.split(' ');
        if (type.toLowerCase() !== 'bearer') {
            return next();
        }
        try {
            const decodedToken = jwt.verify(token, secretKey);
            req.user = {
                id: decodedToken.id,
                email: decodedToken.email
            };
            console.log("Aqui el decoded token:", decodedToken);
        }
        catch (error) {
            return res.status(403).json({ message: 'No tienes permiso para acceder' });
        }
        next();
    });
};
module.exports.isAuthenticated = (req, res, next) => {
    console.log(req.user);
    return req.user != null;
};
module.exports.isAdmin = (req, res, next) => {
    return req.user === 'admin';
};
module.exports.requireAuth = (req, res, next) => {
    if (!module.exports.isAuthenticated(req, res, next)) {
        return res.status(401).json({ 'No autorizado': console_1.error });
    }
    ;
};
module.exports.requireAdmin = (req, res, next) => {
    if (!admin) {
        return res.status(401).json({ 'No autorizado': console_1.error });
    }
    else if (!module.exports.isAdmin(req, res, next)) {
        return res.status(403).json({ 'Acceso restringido': console_1.error });
    }
    next();
};
