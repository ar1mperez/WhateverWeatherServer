const http = require('http');

const weatherApi = 'http://api.openweathermap.org/data/2.5/weather?appid=47f10729a078ec6afee5311181889ab9&q=';
const connectionString = 'whateverweather:us-east1:whateverweather';
const mysql = require('mysql');

function openDbConnection() {
    var con = mysql.createConnection({
        host: '35.237.213.41',
        user: 'ww',
        password: 'Password1',
        database: 'whatever_weather'
    });
    
    con.connect((err) => {
        if (err) throw err;
        console.log('Connected');
    });
    
    return con;
}

function getCity() {
    return new Promise(function (resolve, reject) {
        var con = openDbConnection();
        
        var sql = 'SELECT * FROM Configuration WHERE Name = \'City\';';
        con.query(sql, function (error, results, fieds) {
            if (error) return reject(error);
            resolve(results[0]);
        });
    });
}

function getCountry() {
    return new Promise(function (resolve, reject) {
        var con = openDbConnection();
        
        var sql = 'SELECT * FROM Configuration WHERE Name = \'Country\';';
        con.query(sql, function (error, results, fields) {
            if (error) return reject(error);
            resolve(results[0]);
        });
    });
} 

function getIdealTemp() {
    //return 21;
    return new Promise(function (resolve, reject) {
        var con = openDbConnection();
        
        var sql = 'SELECT * FROM Configuration WHERE Name = \'Ideal Temperature\';';
        con.query(sql, function (error, results, fields) {
            if (error) return reject(error);
            resolve(results[0]);
        });
    });
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

function getClothes() {
    return new Promise(function (resolve, reject) {
        var con = openDbConnection();
        
        var sql = 'SELECT * FROM Clothes;';
        con.query(sql, function (error, results, fields) {
            if (error) return reject(error);
            resolve(results);
        });
    });
}

module.exports = {    
    compute: function (req, res) {
        const maxVariance = 2;
        
        getCity().then(function (cityRow) {
            getCountry().then(function (countryRow) {                
                var weatherData = '';
                //console.log([weatherApi, cityRow.Value, ',', countryRow.Value].join(''));
                http.get([weatherApi, cityRow.Value, ',', countryRow.Value].join(''), (resp) => {
                    resp.on('data', (chunk) => {
                        weatherData += chunk;
                    });

                    resp.on('end', () => {
                        weatherData = JSON.parse(weatherData);
                        //const idealTemp = getIdealTemp();
                        getIdealTemp().then(function (idealTemp) {
                        idealTemp = parseInt(idealTemp.Value);
                        console.log(idealTemp);
                        
                        //console.log(weatherData);

                        var baseTemp = Number(kelvinToCelsius(weatherData.main.temp).toFixed(1));
                        var effectiveTemp = calculateEffectiveWeather(baseTemp, weatherData);
                        var deltaTemp = idealTemp - effectiveTemp;
                        
                        var targetN = Number(deltaTemp / 2).toFixed(1);
                        
                        console.log(targetN);
                        
                        
                        getClothes().then(function (clothesRows) {
                            var layers = [
                                [ [], [], [] ],   // tops
                                [ [], [], [] ]    // bottoms
                            ];
                            
                            for (var i = 0; i < clothesRows.length; i++) {
                                layers[(i < 3) ? 0 : 1][clothesRows[i].TypeID % 3].push(clothesRows[i]);
                            }
                            
                            console.log(layers);
                            
                            for (var i = 0; i < layers.length; i++) {
                                for (var j = 0; j < layers[i].length; j++) {
                                    layers[i][j].sort(function (a, b) { return a.TempInc <= b.TempInc });
                                }
                            }
                            
                            var configurations = [];
                            
                            for (var i = 0; i < layers.length; i++) {
                                configurations.push([]);
                                var t1Index = layers[i][0].length;
                                var t2Index = layers[i][1].length;
                                var t3Index = layers[i][2].length;
                                
                                while (t3Index >= 0) {
                                    var conf = [ ];
                                    if (!(t1Index >= layers[i][0].length)) {
                                        conf.push(layers[i][0][t1Index]);
                                    }
                                    if (!(t2Index >= layers[i][1].length)) {
                                        conf.push(layers[i][1][t2Index]);
                                    }
                                    if (!(t3Index >= layers[i][2].length)) {
                                        conf.push(layers[i][2][t3Index]);
                                    }
                                    
                                    if (conf.length) {
                                        var confN = conf.reduce(function (total, val) { return total + val.IncTemp; });
                                        var hasAcceptingConfig = false;
                                        
                                        if (configurations[i].length === 0) {
                                            configurations[i].push(conf);
                                        }
                                        else if (Math.abs(targetN - configurations[i][0].reduce(function (total, val) { return total + val.incTemp; })) < Math.abs(targetN - conf.reduce(function (total, val) { return total + val.incTemp; }))) {
                                            configuration[i] = [ conf ];
                                        }
                                        else if (Math.abs(targetN - configurations[i][0].reduce(function (total, val) { return total + val.incTemp; })) === Math.abs(targetN - conf.reduce(function (total, val) { return total + val.incTemp; }))) {
                                            configuration[i].push(conf);
                                        }
                                        
                                    }
                                    
                                    
                                    t1Index--;
                                    if (t1Index < 0) {
                                        t1Index = layers[i][0].length;
                                        t2Index--;
                                    }
                                    if (t2Index < 0) {
                                        t2Index = layers[i][1].length;
                                        t3Index--;
                                    }
                                }
                            }
                            
                            console.log(weatherData);
                            resultObj = {
                                'city' : cityRow.Value,
                                'weather': weatherData.weather[0].main,
                                'targetTemperature': idealTemp,
                                'achievedTemperature': calculateEffectiveWeather(kelvinToCelsius(weatherData.main.temp), weatherData) + Math.abs(configurations[0][0].reduce(function (total, val) { return total + val.IncTemp; })),
                                'baseTemperature': kelvinToCelsius(weatherData.main.temp),
                                'topLayers': configurations[0][0],
                                'bottomLayers': configurations[1][0]
                            };
                            console.log(resultObj);
                            res.status(200).send(resultObj);
                            
                        }).catch(function (err) {
                            console.log(err);
                        });
                    });
                    });
                }).on('error', (err) => {
                    console.log('Failed');
                    return;
                });
            }).catch(function (err) {
                console.log(err);
            });
        }).catch(function (err) {
            console.log(err);
        });
    }
}
