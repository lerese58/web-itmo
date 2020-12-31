// import * as DomAPI from '../APIs/DOM/DomAPI'
// import {addToFavorites, handleOffline} from "./handlers/handlers";
// import {updateFavList, updateLocalWeather} from "./utils/utils";
// import { localWeatherComponent, weatherWaitingComponent, weatherComponent, localWeatherWaitingComponent } from '../components/components'

const DomAPI = require('./APIs/DOM/DomAPI');
const { localWeatherWaitingComponent } = require('./components/components');
const { addToFavorites, handleOffline } = require('./handlers/handlers');
const { updateFavList, updateLocalWeather } = require('./utils/utils');


DomAPI.insertComponent(localWeatherWaitingComponent(), DomAPI.localWeatherItemParent())

updateFavList()
updateLocalWeather()

const refreshBtn = document.querySelector('.refresh-btn')
refreshBtn.addEventListener('click', updateLocalWeather)
const favCityForm = document.querySelector('form.fav-search')
favCityForm.addEventListener('submit', addToFavorites)

window.addEventListener('offline', handleOffline)
