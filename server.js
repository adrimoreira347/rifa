const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

let numbers = Array(101).fill(false);
let pins = {}; // Aquí guardaremos los PINs. Ejemplo: { 'JUAN123': 2, 'MARIA456': 5 }

// Obtener todos los números
app.get('/api/numbers', (req, res) => {
    res.json(numbers);
});

// Elegir un número (Ahora requiere PIN)
app.post('/api/pick', (req, res) => {
    const { number, pin } = req.body;

    // Verificar si el PIN existe y tiene intentos mayores a 0
    if (!pin || pins[pin] === undefined || pins[pin] <= 0) {
        return res.status(403).json({ success: false, message: 'PIN inválido o ya no te quedan intentos.' });
    }

    if (number >= 1 && number <= 100) {
        if (!numbers[number]) {
            numbers[number] = true;
            pins[pin] -= 1; // Le restamos un intento al PIN
            res.json({ success: true, message: `¡Éxito! Te quedan ${pins[pin]} intentos con este PIN.` });
        } else {
            res.status(400).json({ success: false, message: 'El número ya está ocupado.' });
        }
    } else {
        res.status(400).json({ success: false, message: 'Número inválido.' });
    }
});

// Crear un PIN nuevo (Solo Admin)
app.post('/api/create-pin', (req, res) => {
    const { password, pinName, limit } = req.body;
    
    if (password === 'admin123') { 
        if (!pinName || limit <= 0) {
            return res.status(400).json({ success: false, message: 'Datos de PIN inválidos.' });
        }
        pins[pinName] = parseInt(limit);
        res.json({ success: true, message: `PIN '${pinName}' creado con ${limit} opciones para elegir.` });
    } else {
        res.status(403).json({ success: false, message: 'Contraseña incorrecta. No autorizado.' });
    }
});

// Reiniciar la tabla (Solo Admin)
app.post('/api/reset', (req, res) => {
    const { password } = req.body;
    if (password === 'admin123') { 
        numbers = Array(101).fill(false);
        pins = {}; // También borramos los PINs al reiniciar
        res.json({ success: true, message: 'La tabla y los PINs han sido reiniciados.' });
    } else {
        res.status(403).json({ success: false, message: 'Contraseña incorrecta. No autorizado.' });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});