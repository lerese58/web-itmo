const DomAPI = require('../APIs/DOM/DomAPI')
const favoritesAPI = require('../APIs/favorites/favoritesAPI')
const weatherAPI = require('../APIs/weather/weatherAPI')

const {
    weatherWaitingComponent,
    weatherComponent,
    localWeatherWaitingComponent,
    localWeatherComponent,
    unknownCityComponent
} = require('../components/components')


/**
 * @param{string} cityToAdd
 */
const addCityElement = cityToAdd => {
    const insertedWaitingElement = DomAPI.insertComponent(weatherWaitingComponent(cityToAdd), DomAPI.weatherItemParent())
    weatherAPI.getByCity(cityToAdd)
        .then(weather => DomAPI.replaceComponent(weatherComponent(weather), DomAPI.weatherItemParent(), insertedWaitingElement))
        .catch(() => window.alert('Что-то пошло не так... Пожалуйста, обновите страницу'))
};

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
};

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
};

const updateLocalWeather = () => {
    DomAPI.localWeatherItemParent().innerHTML = ""
    DomAPI.insertComponent(localWeatherWaitingComponent(), DomAPI.localWeatherItemParent())

    navigator.geolocation.getCurrentPosition(position => {
            weatherAPI.getByPosition(position)
                .then(weather => {
                    DomAPI.localWeatherItemParent().innerHTML = ""
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
};

const updateFavList = () => {
    getAddedCities()
        .then(cityToAddList => cityToAddList
            .forEach(cityName => addCityElement(cityName)))

    getDeletedCityElements()
        .then(elemToRemoveList => elemToRemoveList
            .forEach(elem => DomAPI.removeElement(elem)))
};

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

    if (favoritesListFromDB.includes(cityInputValue)) {
        window.alert(`${cityInputValue} уже добавлен`)
        return;
    }

    const newUncheckedCityNode = unknownCityComponent(cityInputValue)
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
};

/**
 * Network lost handler
 * @returns {void}
 */
const handleOffline = () => {
    if (!navigator.onLine)
        alert('Connection lost. Please check your connection')
};

module.exports = {
    updateFavList,
    updateLocalWeather,
    getDeletedCityElements,
    getAddedCities,
    addCityElement,
    addToFavorites,
    handleOffline
}
