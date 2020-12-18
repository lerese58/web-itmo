class FavoritesAPI {

    async getList() {
        const response = await fetch(`http://127.0.0.1:8088/favorites`, {
            method: 'GET',
            mode: "no-cors",
        })
        return await response.json()
    }

    addCity(cityName) {
        const city = decodeURI(cityName)
        fetch(`http://127.0.0.1:8088/favorites`, {
            method: 'POST',
            mode: "no-cors",
        })
            .then(response => console.log(response))
    }

    deleteCity(cityName) {
        fetch(`http://127.0.0.1:8088/favorites`, {
            method: 'DELETE',
            mode: "no-cors",
        })
            .then(response => console.log(response))

    }
}