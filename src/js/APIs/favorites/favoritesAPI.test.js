const fs = require('fs');
const path = require('path');
const chai = require('chai');

const favoritesAPI = require('./favoritesAPI')

const favListMock = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../../../test/data/favList_1.json')))

describe('Get list of favorites', () => {
    let data
    fetchMock.doMock(JSON.stringify(favListMock))

    it('should not get null', async () => {
        data = await favoritesAPI.getList()
        chai.expect(data).not.to.be.null
    });

    it('should receive list of favorites', async () => {
        data = await favoritesAPI.getList()
        chai.expect(JSON.stringify(data)).equal(JSON.stringify(["Пермь","Москва","Саратов"]))
    });

});
