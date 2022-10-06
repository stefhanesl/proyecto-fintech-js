//Variables
const cursosFintech = document.querySelector('#cursos-fintech')
const listaCursosCarrito = document.querySelector('#lista-cursos-carrito tbody')
const carrito = document.querySelector('#carrito')
const btnVaciarCar = document.querySelector('#vaciar-carrito-ventana')
const cantidadDeCursosCarrito = document.querySelector('.cantidad-cursos')
const buscadorPalabraInput = document.querySelector('#buscador-input')
const agregarTotalTablaCarrito = document.querySelector('.total-factura')
const btnFinalizarCompra = document.querySelector('#finalizar-compra-ventana')
let cursosSeleccionados = []

//Eventos
document.addEventListener('DOMContentLoaded', (e) => {

    let divLoader = document.querySelector('.loader')

    cargaCursosLocalStorage()

    setTimeout(() => {

        divLoader.style.display = 'none'

        getFetch('../Datos/cursos.json')

            .then(respuesta => cargarCursos(respuesta))

    }, 4000);
})

cursosFintech.addEventListener('click', (e) => {
    e.preventDefault()
    adicionarParaCarrito(e)
})

carrito.addEventListener('click', eliminarCarrito)
btnVaciarCar.addEventListener('click', vaciarCarrito)
buscadorPalabraInput.addEventListener('input', buscarCursos)
btnFinalizarCompra.addEventListener('click', facturarCompra)
//funciones

const getFetch = async (ruta) => {

    const data = await fetch(ruta)

    const respuesta = data.json()

    return respuesta;

}

function limpiarHtml() {
    while (cursosFintech.firstChild) {
        cursosFintech.removeChild(cursosFintech.firstChild)
    }
}

function cargarCursos(cursosf) {

    limpiarHtml()

    cursosf.forEach(curso => {

        const { id, nombre, precio, imagenUrl } = curso;

        const divTarjeta = document.createElement('div');
        divTarjeta.classList.add('card')

        divTarjeta.innerHTML = `
                <div class="imgBox">
                    <img src= ${imagenUrl} alt="curso corsair" class="curso">
                </div>

                <div class="contentBox">
                    <h3>${nombre}</h3>
                    <h2 class="price">$${precio}</h2>
                    <a href="#" class="buy" data-id=${id}>Agregar al carrito</a>
                </div>
        `;
        cursosFintech.appendChild(divTarjeta)
    })
}

//Adicionar los cursos seleccionados a la ventana del carrito
function adicionarParaCarrito(e) {
    e.preventDefault()
    if (e.target.classList.contains('buy')) {
        const course = e.target.parentElement.parentElement;
        const cursoObjeto = {
            imagen: course.querySelector('img').src,
            nombre: course.querySelector('h3').textContent,
            precio: course.querySelector('h2').textContent.substring(1),
            id: course.querySelector('a').getAttribute('data-id'),
            cantidad: 1
        }
        mostrarMensajeAlert('Ha agregado un curso', 'success', 'Acepto', `El curso de ${cursoObjeto.nombre} ha sido seleccionado`, cursoObjeto.imagen, 200)
        const cursoExiste = cursosSeleccionados.some(curso => curso.id === cursoObjeto.id)
        if (cursoExiste) {
            const cursosAdicionados = cursosSeleccionados.map(curso => {
                if (curso.id === cursoObjeto.id) {
                    curso.cantidad += 1;
                    return curso;
                } else {
                    return curso;
                }
                cursosSeleccionados = [...cursosAdicionados]
            })
        } else {
            cursosSeleccionados = [...cursosSeleccionados, cursoObjeto]
        }
    }
    contadorCursosTotales()
    agregarCursoALaTablaCarrito()
}

function agregarCursoALaTablaCarrito() {
    while (listaCursosCarrito.firstChild) {
        listaCursosCarrito.removeChild(listaCursosCarrito.firstChild)
    }

    cursosSeleccionados.forEach(cursoSelecion => {

        const { id, nombre, precio, imagen, cantidad } = cursoSelecion;

        const fila = document.createElement('tr');

        fila.innerHTML = `
            <td><img src=${imagen} alt='curso' width='50px'/></td>
            <td>${nombre} </td>
            <td>$${precio}</td>
            <td>${cantidad}</td>
            <td>$${precio * cantidad}</td>
            <td><a href='#' data-id=${id} class='eliminar-curso'>✖️</a></td>
        `
        listaCursosCarrito.appendChild(fila)
    })
    contadorCursosTotales()
    guardarLocalStorage(cursosSeleccionados)
}

function guardarLocalStorage(cursosAgregados) {
    const datosCursos = JSON.stringify(cursosAgregados);
    localStorage.setItem('cursosEducacion', datosCursos)
}

function cargaCursosLocalStorage() {
    cursosSeleccionados = JSON.parse(localStorage.getItem('cursosEducacion')) || []
    agregarCursoALaTablaCarrito()
}

function eliminarCarrito(e) {
    if (e.target.classList.contains('eliminar-curso')) {
        const idElement = e.target.getAttribute('data-id')
        cursosSeleccionados = cursosSeleccionados.filter(curso => curso.id !== idElement)
        contadorCursosTotales()
        agregarCursoALaTablaCarrito()
    }
}

function vaciarCarrito() {

    cursosSeleccionados = []
    contadorCursosTotales()
    agregarCursoALaTablaCarrito()
}

function contadorCursosTotales() {

    const cuentaCantidadTotalCursos = cursosSeleccionados.reduce((total, curso) => total + curso.cantidad, 0)

    const precioTotalCursos = cursosSeleccionados.reduce((total, curso) => total + (curso.cantidad * curso.precio), 0)


    if (cuentaCantidadTotalCursos > 0) {
        cantidadDeCursosCarrito.classList.add('cantidad-num')
        cantidadDeCursosCarrito.textContent = cuentaCantidadTotalCursos
        agregarTotalTablaCarrito.innerHTML = `El total de su compra es: $${(precioTotalCursos).toFixed(2)}`
    } else {
        cantidadDeCursosCarrito.classList.remove('cantidad-num')
        cantidadDeCursosCarrito.textContent = ''
        agregarTotalTablaCarrito.innerHTML = ''
    }
}

function buscarCursos(e) {
    const palabra = e.target.value
    const cursosBuscadosArray = cursos.filter(curso => curso.nombre.toLowerCase().indexOf(palabra.toLowerCase()) !== -1)
    cargarCursos(cursosBuscadosArray)
}

function mostrarMensajeAlert(title, icon, confirmButtonText, text, img, height) {
    Swal.fire({
        title: title,
        icon: icon,
        confirmButtonText: confirmButtonText,
        confirmButtonColor: '#0F265C',
        iconColor: '#0F265C',
        text: text,
        imageUrl: img,
        imageHeight: height
    })
}

function facturarCompra() {
    if(cursosSeleccionados.length){
        Swal.fire({
            title: 'Desea finalizar la compra?',
            icon: 'info',
            showCancelButton: true,
            confirmButtonText: 'Sí, deseo',
            cancelButtonText: 'No, no quiero',
            confirmButtonColor: '#0f265c',
            cancelButtonColor: '#FF907F',
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: 'Compra realizada con exito.',
                    html: `<input type="text" id="login" class="swal2-input" placeholder="Escriba sus nombre...">
                <input type="number" id="number" class="swal2-input" placeholder="Escriba su telefono..."> 
                <input type="text" id="correo" class="swal2-input" placeholder="Escriba su correo...">`,
                    icon: 'info',
                    confirmButtonColor: '#0f265c',
                    confirmButtonText: 'Finalizar compra'
                }).then((respuesta) => {
                    Swal.fire({
                        title: 'Gracias por su compra.',
                        icon: 'success',
                        confirmButtonText: '¡Cool!',
                        confirmButtonColor: '#0f265c'
                    })
                })
                cursosSeleccionados = []
                localStorage.removeItem("cursosEducacion")
    
            } else {
                Swal.fire({
                    title: 'Compra no realizada',
                    icon: 'info',
                    text: `La compra no ha sido realizada! Atención sus productos siguen en el carrito 😃`,
                    confirmButtonColor: '#0f265c'
                })
            }
        })
    }else{
        Swal.fire({
            title: 'Usted no tiene productos en el carrito.',
            icon: 'info',
            confirmButtonColor: '#0f265c',
        })
    }


}