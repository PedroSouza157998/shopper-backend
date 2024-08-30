import { writeFileSync } from "fs";
import path from "path";

/**
 * Salva uma imagem em Base64 como um arquivo na pasta uploads.
 * 
 * @param {string} base64String - A string Base64 da imagem.
 * @param {string} fileName - O nome do arquivo a ser salvo.
 * @returns {string} - O caminho completo do arquivo salvo.
 */
export function saveBase64Image(base64String: string, fileName: string) {
    const base64Data = base64String.replace(/^data:image\/\w+;base64,/, '');

    const filePath = path.join( 'uploads', fileName);

    writeFileSync(filePath, base64Data, { encoding: 'base64' });

    return filePath;
}

export function getMonthStartAndEnd(date: Date): { "$gte": Date, "$lte": Date} {
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
  
    return { "$gte": startOfMonth, "$lte": endOfMonth};
  }