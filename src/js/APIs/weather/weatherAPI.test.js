const fs = require('fs');
const path = require('path');
const chai = require('chai');
const WeatherAPI = require('./weatherAPI')

const api = new WeatherAPI();

const positionStub = {
    coords: {
        longitude: -122.08,
        latitude: 37.39
    }
}
const cityNameStub = 'Mountain View'
const iconUrl = '01d'

const weatherMock = JSON.parse(fs.readFileSync(path.resolve(__dirname, './weather_1.json')))
const iconUrlMock = (fs.readFileSync(path.resolve(__dirname, 'iconUrl_1.txt'))).toString()

describe('Get weather object', () => {

    fetchMock.doMock(JSON.stringify(weatherMock))

    it('should not get null', async () => {
        const data = await api.getByPosition(positionStub)
        chai.expect(data).not.to.be.null
    });

    it('should receive weather by coords', async () => {
        const data = await api.getByPosition(positionStub)
        chai.expect(data.coord.lat).equal(positionStub.coords.latitude)
        chai.expect(data.coord.lon).equal(positionStub.coords.longitude)
        // chai.expect(JSON.stringify(data)).equal(JSON.stringify(weatherMock))
    });

    it('should receive weather by cityName', async () => {
        const data = await api.getByCity(cityNameStub)
        chai.expect(data.name).equal(cityNameStub)
        // chai.expect(JSON.stringify(data)).equal(JSON.stringify(weatherMock))
    });

    it('should receive iconUrl', async () => {
        fetchMock.doMockOnce(iconUrlMock)
        const data = await api.getIconURL(iconUrl, 1)
        chai.expect(data).equal(`//openweathermap.org/img/wn/${iconUrl}.png`)
    });
});
