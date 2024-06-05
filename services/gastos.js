import { v4 as uuidv4 } from 'uuid';
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import { dirname  } from 'path';
const __filename = fileURLToPath(  import.meta.url  );
const __dirname = dirname(__filename);

export const nuevoGasto = async (obj) => {
    try {
        obj.id = uuidv4().slice(0, 6);


        let gastos = [];
        try {
            const data = await fs.readFile(__dirname + "/../data/gastos.json", "utf8");
            gastos = JSON.parse(data).gastos || []; 
        } catch (readError) {
            console.warn("El archivo gastos.json está vacío o corrupto. Se inicializará con un array vacío.");
        }

        gastos.push(obj); // Agregar el nuevo gasto al array existente
        await fs.writeFile(__dirname + "/../data/gastos.json", JSON.stringify({ gastos }), "utf8");

        return obj;
    } catch (error) {
        console.error("Error al agregar gasto:", error);
        throw error;
    }
};

export const getAllGastos = async () => {
    try {
        const data = await fs.readFile(__dirname + "/../data/gastos.json", "utf8");
        return JSON.parse(data).gastos || []; 
    } catch (error) {
        console.error("Error al obtener los gastos:", error);
        return []; 
    }
};

export const updateGasto = async (id, updatedData) => {
    try {
        const data = await fs.readFile(__dirname + "/../data/gastos.json", "utf8");
        let gastos = JSON.parse(data).gastos || [];
        const gastoIndex = gastos.findIndex((g) => g.id === id );
        if (gastoIndex === -1) {
        return null;
        }
        
        gastos[gastoIndex] = { ...gastos[gastoIndex], ...updatedData, id: id }; 
        console.log('holaailasd2', gastos)

        await fs.writeFile(__dirname + "/../data/gastos.json", JSON.stringify({ gastos }), "utf8");

        return gastos[gastoIndex]; 
    } catch (error) {
        console.error("Error al actualizar el gasto:", error);
        throw error; 
    }
};

export const deleteGasto = async (id) => {
    try {
        const data = await fs.readFile(__dirname + "/../data/gastos.json", "utf8");
        let gastos = JSON.parse(data).gastos || [];
        const gastoIndex = gastos.findIndex(gasto => gasto.id === id);

        if (gastoIndex === -1) {
            throw new Error("Gasto no encontrado"); 
        }

        gastos.splice(gastoIndex, 1);
        await fs.writeFile(__dirname + "/../data/gastos.json", JSON.stringify({ gastos }), "utf8");
    } catch (error) {
        console.error("Error al eliminar gasto:", error);
        throw error;
    }
};