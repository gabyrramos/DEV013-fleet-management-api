"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secretKey = 'g6WQSrsv7rC7et5B';
const userPayload = { ud: 1, username: 'anita.borg@systers.xyz' };
const token = jsonwebtoken_1.default.sign(userPayload, secretKey);
console.log('Generando token:', token);
// if (!secretKey || !userPayload){
//    response.status(400).send('No se encontro el correo o contraseña');
// }
// const passwordMatch = jwt.verify(token, secretKey);
// if(!passwordMatch){
//    response.status(401).send('Contraseña incorrecta')
// }
//si todo coincide 
// response.status(200).json({token});
//VERIFICAMOS EL TOKEN
jsonwebtoken_1.default.verify(token, secretKey, (err, decodedToken) => {
    if (err) {
        return (403);
    }
    else {
        console.log("Aqui el decoded token:", decodedToken);
    }
});
