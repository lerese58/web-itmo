const DomAPI = require('./APIs/DOM/DomAPI');

const { updateFavList, updateLocalWeather, addToFavorites, handleOffline } = require('./utils/utils');
const { localWeatherWaitingComponent } = require('./components/components');


DomAPI.insertComponent(localWeatherWaitingComponent(), DomAPI.localWeatherItemParent())

updateFavList()
updateLocalWeather()

const refreshBtn = document.querySelector('.refresh-btn')
refreshBtn.addEventListener('click', updateLocalWeather)
const favCityForm = document.querySelector('form.fav-search')
favCityForm.addEventListener('submit', addToFavorites)

window.addEventListener('offline', handleOffline)
