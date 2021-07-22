const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');

const criptomonedasSelect = document.querySelector('#criptomonedas');
const monedaSelect = document.querySelector('#moneda');

const objBusqueda = { // objeto con los datos de formulario
    moneda: '',
    criptomoneda: ''
}

// Crear un promise 
const obtenerCriptomonedas = criptomonedas => new Promise( resolve => { 
    resolve(criptomonedas); // se ejecuta solo si se pudo hacer la descarga de la api
});

document.addEventListener('DOMContentLoaded', () => {
    consultarCriptomonedas();
    
    formulario.addEventListener('submit', submitFormulario)

    criptomonedasSelect.addEventListener('change', leerValor);
    monedaSelect.addEventListener('change', leerValor); // lee el valor de los inputs con una función
});

function consultarCriptomonedas() {
    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD';

    fetch(url)
        .then( respuesta => respuesta.json() )
        .then( json=> obtenerCriptomonedas(json.Data) )
        .then( criptomonedas => selectCriptomonedas(criptomonedas) )
}

function selectCriptomonedas(criptomonedas) { // genera los option del select en base a los datos descargados de la api
    criptomonedas.forEach( cripto => {
        const { FullName, Name } = cripto.CoinInfo;

        const optionCripto = document.createElement('option');
        optionCripto.textContent = FullName;
        optionCripto.value = Name;

        criptomonedasSelect.appendChild(optionCripto);
    } );
}

function leerValor(e) {
    objBusqueda[e.target.name] = e.target.value;
}

function submitFormulario(e) {
    e.preventDefault();

    const { criptomoneda, moneda } = objBusqueda;

    if(criptomoneda === '' || moneda === '') {
        mostrarAlerta('Ambos campos son obligatorios');
        return;
    }

    // Consultar la API con los resultados
    consultarAPI();

}

function consultarAPI() {
    const { moneda, criptomoneda } = objBusqueda;

    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`

    mostrarSpinner();

    setTimeout(() => {
        fetch(url)
            .then(respuesta => respuesta.json())
            .then(json => {
                mostrarCotizacionHTML(json.DISPLAY[criptomoneda][moneda]);
            })
    }, 2000);
}

function mostrarCotizacionHTML(cotizacion) {

    limpiarHTML();

    const { PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE } = cotizacion;

    const precio = document.createElement('p');
    precio.classList.add('precio');
    precio.innerHTML = `El Precio es: <span>${PRICE}</span>`;

    const precioAlto = document.createElement('p');
    precioAlto.innerHTML = `Precio más alto del día <span>${HIGHDAY}</span>`;
    
    const precioBajo = document.createElement('p');
    precioBajo.innerHTML = `Precio más bajo del día <span>${LOWDAY}</span>`;
    
    const ultimasHoras = document.createElement('p');
    ultimasHoras.innerHTML = `Variación últimas 24 horas <span>${CHANGEPCT24HOUR}%</span>`;
    
    const actualizacion = document.createElement('p');
    actualizacion.innerHTML = `Última actualización <span>${LASTUPDATE}</span>`;

    resultado.appendChild(precio);
    resultado.appendChild(precioAlto);
    resultado.appendChild(precioBajo);
    resultado.appendChild(ultimasHoras);
    resultado.appendChild(actualizacion);
}

function mostrarAlerta(msg) {
    const existeError = document.querySelector('.error');

    if(!existeError) {
        const alerta = document.createElement('div');
        alerta.classList.add('error');
        alerta.textContent = msg;
    
        formulario.appendChild(alerta);
        setTimeout(() => {
            alerta.remove();
        }, 3000);
    }
}

function limpiarHTML() {
    while(resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }
}

function mostrarSpinner() {
    limpiarHTML();

    const spinner = document.createElement('div');
    spinner.classList.add('sk-folding-cube');
    spinner.innerHTML = `
        <div class="sk-cube1 sk-cube"></div>
        <div class="sk-cube2 sk-cube"></div>
        <div class="sk-cube4 sk-cube"></div>
        <div class="sk-cube3 sk-cube"></div>
    `;

    resultado.appendChild(spinner);
}

