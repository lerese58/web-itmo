const weatherAPI = new WeatherAPI()

const localWeatherItemParent = document.querySelector('.local-weather-item')
const weatherItemParent = document.querySelector('.weather-item-list');
localStorage.setItem('favCityList', '[]')

function updateLocalWeather() {
    localWeatherItemParent.innerHTML = ""
    const waitingItem = localWeatherItemWaiting()
    insertComponent(waitingItem, localWeatherItemParent)
    navigator.geolocation.getCurrentPosition(async position => {
            const weather = await weatherAPI.getByPosition(position)
            localWeatherItemParent.innerHTML = ""
            insertComponent(localWeatherItem(weather), localWeatherItemParent)
        },
        positionError => alert(positionError.message))
}

updateLocalWeather()
updateFavList()

const refreshBtn = document.querySelector('.refresh-btn')
refreshBtn.addEventListener('click', updateLocalWeather)
const addFavBtn = document.querySelector('.add-fav-btn')
addFavBtn.addEventListener('click', addToFavorites)