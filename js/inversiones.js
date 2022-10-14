const contenedorCripto = document.querySelector('.contenedor-inversion')
const contenedorTabla = document.querySelector('.contenedor-criptomonedas')
const tablaCripto = document.querySelector('.contenedor-criptomonedas tbody')


document.addEventListener('DOMContentLoaded', (e) => {

    let divCarga = document.querySelector('.carga')

    setTimeout(() => {

        divCarga.style.display = 'none'
        contenedorTabla.style.visibility = 'visible'

    }, 3000);
})


const peticionApi = async () => {

    try{
        const response = await fetch('https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD')
        const data = await response.json()
        let datos = data.Data

        limpiarHTML()

        datos.forEach((cripto, index) => {
            const row = document.createElement('tr')
            row.innerHTML = `
                <th scope="row">${index + 1}</th>
                <td><img src='https://www.cryptocompare.com${cripto.CoinInfo.ImageUrl}' width='23px'/></td>
                <td>${cripto.CoinInfo.FullName}</td>
                <td>${cripto.CoinInfo.Name}</td>
                <td>${cripto.DISPLAY ? cripto.DISPLAY.USD.PRICE : 'La información no esta disponible.'}</td>
                <td>${cripto.DISPLAY ? cripto.DISPLAY.USD.HIGHDAY : 'La información no esta disponible.'}</td>
                <td>${cripto.DISPLAY ? cripto.DISPLAY.USD.LOWDAY : 'La información no esta disponible.'}</td>
                <td>${cripto.DISPLAY ? cripto.DISPLAY.USD.MKTCAP : 'La información no esta disponible.'}</td>
                <td>${cripto.DISPLAY ? cripto.DISPLAY.USD.VOLUME24HOUR : 'La información no esta disponible.'}</td>
            `
            tablaCripto.appendChild(row)
        })
    }catch (error){
        console.log('ERROR: ', error)
    }

}
setInterval(() => {
    peticionApi()
}, 3000);

function limpiarHTML() {
    while (tablaCripto.firstChild) {
        tablaCripto.removeChild(tablaCripto.firstChild)
    }
}
