import { Response } from "express";
import * as xlsx from 'xlsx';
import * as path from 'path';
import * as fs from 'fs'; 

interface Data {
    id: number;
    taxi_id: number;
    latitude: number;
    longitude: number;
    date: Date;
}

// Creando un nuevo libro de trabajo (workbook)
export const generateExcel = (data: Data[], res: Response): void => {
    const workbook = xlsx.utils.book_new();
    const worksheet = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Trayectorias');
    
    // Escribiendo el libro de trabajo a un archivo Excel
    const filePath = path.join(__dirname, 'trayectorias.xlsx');
    xlsx.writeFile(workbook, filePath);
    
    // Confirmando la petición y pidiendo descarga
    console.log(`Archivo Excel creado: ${filePath}`);

    // Enviar el archivo como respuesta
    res.download(filePath, 'trayectorias.xlsx', (err) => {
        if (err) {
            console.error('Error al descargar el archivo', err);
            return res.status(500).json({ error: 'Error al descargar el archivo' });
        }

        // Opcional: Eliminar el archivo después de la descarga
        fs.unlink(filePath, (unlinkErr) => {
            if (unlinkErr) {
                console.error('Error al eliminar el archivo', unlinkErr);
            } else {
                console.log('Archivo eliminado después de la descarga');
            }
        });
    });
};
