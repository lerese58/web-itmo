const localWeatherItemParent = document.querySelector('.local-weather-item')
const weatherItemParent = document.querySelector('.weather-item-list');

/**
 * City close button handler
 * @param evt
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
 * Favorites form submit handler
 * @param evt
 * @returns {void}
 */
const addToFavorites = async evt => {
    evt.preventDefault()
    const searchInputElement = document.getElementById('fav-city-search')
    const cityInputValue = searchInputElement.value.trim()
    if (cityInputValue === '') return
    searchInputElement.value = ''
    const favoritesListFromDB = await favoritesAPI.getList()

    if (favoritesListFromDB.includes(cityInputValue)){
        alert(`${cityInputValue} уже добавлен`)
        return;
    }

    const newUncheckedCityNode = undefinedCityComponent(cityInputValue)
    const insertedUncheckedElement = insertComponent(newUncheckedCityNode, weatherItemParent)

    const weatherForNewCityResponse = await weatherAPI.getByCity(cityInputValue)
    if (weatherForNewCityResponse.cod === 200) {
        const newCheckedCityNode = weatherWaitingComponent(weatherForNewCityResponse.name)
        const uncheckedCityElem = document.getElementById(`undefined-city-${encodeURI(cityInputValue)}`)
        replaceComponent(newCheckedCityNode, weatherItemParent, uncheckedCityElem)

        // cityInputValue is not the same with weatherForNewCityResponse.name
        // check for duplicate again
        if (favoritesListFromDB.includes(weatherForNewCityResponse.name)) {
            alert(`${weatherForNewCityResponse.name} уже добавлен`)
            removeElement(document.getElementById(`waiting-${encodeURI(weatherForNewCityResponse.name)}`))
        } else {
            const addToDbResponse = await favoritesAPI.addCity(weatherForNewCityResponse.name)
            if (addToDbResponse.status === 200) {
                const newWeatherNode = weatherComponent(weatherForNewCityResponse)
                const waitingElem = document.getElementById(`waiting-${encodeURI(weatherForNewCityResponse.name)}`)
                replaceComponent(newWeatherNode, weatherItemParent, waitingElem)
            } else {
                alert(addToDbResponse.error)
            }
        }
    } else if (weatherForNewCityResponse.cod === '404') {
        alert(`${cityInputValue} не найден`)
        removeElement(insertedUncheckedElement)
    }
}

/**
 * @param{string} cityToAdd
 */
const addCityElement = (cityToAdd) => {
    const insertedWaitingElement = insertComponent(weatherWaitingComponent(cityToAdd), weatherItemParent)
    weatherAPI.getByCity(cityToAdd)
        .then(weather => replaceComponent(weatherComponent(weather), weatherItemParent, insertedWaitingElement))
        .catch(() => alert('Что-то пошло не так... Пожалуйста, обновите страницу'))
}

/**
 * Get difference between cities in page and in DB
 * and returns cities to add
 * @returns {Promise<Array<string>>}
 */
const getAddedCities = async () => {
    const favoritesListFromDB = await favoritesAPI.getList()
    let citiesToAdd = []
    if (weatherItemParent.children.length !== favoritesListFromDB.length) {
        favoritesListFromDB.forEach(cityName => {
            if (!weatherItemParent.querySelector(`[key="${encodeURI(cityName)}"]`))
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
    if (favoritesListFromDB.length !== weatherItemParent.children.length)
        for (const cityElem of weatherItemParent.children) {
            const currentCityName = cityElem.querySelector('.city-name').innerText
            if (!(favoritesListFromDB.includes(currentCityName)))
                citiesElemToRemove.push(cityElem)
        }
    return citiesElemToRemove
}

function updateLocalWeather() {
    localWeatherItemParent.innerHTML = ""
    insertComponent(localWeatherWaitingComponent(), localWeatherItemParent)
    navigator.geolocation.getCurrentPosition(async position => {
            weatherAPI.getByPosition(position)
                .then(weather => {
                    localWeatherItemParent.innerHTML = ""
                    insertComponent(localWeatherComponent(weather), localWeatherItemParent)
                })
                .catch(() => alert('Что-то пошло не так... Пожалуйста, обновите страницу 1'))
        },
        positionError => {
            alert(`${positionError.message}.\n Город выбран по умолчанию`)
            const defaultCityName = 'Уфа'
            weatherAPI.getByCity(defaultCityName)
                .then(weather => {
                    localWeatherItemParent.innerHTML = ""
                    insertComponent(localWeatherComponent(weather), localWeatherItemParent)
                })
                .catch('Что-то пошло не так... Пожалуйста, обновите страницу 2')
        })
}

async function updateFavList() {
    const citiesToAdd = await getAddedCities()
    const citiesElemToRemove = await getDeletedCityElements()
    citiesElemToRemove.forEach(cityElemToRemove => removeElement(cityElemToRemove))
    citiesToAdd.forEach(cityToAdd => addCityElement(cityToAdd))
}

/**
 * @param{DocumentFragment} componentNode
 * @param{Element} parentElement
 * @returns {Element}
 */
function insertComponent(componentNode, parentElement) {
    parentElement.append(componentNode)
    return parentElement.lastElementChild
}

/**
 * @param{Element} elementToRemove
 */
function removeElement(elementToRemove) {
    elementToRemove.remove()
}

/**
 * @param{DocumentFragment} componentNode
 * @param{Element} parentElement
 * @param{Element} oldChildElement
 * @returns {Element}
 */
function replaceComponent(componentNode, parentElement, oldChildElement) {
    return parentElement.replaceChild(componentNode, oldChildElement)
}