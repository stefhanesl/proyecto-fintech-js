// const { default: Swal } = require("sweetalert2")

//Variables
const cursosFintech = document.querySelector('#cursos-fintech')
const listaCursosCarrito =  document.querySelector('#lista-cursos-carrito tbody')
const carrito = document.querySelector('#carrito')
const btnVaciarCar = document.querySelector('#vaciar-carrito-ventana')
const cantidadDeCursosCarrito =  document.querySelector('.cantidad-cursos')
const buscadorPalabraInput = document.querySelector('#buscador-input')
const agregarTotalTablaCarrito = document.querySelector('span[total-tabla="total"]')
let cursosSeleccionados = []


//Eventos

document.addEventListener('DOMContentLoaded', (e) => {
    cargarCursos(cursos);
    cargaCursosLocalStorage()
})
cursosFintech.addEventListener('click', (e) => {
    e.preventDefault()
    adicionarParaCarrito(e)
})
carrito.addEventListener('click', eliminarCarrito )
btnVaciarCar.addEventListener('click', vaciarCarrito)
buscadorPalabraInput.addEventListener('input', buscarCursos)

function limpiarHtml(){
    while(cursosFintech.firstChild){
        cursosFintech.removeChild(cursosFintech.firstChild)
    }
}
//funciones
function cargarCursos(cursosf){
    limpiarHtml()
    cursosf.forEach( curso => {

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
//Limpiar HTML

//Adicionar los cursos seleccionados a la ventana del carrito
function adicionarParaCarrito(e){
    e.preventDefault()
    if(e.target.classList.contains('buy')){
        const course = e.target.parentElement.parentElement;
        const cursoObjeto = {
            imagen: course.querySelector('img').src,
            nombre: course.querySelector('h3').textContent,
            precio: course.querySelector('h2').textContent,
            id: course.querySelector('a').getAttribute('data-id'),
            cantidad: 1
        }
        mostrarMensajeAlert('Ha agregado un curso', 'success', 'Acepto', `El curso de ${cursoObjeto.nombre} ha sido seleccionado`, cursoObjeto.imagen, 200)
        const cursoExiste = cursosSeleccionados.some( curso => curso.id === cursoObjeto.id )
        if( cursoExiste ){
            const cursosAdicionados = cursosSeleccionados.map( curso => {
                if( curso.id === cursoObjeto.id ){
                    curso.cantidad += 1;
                    return curso;
                }else{
                    return curso;
                }
            cursosSeleccionados = [...cursosAdicionados]
        })}else{
            cursosSeleccionados = [...cursosSeleccionados, cursoObjeto]
        }
    }
    contadorCursosTotales()
    agregarCursoALaTablaCarrito()
}
function agregarCursoALaTablaCarrito(){
    while(listaCursosCarrito.firstChild){
        listaCursosCarrito.removeChild(listaCursosCarrito.firstChild)
    }

    cursosSeleccionados.forEach( cursoSelecion => {

        const { id, nombre, precio, imagen, cantidad } = cursoSelecion;

        const fila =  document.createElement('tr');

        const prec = parseFloat(precio.substring(1));
        fila.innerHTML = `
            <td><img src=${imagen} alt='curso' width='50px'/></td>
            <td>${nombre} </td>
            <td>$${prec}</td>
            <td>${cantidad}</td>
            <td>$${prec*cantidad}</td>
            <td><a href='#' data-id=${id} class='eliminar-curso'>✖️</a></td>
        `
        listaCursosCarrito.appendChild(fila)
    })
    contadorCursosTotales()
    guardarLocalStorage(cursosSeleccionados)
}
function guardarLocalStorage(cursosAgregados){
    const datosCursos = JSON.stringify(cursosAgregados);
    localStorage.setItem('cursosEducacion', datosCursos)
}
function cargaCursosLocalStorage(){
    cursosSeleccionados = JSON.parse(localStorage.getItem('cursosEducacion')) || []
    agregarCursoALaTablaCarrito()
}
function eliminarCarrito(e){
    if(e.target.classList.contains('eliminar-curso')){
        const idElement = e.target.getAttribute('data-id')
        cursosSeleccionados =  cursosSeleccionados.filter( curso => curso.id !== idElement)
        contadorCursosTotales()
        agregarCursoALaTablaCarrito()
    }
}
function vaciarCarrito(){

    cursosSeleccionados = []
    contadorCursosTotales()
    agregarCursoALaTablaCarrito()
}
function contadorCursosTotales(){
    //!--------------------------------
    // agregarTotalTablaCarrito.removeChild()
    //!--------------------------------


    const cuentaCantidadTotalCursos = cursosSeleccionados.reduce( (total, curso) => total + curso.cantidad , 0)

    if(cuentaCantidadTotalCursos > 0){
        cantidadDeCursosCarrito.classList.add('cantidad-num')
        cantidadDeCursosCarrito.textContent = cuentaCantidadTotalCursos
    }else{
        cantidadDeCursosCarrito.classList.remove('cantidad-num')
        cantidadDeCursosCarrito.textContent = ''
    }
    //!--------------------------------
    //Sumar el total del monto comprado
    // const totalTablaCarrito = cursosSeleccionados.reduce((total, curso) => total + (parseFloat(curso.precio.substring(1)) * curso.cantidad) , 0)
    // agregarTotalTablaCarrito.appendChild(
    //     document.createTextNode(`$${totalTablaCarrito}`)
    //   )
    // console.log(totalTablaCarrito)
    // console.log(agregarTotalTablaCarrito)
    // agregarTotalTablaCarrito.textContent = (totalTablaCarrito).toFixed(2)
    //!--------------------------------

}
function buscarCursos(e){
    const palabra = e.target.value
   const cursosBuscadosArray = cursos.filter( curso => curso.nombre.toLowerCase().indexOf( palabra.toLowerCase()) !== -1)
   cargarCursos(cursosBuscadosArray)
}
function mostrarMensajeAlert(title, icon, confirmButtonText, text, img, height){
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