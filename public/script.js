const grid = document.getElementById('grid');

// Mostrar/Ocultar controles de admin
function toggleAdmin() {
    const role = document.getElementById('role').value;
    document.getElementById('admin-controls').style.display = role === 'admin' ? 'block' : 'none';
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
            box.classList.add('taken'); // Rojo si está ocupado
        } else {
            box.onclick = () => pickNumber(i); // Clickeable si está libre
        }
        grid.appendChild(box);
    }
}

// Elegir un número
async function pickNumber(num) {
    if(!confirm(`¿Seguro que quieres elegir el número ${num}?`)) return;

    const res = await fetch('/api/pick', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ number: num })
    });
    const data = await res.json();
    
    if (data.success) {
        fetchNumbers(); 
    } else {
        alert(data.message);
    }
}

// Reiniciar la tabla (Admin)
async function resetTable() {
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
// Actualizar la tabla cada 3 segundos para ver selecciones de otras personas
setInterval(fetchNumbers, 3000);