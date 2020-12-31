const fs = require('fs');
const path = require('path');
const chai = require('chai');
const jsdom = require('jsdom');

const { getAddedCities } = require('./utils')
const favoritesAPI = require('../APIs/favorites/favoritesAPI')
const DomAPI = require("../APIs/DOM/DomAPI");
const { getDeletedCityElements } = require("./utils");

const { weatherComponent } = require("../components/components");

const htmlContent = fs.readFileSync(path.resolve(__dirname, '../../index.html'));
const weather1 = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../../test/data/weather_1.json')));
const favListMock = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../../test/data/favList_1.json')))


let newTestWeatherElem1, newTestWeatherElem2, parentElem, newElement;

describe('Utils', () => {

    const dom = new jsdom.JSDOM(htmlContent, {
        contentType: 'text/html',
        includeNodeLocations: true
    })

    global.window = dom.window
    global.document = dom.window.document

    newTestWeatherElem1 = weatherComponent(weather1);
    parentElem = document.querySelector('.weather-item-list')

    let data
    fetchMock.doMock(JSON.stringify(favListMock))


    it('should get added cities', async () => {
        data = await favoritesAPI.getList()
        const list = await getAddedCities()
        chai.expect(JSON.stringify(list)).equals(JSON.stringify(['Пермь', 'Москва', 'Саратов']))
    });

    it('should get deleted elements', async () => {
        data = await favoritesAPI.getList()
        DomAPI.insertComponent(newTestWeatherElem1, parentElem)
        const list = await getDeletedCityElements()
        chai.expect(list.length).equals(1)
    });

});
