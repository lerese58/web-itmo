const weatherAPI = new WeatherAPI()

if (!localStorage.getItem('favCityList'))
    localStorage.setItem('favCityList', '[]')

updateFavList()
updateLocalWeather()

const refreshBtn = document.querySelector('.refresh-btn')
refreshBtn.addEventListener('click', updateLocalWeather)
const addFavBtn = document.querySelector('.add-fav-btn')
addFavBtn.addEventListener('click', addToFavorites)