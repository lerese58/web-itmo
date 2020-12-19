class FavoritesAPI {
    /**
     * @returns {Promise<Array>}
     */
    async getList() {
        const response = await fetch(`http://127.0.0.1:8088/favorites`, {
            method: 'GET',
        })
        return await response.json()
    }

    /**
     * @param{string} cityName
     * @returns {Promise<Response>}
     */
    async addCity(cityName) {
        return await fetch(`http://127.0.0.1:8088/favorites`, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({cityToAdd: cityName})
        })
    }

    /**
     * @param cityName
     * @returns {Promise<Response>}
     */
    async deleteCity(cityName) {
        return await fetch(`http://127.0.0.1:8088/favorites`, {
            method: 'DELETE',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({cityToDelete: cityName})
        })
    }
}