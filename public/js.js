document.getElementById('btnRegistrar').addEventListener('click', async () => {
    const data = {
        nombre_emprendimiento: document.getElementById('TituloEmprendimiento').value,
        categoria: document.getElementById('categoria').value,
        nombre: document.getElementById('nombre').value,
        correo: document.getElementById('correo').value
    };

    try {
        const response = await fetch('/feria/registrar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        alert(result.mensaje);
    } catch (error) {
        alert('Error: ' + error.message);
    }
});