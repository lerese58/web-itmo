const weatherAPI = new WeatherAPI()

insertComponent(localWeatherWaitingComponent(), localWeatherItemParent)

if (!localStorage.getItem('favCityList'))
    localStorage.setItem('favCityList', '[]')

fetch('https://a8ee4eb0b762.ngrok.io/signin', {mode: 'no-cors'})
    .then(value => console.log(value))

updateFavList()
updateLocalWeather()

const refreshBtn = document.querySelector('.refresh-btn')
refreshBtn.addEventListener('click', updateLocalWeather)
const favCityForm = document.querySelector('form.fav-search')
favCityForm.addEventListener('submit', addToFavorites)

function handleOffline() {
    if (!navigator.onLine)
        alert('Connection lost. Please check your connection')
}

window.addEventListener('offline', handleOffline)
