import express from 'express';
const app = express();
import { fileURLToPath } from 'url';
import { dirname  } from 'path';
const __filename = fileURLToPath(  import.meta.url  );
const __dirname = dirname(__filename);


// Importamos los servicios
import { 
    nuevoRoommate,
    getAllRoomate,
    calcularDeudas
} from './services/roommates.js';

import { 
    nuevoGasto,
    getAllGastos,
    deleteGasto,
    updateGasto
} from './services/gastos.js';

// Midlleware para recibir Json
app.use( express.json() )

console.clear();

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html")
})


app.post("/roommate", async (req, res) => {
    try {
        const response = await nuevoRoommate();
        calcularDeudas();
        res.status(201)
        res.send({status:'OK',response })
    } catch (error) {
        console.error("Error al crear roommate", error);
        res.status(500).json({ status: "FAILED", data: { error: error.message } });
    }
})

app.get("/roommates", async(req, res) => {
    try{
        const response = await getAllRoomate();
        res.status(200)
        res.send({status:'OK', response })

    }catch(error){
        console.error("Error al obtener los roommates", error);
        res.status(500).json({ status: "FAILED", data: { error: error.message } });
    }
});

app.post('/gasto', async (req, res) => {
    try {
        await nuevoGasto(req.body);
        res.status(201).json({ status: 'ok'}); 
            } catch (error) {
            console.error("Error en la ruta /gasto:", error);
            res.status(500).json({ status: "FAILED", data: { error: error.message } });
        }
        calcularDeudas();
});

app.get('/gastos', async( req, res ) => {
    try {
        const response = await getAllGastos();
        res.status(200)
        res.send({status:'OK', response })
    } catch (error) {
        console.error("Error al obtener los gastos", error);
        res.status(500).json({ status: "FAILED", data: { error: error.message } });
    }
});


app.delete('/gasto/:id', async (req, res) => { 
    try {
        const gastoId = req.params.id; 
        await deleteGasto(gastoId); 
        res.status(200).send({ status: 'OK', message: 'Gasto eliminado exitosamente' });
    } catch (error) {
        console.error("Error al eliminar el gasto:", error);
        res.status(500).json({ status: "FAILED", data: { error: error.message } });
    }
    calcularDeudas();
});

app.put('/gasto/:id', async (req, res) => {
    try {
        const gastoId = req.params.id;
        const updatedData = req.body;
        await updateGasto(gastoId, updatedData); 

        res.status(200).send({ status: 'OK', message: 'Gasto actualizado exitosamente' });
    } catch (error) {
        console.error("Error al actualizar el gasto:", error);
        res.status(500).json({ status: "FAILED", data: { error: error.message } });
    }
    calcularDeudas();
});


app.listen(3000, () => console.log('Servidor encendido'))