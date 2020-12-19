class FavoritesAPI {
    /**
     * @returns {Promise<Array>}
     */
    async getList() {
        const response = await fetch(`http://38147d01e776.ngrok.io/favorites`, {
            method: 'GET',
        })
        return await response.json()
    }

    /**
     * @param{string} cityName
     * @returns {Promise<Response>}
     */
    async addCity(cityName) {
        return await fetch(`http://38147d01e776.ngrok.io/favorites`, {
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
        return await fetch(`http://38147d01e776.ngrok.io/favorites`, {
            method: 'DELETE',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({cityToDelete: cityName})
        })
    }
}