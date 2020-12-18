const weatherAPI = new WeatherAPI()
const favoritesAPI = new FavoritesAPI()

insertComponent(localWeatherWaitingComponent(), localWeatherItemParent)

if (!localStorage.getItem('favCityList'))
    localStorage.setItem('favCityList', '[]')

fetch('http://127.0.0.1:8088/signin', { mode: 'no-cors' })
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
