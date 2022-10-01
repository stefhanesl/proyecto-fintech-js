const contenedorCripto = document.querySelector('.contenedor-inversion')
const tablaCripto = document.querySelector('.contenedor-criptomonedas tbody')

const peticionApi = async() => {

    const response = await fetch('https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD')
    const data = await response.json()
    let datos = data.Data
    
    limpiarHTML()

    datos.forEach( (cripto, index) => {
        const row = document.createElement('tr')
        row.innerHTML = `
            <th scope="row">${index+1}</th>
            <td><img src='https://www.cryptocompare.com${cripto.CoinInfo.ImageUrl}' width='23px'/></td>
            <td>${cripto.CoinInfo.FullName}</td>
            <td>${cripto.CoinInfo.Name}</td>
            <td>${cripto.DISPLAY.USD.PRICE}</td>
            <td>${cripto.DISPLAY.USD.HIGHDAY}</td>
            <td>${cripto.DISPLAY.USD.LOWDAY}</td>
            <td>${cripto.DISPLAY.USD.MKTCAP}</td>
            <td>${cripto.DISPLAY.USD.VOLUME24HOUR}</td>
        `
        tablaCripto.appendChild(row)
    })

}
setInterval(() => {
    peticionApi()
}, 3000);
spinner()
function limpiarHTML(){
    while(tablaCripto.firstChild){
        tablaCripto.removeChild(tablaCripto.firstChild)
    }
}
