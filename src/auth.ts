import { log } from 'console';
import { response } from 'express';
import jwt from 'jsonwebtoken';
const secretKey = 'g6WQSrsv7rC7et5B';
const userPayload = {ud:1, username: 'anita.borg@systers.xyz'};

const token = jwt.sign(userPayload, secretKey);
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

jwt.verify(token, secretKey, (err, decodedToken)=>{
    if(err){
        return (403);
    }else {
        console.log("Aqui el decoded token:", decodedToken);
    }    
});

    
