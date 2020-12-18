class WeatherAPI {

    async getByPosition(position) {
        const [lat, lon] = [position.coords.latitude, position.coords.longitude]
        let response = await fetch(`http://127.0.0.1:8088/weather/coordinates?lat=${lat}&lon=${lon}`, {
            mode: 'no-cors'
        })
        return await response.json()
    }

    async getByCity(cityName) {
        const response = await fetch(`http://127.0.0.1:8088/weather/city?q=${encodeURIComponent(cityName)}`, {
            mode: 'no-cors'
        })
        return await response.json()
    }

    async getIconURL(iconCode, scale) {
        const response = await fetch(`http://127.0.0.1:8088/weather/icon?scale=${scale}&iconCode=${iconCode}`, {
            mode: 'no-cors'
        });
        return await response.text();
    }
}