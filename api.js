//console.log('Hello API World!');
//const https = require('https');
const http = require('http');

const weatherApi = 'http://api.openweathermap.org/data/2.5/weather?appid=47f10729a078ec6afee5311181889ab9&q=';

function getCity() {
    /*const mysql = require('mysql');
    var con = mysql.createConnection({
        host: '',
        user: '',
        password: ''
    });

    con.connect(function (err) {
        if (err) throw err;
        console.log('Connected');
    });

    con.execute*/
    return 'Montreal';
}

function getWeatherData() {
    var data = '';

    http.get([weatherApi, getCity()].join(''), (resp) => {
        resp.on('data', (chunk) => {
            data += chunk;
            //console.log('Hello?');
        });

        resp.on('end', () => {
            //console.log('end of stream');
            return JSON.parse(data);
        });
    }).on('error', (err) => {
        //console.log('failed');
        return null;
    });
}

module.exports = {
    compute: function (req, res) {

        var weatherData = getWeatherData();
        if (weatherData === null) {
            res.status(500).send('Failed to fetch weather data');
        }
        else {
            res.status(200).send(weatherData);
        }
        //return res.status(200).send('Welcome');

        //console.log(data);
    }
}
