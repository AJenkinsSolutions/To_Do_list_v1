const express = require('express');
const app = express();
const port = 3000;


//body parser
app.use(express.urlencoded({extended: true}));

  
app.set('view engine', 'ejs');


app.listen(port, () => {
    console.log('Server listening on port: ' + port)
});


let items = ['Buy Food', 'Cook Food', 'Eat Food'];

app.get('/', (req, res) => {

    let options = {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
    }

   let currentDay = new Date();
   let day = currentDay.toLocaleDateString('en', options)
    res.render('lists', {day:day, items:items});


})

app.post('/', (req, res) =>{
    let newItem = req.body.item;
    items.push(newItem);

    res.redirect("/");
})