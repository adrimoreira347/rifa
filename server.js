const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

// Estado: Arreglo de 101 elementos (usaremos del 1 al 100). False = libre, True = ocupado.
let numbers = Array(101).fill(false);

// Obtener todos los números
app.get('/api/numbers', (req, res) => {
    res.json(numbers);
});

// Elegir un número
app.post('/api/pick', (req, res) => {
    const { number } = req.body;
    if (number >= 1 && number <= 100) {
        if (!numbers[number]) {
            numbers[number] = true;
            res.json({ success: true, message: 'Número seleccionado con éxito.' });
        } else {
            res.status(400).json({ success: false, message: 'El número ya está ocupado.' });
        }
    } else {
        res.status(400).json({ success: false, message: 'Número inválido.' });
    }
});

// Reiniciar la tabla (Solo Admin)
app.post('/api/reset', (req, res) => {
    const { password } = req.body;
    // Contraseña simple para el ejemplo
    if (password === 'admin123') { 
        numbers = Array(101).fill(false);
        res.json({ success: true, message: 'La tabla ha sido reiniciada.' });
    } else {
        res.status(403).json({ success: false, message: 'Contraseña incorrecta. No autorizado.' });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});