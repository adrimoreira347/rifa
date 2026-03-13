const grid = document.getElementById('grid');

// Mostrar/Ocultar controles según el rol
function toggleAdmin() {
    const role = document.getElementById('role').value;
    document.getElementById('admin-controls').style.display = role === 'admin' ? 'block' : 'none';
    document.getElementById('player-controls').style.display = role === 'player' ? 'block' : 'none';
}

// Traer los números del servidor
async function fetchNumbers() {
    try {
        const res = await fetch('/api/numbers');
        const numbers = await res.json();
        renderGrid(numbers);
    } catch (error) {
        console.error("Error conectando con el servidor");
    }
}

// Dibujar la cuadrícula en HTML
function renderGrid(numbers) {
    grid.innerHTML = '';
    for (let i = 1; i <= 100; i++) {
        const box = document.createElement('div');
        box.classList.add('number-box');
        box.innerText = i;
        
        if (numbers[i]) {
            box.classList.add('taken'); 
        } else {
            box.onclick = () => pickNumber(i); 
        }
        grid.appendChild(box);
    }
}

// Elegir un número (Ahora envía el PIN)
async function pickNumber(num) {
    const pin = document.getElementById('player-pin').value;
    
    if (!pin) {
        alert("Por favor, ingresa tu PIN antes de elegir un número.");
        return;
    }

    if(!confirm(`¿Seguro que quieres usar un intento de tu PIN en el número ${num}?`)) return;

    const res = await fetch('/api/pick', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ number: num, pin: pin })
    });
    const data = await res.json();
    
    alert(data.message);
    if (data.success) {
        fetchNumbers(); 
    }
}

// Crear un PIN (Admin)
async function createPin() {
    const pass = document.getElementById('admin-pass').value;
    const pinName = document.getElementById('new-pin-name').value;
    const limit = document.getElementById('new-pin-limit').value;

    const res = await fetch('/api/create-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pass, pinName: pinName, limit: limit })
    });
    const data = await res.json();
    
    alert(data.message);
    if (data.success) {
        document.getElementById('new-pin-name').value = '';
        document.getElementById('new-pin-limit').value = '';
    }
}

// Reiniciar la tabla (Admin)
async function resetTable() {
    if(!confirm('¿Estás seguro? Esto borrará todos los números elegidos y todos los PINs creados.')) return;

    const pass = document.getElementById('admin-pass').value;
    const res = await fetch('/api/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pass })
    });
    const data = await res.json();
    
    alert(data.message);
    if (data.success) {
        fetchNumbers();
    }
}

// Iniciar
fetchNumbers();
setInterval(fetchNumbers, 3000);