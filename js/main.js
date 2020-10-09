const weatherAPI = new WeatherAPI()

const localWeatherItemParent = document.querySelector('.local-weather-item')
const weatherItemParent = document.querySelector('.weather-item-list');
if (!localStorage.getItem('favCityList'))
    localStorage.setItem('favCityList', '[]')

function updateLocalWeather() {
    localWeatherItemParent.innerHTML = ""
    const waitingItem = localWeatherItemWaiting()
    insertComponent(waitingItem, localWeatherItemParent)
    navigator.geolocation.getCurrentPosition(async position => {
            weatherAPI.getByPosition(position)
                .then(weather => {
                    localWeatherItemParent.innerHTML = ""
                    insertComponent(localWeatherItem(weather), localWeatherItemParent)
                })
                .catch(() => alert('Что-то пошло не так... Пожалуйста, обновите страницу'))
        },
        positionError => console.log(positionError.message))
}

updateFavList()
updateLocalWeather()

const refreshBtn = document.querySelector('.refresh-btn')
refreshBtn.addEventListener('click', updateLocalWeather)
const addFavBtn = document.querySelector('.add-fav-btn')
addFavBtn.addEventListener('click', addToFavorites)