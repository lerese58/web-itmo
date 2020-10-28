var express = require('express');
var router = express.Router();
const apiKey = '9e3a90d56e10f19c119dfefd3f59ead8';

router.get('/city', async function (req, res) {
    const cityName = req.query.q;
    res = await fetch(`//api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&lang=RU&appid=${apiKey}`);
    return res.json()
});

router.get('/coordinates', async function (req, res) {
    const lat = req.query.lat;
    const long = req.query.long;
    res = await fetch(`//api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&units=metric&lang=RU&appid=${apiKey}`);
    return res.json()
})

module.exports = router;