const localWeatherItemParent = document.querySelector('.local-weather-item')
const weatherItemParent = document.querySelector('.weather-item-list');

const removeFromFavorites = evt => {
    const currentCityElem = evt.currentTarget.parentElement.parentElement
    const currentCityName = currentCityElem.querySelector(`.city-name`).textContent

    const favCityList = favoritesAPI.getList()
    // localStorage.setItem('favCityList', JSON.stringify(favCityList.filter(cityName => cityName !== currentCityName)))
    favoritesAPI.deleteCity(currentCityName)
    currentCityElem.remove()
}
const addToFavorites = async evt => {
    evt.preventDefault()
    const searchInput = document.getElementById('fav-city-search')
    const cityName = searchInput.value.trim()
    if (cityName === '')
        return
    searchInput.value = ''
    // const favCityList = JSON.parse(localStorage.getItem('favCityList'))
    const favCityList = favoritesAPI.getList()

    if (Object.values(favCityList).includes(cityName)){
        alert(`${cityName} уже добавлен`)
        return;
    }

    const newUncheckedCityNode = undefinedCityComponent(cityName)
    const insertedUncheckedElement = insertComponent(newUncheckedCityNode, weatherItemParent)

    const response = await weatherAPI.getByCity(cityName)
    if (response.cod === 200) {
        const newCheckedCityNode = weatherWaitingComponent(response.name)
        const uncheckedCityElem = document.getElementById(`undefined-city-${encodeURI(cityName)}`)
        replaceComponent(newCheckedCityNode, weatherItemParent, uncheckedCityElem)

        if (Object.values(favCityList).includes(response.name)) {
            alert(`${response.name} уже добавлен`)
            removeElement(document.getElementById(`waiting-${encodeURI(response.name)}`))
        } else {
            // localStorage.setItem('favCityList', JSON.stringify([response.name, ...favCityList]))
            favoritesAPI.addCity(response.name)
            const newWeatherNode = weatherComponent(response)
            const waitingElem = document.getElementById(`waiting-${encodeURI(response.name)}`)
            replaceComponent(newWeatherNode, weatherItemParent, waitingElem)
        }
    } else if (response.cod === '404') {
        alert(`${cityName} не найден`)
        removeElement(insertedUncheckedElement)
    }
}

const addCityElement = (cityToAdd) => {
    const insertedWaitingElement = insertComponent(weatherWaitingComponent(cityToAdd), weatherItemParent)
    weatherAPI.getByCity(cityToAdd)
        .then(weather => replaceComponent(weatherComponent(weather), weatherItemParent, insertedWaitingElement))
        .catch(() => alert('Что-то пошло не так... Пожалуйста, обновите страницу'))
}

const getAddedCities = async () => {
    const favCitiesObj = JSON.parse(localStorage.getItem('favCityList'))
    // const favCitiesObj = await favoritesAPI.getList()
    let citiesToAdd = []
    if (weatherItemParent.children.length !== favCitiesObj.length) {
        favCitiesObj.forEach(cityName => {
            if (!weatherItemParent.querySelector(`[key="${encodeURI(cityName)}"]`))
                citiesToAdd.push(cityName)
        })
    }
    return citiesToAdd
}

const getDeletedCityElements = async () => {
    const favCityList = JSON.parse(localStorage.getItem('favCityList'))
    // const favCityList = await favoritesAPI.getList()
    let citiesElemToRemove = []
    if (favCityList.length !== weatherItemParent.children)
        for (const cityElem of weatherItemParent.children) {
            const currentCityName = cityElem.querySelector('.city-name').innerText
            if (!(favCityList.includes(currentCityName)))
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
            const defaultCityName = 'Москва'
            weatherAPI.getByCity(defaultCityName)
                .then(weather => {
                    localWeatherItemParent.innerHTML = ""
                    insertComponent(localWeatherComponent(weather), localWeatherItemParent)
                })
                .catch('Что-то пошло не так... Пожалуйста, обновите страницу 2')
        })
}

function updateFavList() {
    // const citiesToAdd = getAddedCities()
    // const citiesElemToRemove = getDeletedCityElements()
    // citiesElemToRemove.forEach(cityElemToRemove => removeElement(cityElemToRemove))
    // citiesToAdd.forEach(cityToAdd => addCityElement(cityToAdd))
}

function insertComponent(componentNode, parentElement) {
    parentElement.append(componentNode)
    return parentElement.lastElementChild
}

function removeElement(elementToRemove) {
    elementToRemove.remove()
}

function replaceComponent(componentNode, parentElement, oldChildElement) {
    return parentElement.replaceChild(componentNode, oldChildElement)
}