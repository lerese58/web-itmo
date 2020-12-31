const fs = require('fs');
const path = require('path');
const chai = require('chai');

const weatherAPI = require('./weatherAPI')

const positionStub = {
    coords: {
        longitude: -122.08,
        latitude: 37.39
    }
}
const cityNameStub = 'МоскваТест1'
const iconUrlStub = '01d'

const weatherMock = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../../../test/data/weather_1.json')))
const iconUrlMock = (fs.readFileSync(path.resolve(__dirname, '../../../../test/data/iconUrl_1.txt'))).toString()

describe('Get weather object', () => {

    fetchMock.doMock(JSON.stringify(weatherMock))

    it('should not get null', async () => {
        const data = await weatherAPI.getByPosition(positionStub)
        chai.expect(data).not.to.be.null
    });

    it('should receive weather by coords', async () => {
        const data = await weatherAPI.getByPosition(positionStub)
        chai.expect(data.coord.lat).equal(positionStub.coords.latitude)
        chai.expect(data.coord.lon).equal(positionStub.coords.longitude)
    });

    it('should receive weather by cityName', async () => {
        let data = await weatherAPI.getByCity(cityNameStub)
        chai.expect(data.name).equal(cityNameStub)
    });

    it('should receive iconUrl', async () => {
        fetchMock.doMockOnce(iconUrlMock)
        const data = await weatherAPI.getIconURL(iconUrlStub, 1)
        chai.expect(data).equal(`//openweathermap.org/img/wn/${iconUrlStub}.png`)
    });
});
