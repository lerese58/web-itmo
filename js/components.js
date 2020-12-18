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
const setWeatherParams = (el, weatherObj, iconScale) => {
    const {cityElem, tempElem, iconElem, windElem, cloudElem, pressureElem, humidityElem, coordsElem} = getWeatherFieldsElementsFrom(el)
    cityElem.innerHTML = weatherObj.name
    tempElem.innerHTML = `${Math.round(weatherObj.main.temp)}°C`
    weatherAPI.getIconURL(weatherObj.weather[0].icon, iconScale)
            .then(url => iconElem.src = url)
    windElem.innerHTML = `${weatherObj.wind.speed} м/с`
    cloudElem.innerHTML = `${weatherObj.clouds.all}%`
    pressureElem.innerHTML = `${weatherObj.main.pressure} hpa`
    humidityElem.innerHTML = `${weatherObj.main.humidity}%`
    coordsElem.innerHTML = `[${weatherObj.coord.lon} ${weatherObj.coord.lat}]`
    return el
};

function localWeatherWaitingComponent() {
    const localWaitingTemplate = document.querySelector('template#local-waiting-item')
    const importedLocalWaitingNode = document.importNode(localWaitingTemplate.content, true);
    importedLocalWaitingNode.firstElementChild.setAttribute('id', `local-waiting-city`)
    return importedLocalWaitingNode
}
function localWeatherComponent(weather) {
    const localTemplate = document.querySelector('template#local-weather-item')
    const importedLocalNode = document.importNode(localTemplate.content, true)
    setWeatherParams(importedLocalNode, weather, 4)
    importedLocalNode.firstElementChild.setAttribute('id', `local-weather-${encodeURI(weather.name)}`)
    return importedLocalNode
}
function undefinedCityComponent(cityNameStr) {
    const undefinedCityTemplate = document.querySelector('template#undefined-city-item')
    const importedUndefinedCityNode = document.importNode(undefinedCityTemplate.content, true)
    importedUndefinedCityNode.querySelector('.city-name').innerText = cityNameStr
    importedUndefinedCityNode.firstElementChild.setAttribute('key', encodeURI(cityNameStr))
    importedUndefinedCityNode.firstElementChild.setAttribute('id', `undefined-city-${encodeURI(cityNameStr)}`)
    return importedUndefinedCityNode
}
function weatherWaitingComponent(cityName) {
    const waitingTemplate = document.querySelector('template#waiting-item')
    const importedWaitingNode = document.importNode(waitingTemplate.content, true)
    importedWaitingNode.querySelector('.city-name').innerText = cityName
    importedWaitingNode.firstElementChild.setAttribute('key', encodeURI(cityName))
    importedWaitingNode.firstElementChild.setAttribute('id', `waiting-${encodeURI(cityName)}`)
    return importedWaitingNode
}
function weatherComponent(weather) {
    const template = document.querySelector('template#weather-item')
    const importedNode = document.importNode(template.content, true)
    setWeatherParams(importedNode, weather, 2)
    importedNode.querySelector('.remove-city-btn').addEventListener('click', removeFromFavorites)
    importedNode.firstElementChild.setAttribute('key', encodeURI(weather.name))
    importedNode.firstElementChild.setAttribute('id', `weather-item-${encodeURI(weather.name)}`)
    return importedNode
}
