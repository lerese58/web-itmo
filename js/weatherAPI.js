class WeatherAPI {

    async getByPosition(position) {
        const [lat, lon] = [position.coords.latitude, position.coords.longitude]
        let response = await fetch(`http://a8ee4eb0b762.ngrok.io/weather/coordinates?lat=${lat}&lon=${lon}`)
        return await response.json()
    }

    async getByCity(cityName) {
        const city = encodeURI(cityName)
        const response = await fetch(`http://a8ee4eb0b762.ngrok.io/weather/city?q=${city}`)
        return await response.json()
    }

    async getIconURL(iconCode, scale) {
        const response = await fetch(`http://a8ee4eb0b762.ngrok.io/weather/icon?scale=${scale}&iconCode=${iconCode}`);
        return await response.text();
    }
}