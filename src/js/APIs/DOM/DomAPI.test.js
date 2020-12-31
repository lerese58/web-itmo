const fs = require('fs');
const path = require('path');
const chai = require('chai');
const jsdom = require('jsdom');

const DomAPI = require('./DomAPI')
const { weatherComponent } = require("../../components/components");

const htmlContent = fs.readFileSync(path.resolve(__dirname, '../../../index.html'));
const weather1 = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../../../test/data/weather_1.json')));
const weather2 = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../../../test/data/weather_2.json')));

let newTestWeatherElem1, newTestWeatherElem2, parentElem, newElement;

describe('Dom API', () => {

    const dom = new jsdom.JSDOM(htmlContent, {
        contentType: 'text/html',
        includeNodeLocations: true
    })

    global.window = dom.window
    global.document = dom.window.document

    newTestWeatherElem1 = weatherComponent(weather1);
    newTestWeatherElem2 = weatherComponent(weather2);
    parentElem = document.querySelector('.weather-item-list')


    it('should insert component', () => {
        newElement = DomAPI.insertComponent(newTestWeatherElem1, parentElem)
        const newCityName = `weather-item-${weather1.name}`
        chai.expect(decodeURIComponent(newElement.id)).equals(newCityName)
    });

    it('should replace component', () => {
        const replacedElem = DomAPI.replaceComponent(newTestWeatherElem2, parentElem, newElement)
        const newElem = parentElem.querySelector(`.weather-item`)
        const newCityName = `weather-item-${weather2.name}`
        chai.expect(decodeURIComponent(newElem.id)).equals(newCityName)
    });

    it('should remove component', () => {
        const elemToRemove = parentElem.querySelector(`.weather-item`)
        DomAPI.removeElement(elemToRemove)
        const elem = parentElem.querySelector('.weather-item')
        chai.expect(elem).equals(null)
    });

});
