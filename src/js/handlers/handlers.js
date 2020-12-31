// import * as weatherAPI from "../APIs/weather/weatherAPI";
// import * as DomAPI from "../APIs/DOM/DomAPI";
// import * as favoritesAPI from "../APIs/favorites/favoritesAPI";
// import {undefinedCityComponent, weatherComponent, weatherWaitingComponent} from "../components/components";


const DomAPI = require('../APIs/DOM/DomAPI')
const favoritesAPI = require('../APIs/favorites/favoritesAPI')
const weatherAPI = require('../APIs/weather/weatherAPI')
const { undefinedCityComponent, weatherWaitingComponent, weatherComponent } = require('../components/components')


/**
 * Favorites form submit handler
 * @param{Event} evt
 * @returns {void}
 */
const addToFavorites = async evt => {
    evt.preventDefault()
    const searchInputElement = document.getElementById('fav-city-search')
    const cityInputValue = searchInputElement.value.trim()
    if (cityInputValue === '') {
        window.alert('Введите название города')
        return;
    }
    searchInputElement.value = ''
    const favoritesListFromDB = await favoritesAPI.getList()

    if (favoritesListFromDB.includes(cityInputValue)){
        window.alert(`${cityInputValue} уже добавлен`)
        return;
    }

    const newUncheckedCityNode = undefinedCityComponent(cityInputValue)
    const insertedUncheckedElement = DomAPI.insertComponent(newUncheckedCityNode, DomAPI.weatherItemParent())

    const weatherForNewCityResponse = await weatherAPI.getByCity(cityInputValue)
    if (weatherForNewCityResponse["cod"] === 200) {
        const newCheckedCityNode = weatherWaitingComponent(weatherForNewCityResponse.name)
        const uncheckedCityElem = document.getElementById(`undefined-city-${encodeURI(cityInputValue)}`)
        DomAPI.replaceComponent(newCheckedCityNode, DomAPI.weatherItemParent(), uncheckedCityElem)

        // cityInputValue is not the same with weatherForNewCityResponse.name
        // check for duplicate again
        if (favoritesListFromDB.includes(weatherForNewCityResponse.name)) {
            window.alert(`${weatherForNewCityResponse.name} уже добавлен`)
            DomAPI.removeElement(document.getElementById(`waiting-${encodeURI(weatherForNewCityResponse.name)}`))
        } else {
            const addToDbResponse = await favoritesAPI.addCity(weatherForNewCityResponse.name)
            if (addToDbResponse.status === 200) {
                const newWeatherNode = weatherComponent(weatherForNewCityResponse)
                const waitingElem = document.getElementById(`waiting-${encodeURI(weatherForNewCityResponse.name)}`)
                DomAPI.replaceComponent(newWeatherNode, DomAPI.weatherItemParent(), waitingElem)
            } else {
                window.alert(addToDbResponse.error)
            }
        }
    } else if (weatherForNewCityResponse["cod"] === '404') {
        window.alert(`${cityInputValue} не найден`)
        DomAPI.removeElement(insertedUncheckedElement)
    }
}


/**
 * City close button handler
 * @param{Event} evt
 * @returns {void}
 */
const removeFromFavorites = async evt => {
    const currentCityElem = evt.currentTarget.parentElement.parentElement
    const currentCityName = currentCityElem.querySelector(`.city-name`).textContent
    const deleteFromDbResponse = await favoritesAPI.deleteCity(currentCityName)
    if (deleteFromDbResponse.status === 200)
        currentCityElem.remove()
}


/**
 * Network lost handler
 * @returns {void}
 */
const handleOffline = () => {
    if (!navigator.onLine)
        alert('Connection lost. Please check your connection')
}

// export { removeFromFavorites, addToFavorites, handleOffline };
module.exports = { removeFromFavorites, addToFavorites, handleOffline };