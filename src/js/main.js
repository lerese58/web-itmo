import {localWeatherWaitingComponent} from "/src/js/components/components";
import {
    addToFavorites,
    insertComponent,
    localWeatherItemParent,
    updateFavList,
    updateLocalWeather
} from "/src/js/utils/utils";


insertComponent(localWeatherWaitingComponent(), localWeatherItemParent)

updateFavList().then(r => {})
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
