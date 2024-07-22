import test from "node:test";
import { getAllTaxis } from "../controller/taxis_controller";
import { allowedNodeEnvironmentFlags } from "node:process";
const request = require('supertest');
const app = require('express');


// describe("Peticion GET Taxis", () => {
// //DEBERIA RESPONDER AL LLAMADO CON GET EN POSTMAN Y DAR LA LISTA DE TAXIS//
    
//     it("Deberia devolver la data de todos los taxis", () => {
//         const allTaxis:String = getAllTaxis
//         expect (allTaxis).toBe(getAllTaxis)
//     });
// })
