import { Request, Response } from "express";
import * as xlsx from 'xlsx';
import * as path from 'path';


// Arreglo de objetos de ejemplo
interface data {
    id:number ;
    taxi_id: number;
    latitude: number;
    longitude: number;
    date: Date;
};

// Creando un nuevo libro de trabajo (workbook)
export const  generateExcel = ( data: data[], res: Response): void => {
    const workbook = xlsx.utils.book_new();
    const worksheet = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Trayectorias');
    
    // Escribiendo el libro de trabajo a un archivo Excel
    const filePath = path.join(__dirname, 'trayectorias.xlsx');
    xlsx.writeFile(workbook, filePath);
    
    // Confirmando la peticion y pidiendo de descargue
    console.log(`Archivo Excel creado: ${filePath}`);
    return res.download(filePath, 'trayectorias.xlsx', (err)=> {
        if (err) {
            console.error('Error al descargar el archivo', err);
            return res.status(500).json({error: 'Error al descargar el archivo'});
        }
    });
}

