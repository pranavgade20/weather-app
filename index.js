const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
const pug = require('pug');
let app = express();
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.use(express.static('public')); //expose the public directory

const compileWeather = pug.compileFile('public/weather.pug');

let port = 8080;
let apiUrl = 'https://api.openweathermap.org/data/2.5/weather?appid=API_KEY&q='

app.get('/', (req, res) => {
   res.sendFile(__dirname + '/public/index.html');
});

app.get('/getInfo', (req, res) => {
   if (req.query.city == undefined) {
      res.sendFile(__dirname + './public/error.html');
   }
   console.log(req.query.city);
   request(apiUrl+req.query.city, {json : true}, (err, resp, body) =>{
      if(err || body.cod != 200) {
         console.log(err);
         res.sendFile(__dirname + '/public/error.html');
      } else {
         res.send(compileWeather({
            city: body.name,
            temp: body.main.temp,
            info: body.weather[0].main,
            press: body.main.pressure,
            humidity: body.main.humidity,
            speed: body.wind.speed
         }));
      }
   })
});

app.listen(port);


console.log('Running on port '+port+'!');