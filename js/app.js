const container = document.querySelector('.container');
const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');

window.addEventListener('load', () => {
    formulario.addEventListener('submit', buscarClima);
})

function buscarClima(e) {
    e.preventDefault()

    // validar
    const ciudad = document.querySelector('#ciudad').value;
    const pais = document.querySelector('#pais').value;

    if (ciudad ===  '' || pais === '') {
        // hubo un error
        mostrarError('Ambos campos son obligatorios')
        return;
    }
    
    // consultar la API
    consultarAPI(ciudad, pais);
}

function mostrarError(mensaje) {
    const alerta = document.querySelector('.bg-red-100');
    
    if(!alerta) {
         // crear una alerta
    const alerta = document.createElement('div');

    alerta.classList.add('bg-red-100', 'border-red-400', 'text-red-700', 'px-4', 'py-3', 'rounded', 'max-w-md', 'mx-auto', 'mt-6', 'text-center');

    alerta.innerHTML = `
    <strong class="font-bold">Error!</strong>
    <span class="block">${mensaje}</span>
    
    `;

    container.appendChild(alerta);

    // se elimine la alerta despues de 3 segundos
    setTimeout(() => {
        alerta.remove();
    }, 3000);
    }
}

function consultarAPI(ciudad, pais) {

    const appId = '1a2b49480e77635588bdb1f8d58b513f';

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${appId}`;

    fetch(url)
        .then(respuesta => respuesta.json())
        .then( datos => {
            limpiarHTML();
            if(datos.cod === "404") {
                mostrarError('Ciudad no encontrada')
                return;
            }

            // imprime la respuesta en el html
            mostrarClima(datos);

        })
}

function mostrarClima(datos) {
    const { main: { temp, temp_max, temp_min } } = datos;

    const centigrados = kelvinACentigrados(temp);

    const actual = document.createElement('p');
    actual.innerHTML = `${centigrados} &#8451;`;
    actual.classList.add('font-bold', 'text-6xl');

    const resultadoDiv = document.createElement('div');
    resultadoDiv.classList.add('text-center', 'text-white');
    resultadoDiv.appendChild(actual);

    resultado.appendChild(resultadoDiv);
}

const kelvinACentigrados = grados => parseInt(grados - 273.15);

function limpiarHTML() {
    while(resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }
}