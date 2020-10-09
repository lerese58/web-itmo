class WeatherAPI {
    constructor() {
        this.apiKey = '9e3a90d56e10f19c119dfefd3f59ead8'
    }
    async getByPosition(position) {
        const [lat, lon] = [position.coords.latitude, position.coords.longitude]
        let response = await fetch(`//api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=RU&appid=${this.apiKey}`)
        return await response.json()
    }

    async getByCity(cityName) {
        const response = await fetch(`//api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&lang=RU&appid=${this.apiKey}`)
        return await response.json()
    }

    getIconURL(iconCode, scale) {
        const s = scale > 1 ? `@${scale}x` : ""
        return `//openweathermap.org/img/wn/${iconCode}${s}.png`
    }
}