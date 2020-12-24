const fs = require('fs');
const path = require('path');
const chai = require('chai');

const FavoritesAPI = require('./favoritesAPI')

const api = new FavoritesAPI();

const favListMock = JSON.parse(fs.readFileSync(path.resolve(__dirname, './favList_1.json')))

describe('Get list of favorites', () => {
    let data
    fetchMock.doMock(JSON.stringify(favListMock))

    it('should not get null', async () => {
        data = await api.getList()
        chai.expect(data).not.to.be.null
    });

    it('should receive list of favorites', async () => {
        data = await api.getList()
        chai.expect(JSON.stringify(data)).equal(JSON.stringify(["Пермь","Москва","Саратов"]))
    });

});
