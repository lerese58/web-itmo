const removeFromFavorites = evt => {
    const currentCityName = evt.currentTarget.parentElement.firstElementChild.innerHTML
    const favCityList = JSON.parse(localStorage.getItem('favCityList'))
    localStorage.setItem('favCityList', JSON.stringify(favCityList.filter(cityName => cityName !== currentCityName)))
    updateFavList()
}
const addToFavorites = async evt => {
    evt.preventDefault()
    const searchInput = document.getElementById('fav-city-search')
    const cityName = searchInput.value.trim()
    const response = await weatherAPI.getByCity(cityName)
    if (response.cod === 200) {
        const favCityList = JSON.parse(localStorage.getItem('favCityList'))
        localStorage.setItem('favCityList', JSON.stringify([cityName, ...favCityList]))
        updateFavList()
    } else if (response.cod === '404')
        alert(`${cityName} не найден`)
    searchInput.value = ''
}

const getWeatherFieldsElementsFrom = weatherItemElement => {
    return {
        cityElem: weatherItemElement.querySelector('.city-name'),
        tempElem: weatherItemElement.querySelector('.temperature-value'),
        iconElem: weatherItemElement.querySelector('.weather-icon img'),
        windElem: weatherItemElement.querySelector('.wind .param-value'),
        cloudElem: weatherItemElement.querySelector('.cloud .param-value'),
        pressureElem: weatherItemElement.querySelector('.pressure .param-value'),
        humidityElem: weatherItemElement.querySelector('.humidity .param-value'),
        coordsElem: weatherItemElement.querySelector('.coords .param-value')
    }
}
const setWeatherParams = (el, weatherObj) => {
    const {cityElem, tempElem, iconElem, windElem, cloudElem, pressureElem, humidityElem, coordsElem} = getWeatherFieldsElementsFrom(el)
    cityElem.innerHTML = weatherObj.name
    tempElem.innerHTML = `${Math.round(weatherObj.main.temp)}°C`
    iconElem.src = weatherAPI.getIconURL(weatherObj.weather[0].icon)
    windElem.innerHTML = `${weatherObj.wind.speed} м/с`
    cloudElem.innerHTML = `${weatherObj.clouds.all}%`
    pressureElem.innerHTML = `${weatherObj.main.pressure} hpa`
    humidityElem.innerHTML = `${weatherObj.main.humidity}%`
    coordsElem.innerHTML = `[${weatherObj.coord.lon} ${weatherObj.coord.lat}]`
    return el
};

const localWeatherItemWaiting = () => {
    const localWeatherWaitingTemplate = document.querySelector('template#local-weather-item-waiting')
    return document.importNode(localWeatherWaitingTemplate.content, true)
}
const localWeatherItem = (weather) => {
    const localWeatherTemplate = document.querySelector('template#local-weather-item')
    const newLocalWeatherItem = document.importNode(localWeatherTemplate.content, true)
    setWeatherParams(newLocalWeatherItem, weather)
    return newLocalWeatherItem
}
const weatherItemWaiting = (cityName) => {
    const weatherItemWaitingTemplate = document.querySelector('template#weather-item-waiting')
    const newItemWaiting = document.importNode(weatherItemWaitingTemplate.content, true)
    newItemWaiting.querySelector('.city-name').innerText = cityName
    newItemWaiting.firstElementChild.setAttribute('key', cityName)
    return newItemWaiting
}
const weatherItem = (weather) => {
    const weatherItemTemplate = document.querySelector('template#weather-item')
    const newItem = document.importNode(weatherItemTemplate.content, true)
    setWeatherParams(newItem, weather)
    newItem.querySelector('.remove-city-btn').addEventListener('click', removeFromFavorites)
    newItem.firstElementChild.setAttribute('key', weather.name)
    return newItem
}

const updateFavList = () => {
    const favCityList = JSON.parse(localStorage.getItem('favCityList'))
    let citiesToAdd = [], citiesElemToRemove = []

    for (const i in favCityList) {
        const cityName = favCityList[i]
        if (!weatherItemParent.querySelector(`.weather-item[key=${cityName}]`))
            citiesToAdd.push(cityName)
    }
    for (const cityElem of weatherItemParent.children) {
        const currentCityName = cityElem.querySelector('.city-name').innerText
        if (!(favCityList.includes(currentCityName)))
            citiesElemToRemove.push(cityElem)
    }
    citiesElemToRemove.forEach(cityElemToRemove => weatherItemParent.removeChild(cityElemToRemove))
    citiesToAdd.forEach(cityToAdd => {
        insertComponent(weatherItemWaiting(cityToAdd), weatherItemParent)
        const newCityElement = weatherItemParent.querySelector(`.weather-item[key=${cityToAdd}]`)
        weatherAPI.getByCity(cityToAdd)
            .then(weather => insertComponent(weatherItem(weather), weatherItemParent, newCityElement))
            .catch(() => alert('Что-то пошло не так... Пожалуйста, обновите страницу'))
    })
};

function insertComponent(component, parentElement, oldChild) {
    if (!oldChild)
        parentElement.append(component)
    else
        parentElement.replaceChild(component, oldChild)
}