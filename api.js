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
    var end = false;

    http.get([weatherApi, getCity()].join(''), (resp) => {
        resp.on('data', (chunk) => {
            data += chunk;
            console.log('Hello?');
        });

        resp.on('end', () => {
            console.log('end of stream');
            console.log(typeof(data));
            //return JSON.parse(data);
            
            //return data;
        });
    }).on('error', (err) => {
        console.log('failed');
        return;// null;
        //end = true;
    });
    
    console.log(data);
    return data; 
}

module.exports = {
    compute: function (req, res) {
        var data = '';
        
        http.get([weatherApi, getCity()].join(), (resp) => {
            resp.on('data', (chunk) => {
                data += chunk;
            });
            
            resp.on('end', () => {
                res.status(200).send(data);
            });
        }).on('error', (err) => {
            console.log('Failed');
            return;
        });
    }
}
