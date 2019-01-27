const http = require('http');

const weatherApi = 'http://api.openweathermap.org/data/2.5/weather?appid=47f10729a078ec6afee5311181889ab9&q=';
const connectionString = 'whateverweather:us-east1:whateverweather';

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

function getCountry() {
    return 'CA';
}

function getIdealTemp() {
    return 21;
}

function kelvinToCelsius(k) {
    return k - 273.15;
}

function calculateEffectiveWeather(temperatureData) {
    //const 
    
    var effectiveWeather = temperatureData.temperature;
    
}

module.exports = {
    compute: function (req, res) {
        var weatherData = '';
        
        console.log([weatherApi, getCity(), '.', getCountry()].join(''));
        
        http.get([weatherApi, getCity()].join(''), (resp) => {
            resp.on('data', (chunk) => {
                weatherData += chunk;
            });
            
            resp.on('end', () => {
                weatherData = JSON.parse(weatherData);
                
                //const targetTemperature = getIdealTemp();
                
                var weather = weatherData.weather[0].main;
                var effectiveWeather = calculateEffectiveWeather(weatherData.main);
                
                resultObj = {
                    'city': weatherData.name,
                    'weather': weatherData.weather[0].main,
                    //'targetTemperature': 
                    //'data': weatherData.main,
                    'wind': weatherData.wind
                };
                console.log(weatherData);
                console.log();
                console.log(resultObj);
                res.status(200).send(resultObj);
            });
        }).on('error', (err) => {
            console.log('Failed');
            return;
        });
    }
}
