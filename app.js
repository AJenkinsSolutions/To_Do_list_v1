const e = require('express');
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = 3000;


//body parser
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// specifyss our static files 
app.use(express.static( __dirname, + 'public'));
app.set('view engine', 'ejs');

app.listen(port, () => {
    console.log('Server listening on port: ' + port)
});

//Mongoose Configuration
async function main(){
    await mongoose.connect('mongodb://localhost:27017/TodoDb')
    console.log("Successfull Connected");

    //Schema
    const itemSchema = new mongoose.Schema({
        name: String
    })

    //Model 
    const ItemModel = mongoose.model('Item', itemSchema);
    const WorkItemModel = mongoose.model('workItem', itemSchema);

    

    
   


    

//Default items
//insertMany
const defaultItemsArray = [{name:"Welcome to your Todo List"}, {name: "Hit the + button to add a new item"}, {name: "<--- hit this to delte an item"}]

const workItems = [];

app.get('/', (req, res) => {
    // TODO: Move to outside module
//     let options = {
//         weekday: 'long',
//         day: 'numeric',
//         month: 'long'
//     }
//    let currentDay = new Date();
//    let day = currentDay.toLocaleDateString('en', options)
    ItemModel.find((err, foundItems)=>{
        if(foundItems.length === 0){
            ItemModel.insertMany(defaultItemsArray, function (err) {
                    if(err){
                        console.log('Error adding items to db'+ err);
                    }else{
                        console.log("items array added to document")
                    }
                });
                //takes us back to home page to show newly added items 
                res.redirect("/")
        }else{
            res.render('lists', {listTitle:"Today", items:foundItems});
        }
    })
    
});





app.post('/', (req, res) =>{

    const reqItem = req.body.item;
    if(req.body.list === 'Work'){
        const newItem = new WorkItemModel({name: reqItem});
        newItem.save();
        res.redirect("/work");
    }else{
        const newItem = new ItemModel({name: reqItem});
        newItem.save();
        res.redirect("/");
    }
});

app.post('/delete', (req, res) => {
    const checkBoxItemId = req.body.checkbox;
        console.log('items');
        ItemModel.deleteOne({_id: checkBoxItemId}, (err)=>{
            if(err){
                console.log(err);
            }else{
                console.log('Successdfully removed id' + checkBoxItemId)
                res.redirect("/");
            }
        });
    


})



app.get('/work', (req, res) => {
    const workListTitle = 'Work';
    WorkItemModel.find((err, workFoundItems) => {
        if(err){
            console.log(err);
        }else{
        res.render('lists', {listTitle:'Work', items:workFoundItems});
        }
    })
    
});

app.get('/about', (req, res) =>{
    res.render('about')
});


}

main().catch(err => console.log("An Error has occured: " + err));
