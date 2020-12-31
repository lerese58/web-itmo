/**
 * @param{number} position.coords.latitude
 * @param{number} position.coords.longitude
 * @returns {Promise<Object>}
 */
const getByPosition = async position => {
    const [lat, lon] = [position.coords.latitude, position.coords.longitude]
    let response = await fetch(`http://127.0.0.1:8088/weather/coordinates?lat=${lat}&lon=${lon}`)
    return await response.json()
};


/**
 * @param{string} cityName
 * @returns {Promise<Object>}
 */
const getByCity = async cityName => {
    const response = await fetch(`http://127.0.0.1:8088/weather/city?q=${cityName}`)
    return await response.json()
};


/**
 * @param{string} iconCode
 * @param{number} scale
 * @returns {Promise<string>}
 */
const getIconURL = async (iconCode, scale) => {
    const response = await fetch(`http://127.0.0.1:8088/weather/icon?scale=${scale}&iconCode=${iconCode}`);
    return await response.text();
};

module.exports = { getIconURL, getByPosition, getByCity }