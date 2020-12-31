/**
 * @returns {Promise<Array>}
 */
const getList = async () => {
    const response = await fetch(`http://localhost:8088/favorites`, {
        method: 'GET',
    })
    return await response.json()
};


/**
 * @param{string} cityName
 * @returns {Promise<Response>}
 */
const addCity = async cityName => await fetch(`http://127.0.0.1:8088/favorites`, {
    method: 'POST',
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({cityToAdd: cityName})
});


/**
 * @param{string} cityName
 * @returns {Promise<Response>}
 */
const deleteCity = async cityName => await fetch(`http://127.0.0.1:8088/favorites`, {
    method: 'DELETE',
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({cityToDelete: cityName})
});


module.exports = { addCity, deleteCity, getList };