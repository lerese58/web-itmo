const weatherAPI = new WeatherAPI()

if (!localStorage.getItem('favCityList'))
    localStorage.setItem('favCityList', '[]')

updateFavList()
updateLocalWeather()

const refreshBtn = document.querySelector('.refresh-btn')
refreshBtn.addEventListener('click', updateLocalWeather)
const favCityForm = document.querySelector('form.fav-search')
favCityForm.addEventListener('submit', addToFavorites)