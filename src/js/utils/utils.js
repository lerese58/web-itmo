// import * as DomAPI from '../APIs/DOM/DomAPI'
// import * as favoritesAPI from '../APIs/favorites/favoritesAPI'
// import * as weatherAPI from '../APIs/weather/weatherAPI';

// import { localWeatherComponent, weatherWaitingComponent, weatherComponent, localWeatherWaitingComponent } from '../components/components'

const DomAPI = require('../APIs/DOM/DomAPI')
const favoritesAPI = require('../APIs/favorites/favoritesAPI')
const weatherAPI = require('../APIs/weather/weatherAPI')
const { localWeatherComponent, weatherWaitingComponent, weatherComponent, localWeatherWaitingComponent } = require('../components/components')

/**
 * @param{string} cityToAdd
 */
const addCityElement = (cityToAdd) => {
    const insertedWaitingElement = DomAPI.insertComponent(weatherWaitingComponent(cityToAdd), DomAPI.weatherItemParent())
    weatherAPI.getByCity(cityToAdd)
        .then(weather => DomAPI.replaceComponent(weatherComponent(weather), DomAPI.weatherItemParent(), insertedWaitingElement))
        .catch(() => window.alert('Что-то пошло не так... Пожалуйста, обновите страницу'))
}

/**
 * Get difference between cities in page and in DB
 * and returns cities to add
 * @returns {Promise<Array<string>>}
 */
const getAddedCities = async () => {
    const favoritesListFromDB = await favoritesAPI.getList()
    let citiesToAdd = []
    if (DomAPI.weatherItemParent().children.length !== favoritesListFromDB.length) {
        favoritesListFromDB.forEach(cityName => {
            if (!DomAPI.weatherItemParent().querySelector(`[key="${encodeURI(cityName)}"]`))
                citiesToAdd.push(cityName)
        })
    }
    return citiesToAdd
}

/**
 * Get difference between cities in page and in DB
 * and returns Elements to remove
 * @returns {Promise<Array<Element>>}
 */
const getDeletedCityElements = async () => {
    const favoritesListFromDB = await favoritesAPI.getList()
    const citiesElemToRemove = []
    if (favoritesListFromDB.length !== DomAPI.weatherItemParent().children.length)
        for (const cityElem of DomAPI.weatherItemParent().children) {
            const currentCityName = cityElem.querySelector('.city-name').innerText
            if (!(favoritesListFromDB.includes(currentCityName)))
                citiesElemToRemove.push(cityElem)
        }
    return citiesElemToRemove
}

const updateLocalWeather = () => {
    DomAPI.localWeatherItemParent().innerHTML = ""
    DomAPI.insertComponent(localWeatherWaitingComponent(), DomAPI.localWeatherItemParent())

    navigator.geolocation.getCurrentPosition(position => {
            weatherAPI.getByPosition(position)
                .then(weather => {
                    const p = DomAPI.localWeatherItemParent()
                    const c = localWeatherComponent(weather)
                    const i = DomAPI.insertComponent
                    i(c, p)
                    DomAPI.insertComponent(localWeatherComponent(weather), DomAPI.localWeatherItemParent())
                })
                .catch(() => {
                    console.log(position.coords)
                    window.alert('Что-то пошло не так... Пожалуйста, обновите страницу 1');
                })
        },
        positionError => {
            window.alert(`${positionError.message}.\n Город выбран по умолчанию`)
            const defaultCityName = 'Уфа'
            weatherAPI.getByCity(defaultCityName)
                .then(weather => {
                    DomAPI.localWeatherItemParent().innerHTML = ""
                    DomAPI.insertComponent(localWeatherComponent(weather), DomAPI.localWeatherItemParent())
                })
                .catch(() => {
                    console.log(defaultCityName)
                    window.alert('Что-то пошло не так... Пожалуйста, обновите страницу 2');
                })
        })
}

const updateFavList = () => {
    getAddedCities()
        .then(cityToAddList => cityToAddList
            .forEach(cityName => addCityElement(cityName)))

    getDeletedCityElements()
        .then(elemToRemoveList => elemToRemoveList
            .forEach(elem => DomAPI.removeElement(elem)))
}

// export {updateFavList, updateLocalWeather};
module.exports = { updateFavList, updateLocalWeather }
