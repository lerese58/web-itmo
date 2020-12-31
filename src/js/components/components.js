// import * as weatherAPI from "../APIs/weather/weatherAPI";
// import {removeFromFavorites} from "../handlers/handlers";

const { removeFromFavorites } = require('../handlers/handlers');
const weatherAPI = require('../APIs/weather/weatherAPI');

/**
 * @param{Element} weatherItemElement
 * @returns {{cityElem: Element, pressureElem: Element, iconElem: Element, humidityElem: Element, windElem: Element, cloudElem: Element, coordsElem: Element, tempElem: Element}}
 */
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

/**
 * @param{Element} el
 * @param{Object} weatherObj
 * @param{number} weatherObj.coord.lon
 * @param{number} weatherObj.coord.lat
 * @param{string} weatherObj.weather.icon
 * @param{number} weatherObj.main.temp
 * @param{number} weatherObj.main.pressure
 * @param{number} weatherObj.main.humidity
 * @param{number} weatherObj.wind.speed
 * @param{number} weatherObj.clouds.all
 * @param{string} weatherObj.name
 * @param{number} iconScale
 * @returns {Element} fulfilled el
 */
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

/**
 * @returns {DocumentFragment}
 */
const localWeatherWaitingComponent = () => {
    const localWaitingTemplate = document.querySelector('template#local-waiting-item')
    const importedLocalWaitingNode = document.importNode(localWaitingTemplate.content, true);
    importedLocalWaitingNode.firstElementChild.setAttribute('id', `local-waiting-city`)
    return importedLocalWaitingNode
}

/**
 *
 * @param{Object} weatherObj
 * @param{number} weatherObj.coord.lon
 * @param{number} weatherObj.coord.lat
 * @param{string} weatherObj.weather.icon
 * @param{number} weatherObj.main.temp
 * @param{number} weatherObj.main.pressure
 * @param{number} weatherObj.main.humidity
 * @param{number} weatherObj.wind.speed
 * @param{number} weatherObj.clouds.all
 * @param{string} weatherObj.name
 * @returns {DocumentFragment}
 */
const localWeatherComponent = (weatherObj) => {
    const localTemplate = document.querySelector('template#local-weather-item')
    const importedLocalNode = document.importNode(localTemplate.content, true)
    setWeatherParams(importedLocalNode, weatherObj, 4)
    importedLocalNode.firstElementChild.setAttribute('id', `local-weather-${encodeURI(weatherObj.name)}`)
    return importedLocalNode
}

/**
 * @param{string} cityName
 * @returns {DocumentFragment}
 */
const undefinedCityComponent = (cityName) => {
    const undefinedCityTemplate = document.querySelector('template#undefined-city-item')
    const importedUndefinedCityNode = document.importNode(undefinedCityTemplate.content, true)
    importedUndefinedCityNode.querySelector('.city-name').innerText = cityName
    importedUndefinedCityNode.firstElementChild.setAttribute('key', encodeURI(cityName))
    importedUndefinedCityNode.firstElementChild.setAttribute('id', `undefined-city-${encodeURI(cityName)}`)
    return importedUndefinedCityNode
}

/**
 * @param{string} cityName
 * @returns {DocumentFragment}
 */
const weatherWaitingComponent = (cityName) => {
    const waitingTemplate = document.querySelector('template#waiting-item')
    const importedWaitingNode = document.importNode(waitingTemplate.content, true)
    importedWaitingNode.querySelector('.city-name').innerText = cityName
    importedWaitingNode.firstElementChild.setAttribute('key', encodeURI(cityName))
    importedWaitingNode.firstElementChild.setAttribute('id', `waiting-${encodeURI(cityName)}`)
    return importedWaitingNode
}

/**
 * @param{Object} weatherObj
 * @param{number} weatherObj.coord.lon
 * @param{number} weatherObj.coord.lat
 * @param{string} weatherObj.weather.icon
 * @param{number} weatherObj.main.temp
 * @param{number} weatherObj.main.pressure
 * @param{number} weatherObj.main.humidity
 * @param{number} weatherObj.wind.speed
 * @param{number} weatherObj.clouds.all
 * @param{string} weatherObj.name
 * @returns {DocumentFragment}
 */
const weatherComponent = (weatherObj) => {
    const template = document.querySelector('template#weather-item')
    const importedNode = document.importNode(template.content, true)
    setWeatherParams(importedNode, weatherObj, 2)
    importedNode.querySelector('.remove-city-btn').addEventListener('click', removeFromFavorites)
    importedNode.firstElementChild.setAttribute('key', encodeURI(weatherObj.name))
    importedNode.firstElementChild.setAttribute('id', `weather-item-${encodeURI(weatherObj.name)}`)
    return importedNode
}

// export { weatherComponent, weatherWaitingComponent, undefinedCityComponent, localWeatherWaitingComponent, localWeatherComponent };
module.exports = { weatherComponent, weatherWaitingComponent, undefinedCityComponent, localWeatherComponent, localWeatherWaitingComponent }