const http = require('http');

const weatherApi = 'http://api.openweathermap.org/data/2.5/weather?appid=47f10729a078ec6afee5311181889ab9&q=';
const connectionString = 'whateverweather:us-east1:whateverweather';
const mysql = require('mysql');

function getCity() {
    /*var con = mysql.createConnection({
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

function calculateEffectiveWeather(temp, temperatureData) {
    if (temp <= 5 && temp > -50) {
        temp = 13.12 + 0.6215 * temp - 11.37 * Math.pow(temperatureData.wind.speed, 0.16) + 0.3965 * temp * Math.pow(temperatureData.wind.speed, 0.16);
    }
    else if (temp >= 26.7) {
        // Humidex, probably won't need it
        //temp = 
    }
    
    return temp;
}

module.exports = {
    compute: function (req, res) {
        var weatherData = '';

        http.get([weatherApi, getCity()].join(''), (resp) => {
            resp.on('data', (chunk) => {
                weatherData += chunk;
            });

            resp.on('end', () => {
                weatherData = JSON.parse(weatherData);

                const idealTemp = getIdealTemp();

                var baseTemp = Number(kelvinToCelsius(weatherData.main.temp).toFixed(1));
                var effectiveTemp = calculateEffectiveWeather(baseTemp, weatherData);

                var deltaTemp = idealTemp - effectiveTemp;
                
                var targetN = Number(deltaTemp / 2).toFixed(1);
                
                console.log(targetN);
                
                

                resultObj = {
                    'city': weatherData.name,
                    'weather': weatherData.weather[0].main,
                    "temp": Number(kelvinToCelsius(weatherData.main.temp).toFixed(2)),
                    //'targetTemperature':
                    //'data': weatherData.main,
                    'wind': weatherData.wind
                };
                /*console.log(weatherData);
                console.log();
                console.log(resultObj);*/
                res.status(200).send(resultObj);
            });
        }).on('error', (err) => {
            console.log('Failed');
            return;
        });
    }
}
