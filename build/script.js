"use strict";
//paso 2
//antes de retornar json le añadimos un metodo que haga la exportacion del ejemplo va a generarme un archivo en mi laptop con ese contenido.
//para el documento que se va a exportar necesito usar el script que me dio chris, para que cree el xlsx
//lo invoco, abro el archivo y comparar con postman, si es igual esta bien creado 
//en el codigo debe ser separado en una funcion envuelta afuera del controllador una funcion donde metes todo y luego lo llamas aqui
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateExcel = void 0;
const xlsx = __importStar(require("xlsx"));
const path = __importStar(require("path"));
;
// Crear un nuevo libro de trabajo (workbook)
const generateExcel = (data, res) => {
    const workbook = xlsx.utils.book_new();
    const worksheet = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Trayectorias');
    // Escribir el libro de trabajo a un archivo Excel
    const filePath = path.join(__dirname, 'trayectorias.xlsx');
    xlsx.writeFile(workbook, filePath);
    // Confirmación de éxito
    console.log(`Archivo Excel creado: ${filePath}`);
    res.download(filePath, 'trayectorias.xlsx', (err) => {
        if (err) {
            console.error('Error al descargar el archivo', err);
            return res.status(500).json({ error: 'Error al descargar el archivo' });
        }
    });
};
exports.generateExcel = generateExcel;
