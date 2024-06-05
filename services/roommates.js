import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { promises as fs } from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
let roommates = [];


//Crear nuevo roommate
export const nuevoRoommate = async () => {
    const data = await axios.get("https://randomuser.me/api");
    const {
        name: { first, last },
        email,
    } = data.data.results[0];

    const roommate = {
        id: uuidv4().slice(30),
        nombre: `${first} ${last}`,
        email,
        debe: 0,
        recibe: 0,
    };
    roommates.push(roommate);

    await fs.writeFile(
        __dirname + "/../data/roommates.json",
        JSON.stringify({ roommates: roommates, length: { cantidadDeRoommates: roommates.length } }),
        "utf8"
    );
    
    const dataFromFile = await fs.readFile(__dirname + "/../data/roommates.json", "utf8");
    return JSON.parse(dataFromFile);
};


//Obtener todos los roommates
export const getAllRoomate = async () => {
    const dataFromFile = await fs.readFile(__dirname + "/../data/roommates.json", "utf8");
    return JSON.parse(dataFromFile);
};


//Calcular las deudas del roommate
export const calcularDeudas = async () => {
    try {
        const roommatesData = await fs.readFile(__dirname + "/../data/roommates.json", "utf8");
        const gastosData = await fs.readFile(__dirname + "/../data/gastos.json", "utf8");

        let roommates = JSON.parse(roommatesData);
        const gastos = JSON.parse(gastosData);

        roommates = roommates.roommates.map(roommate => {
        const gastosRoommate = gastos.gastos.filter(gasto => gasto.roommate === roommate.nombre);
    

        const deudaTotal = gastosRoommate.reduce((sum, gasto) => sum + gasto.monto, 0);
            //console.log('deuda total', deudaTotal)
        return { ...roommate, debe: deudaTotal };
        
        });
        
        await fs.writeFile(__dirname + "/../data/roommates.json", JSON.stringify({roommates}));
        return roommates;
    
    } catch (error) {
        console.error("Error al calcular las deudas:", error);
        return [];
        }   
};