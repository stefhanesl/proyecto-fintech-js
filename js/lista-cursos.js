//Variables
const cursosFintech = document.querySelector('#cursos-fintech');
const listaCursosCarrito =  document.querySelector('#lista-cursos-carrito tbody')
const carrito = document.querySelector('#carrito')
const btnVaciarCar = document.querySelector('#vaciar-carrito-ventana')
let cursosSeleccionados = []


//Eventos
escuchadorEventos()
function escuchadorEventos(){
    document.addEventListener('DOMContentLoaded', (e) => {
        cargarCursos(cursos);
        cargaCursosLocalStorage()
    })
    cursosFintech.addEventListener('click', adicionarParaCarrito)
    carrito.addEventListener('click', eliminarCarrito )
    btnVaciarCar.addEventListener('click', vaciarCarrito)
}

//funciones
function cargarCursos(cursosf){

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
function limpiarHtml(){
    while(cursosFintech.firstChild){
        cursosFintech.removeChild(cursosFintech.firstChild)
    }
}
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
        cursosSeleccionados = [...cursosSeleccionados, cursoObjeto]
        
    }
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
        agregarCursoALaTablaCarrito()
    }
}
function vaciarCarrito(){
    cursosSeleccionados = []
    agregarCursoALaTablaCarrito()
}