const express = require('express');
const app = express();
const port = 3000;


//body parser
app.use(express.urlencoded({extended: true}));
app.set('view engine', 'ejs');
// app.use(express.static( __dirname, + 'public'));

app.listen(port, () => {
    console.log('Server listening on port: ' + port)
});

app.get('/', (req, res) => {
    // res.sendFile(__dirname + '/views/index.html');

   let currentDay = new Date();
   currentDay = currentDay.getDay();

   let day = '';

   if(currentDay == 0 || currentDay == 6){
    console.log(currentDay)
    switch (currentDay) {
        case 0:
            day = 'Sunday';
            break;
        case 6:
            day = 'Saturday';
            break;
        default:
            break;
    }
   }else{
    switch (currentDay) {
        case 1:
            day = 'Monday';
            break;
        case 2:
            day = 'Tuesday';
            break;
        case 3:
            day = 'Wednesday';
            break;
        case 4:
            day = 'Thrusday';
            break;
        case 5:
            day = 'Friday';
            break;
        default:
            throw new Error(console.log( currentDay + ' Not a vaild day'))
            break;
    }
   }
    
    res.render('lists', {day:day});


})