const e = require('express');
const express = require('express');
const mongoose = require('mongoose');
const _ = require('lodash');


const app = express();


//body parser
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// specifyss our static files 
app.use(express.static( __dirname, + 'public'));
app.set('view engine', 'ejs');

let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}

app.listen(port, () => {
    console.log('Server listening successfully on port: ' + port)

});
// cluster0 mongo server creds
const user = 'admin-alex'
const pw = 'admin123'




//Mongoose Configuration
async function main(){
    //TodoDb is the name of our collection where our documents live
    await mongoose.connect('mongodb+srv://admin-alex:admin123@cluster0.pvodwda.mongodb.net/TodoDb')
    console.log("Successfull Connected");

    //Item Schema: this refers to the individual todo list 'ITEMS' i.e ('eat food', 'drink water')
    // In this case our main list is already refered to as 'TODAY' hence why theres no name property of this document
    const itemSchema = new mongoose.Schema({
        name: String
    })


    // the listSchema is the refers to the WHOLE list + items within the list
    // i.e a list document will have. {name: Title of said list, items: [array of items that populate the list]}
    const listSchema = new mongoose.Schema({
        name: String, 
        items: [itemSchema]
    })

    //Model 
    const ItemModel = mongoose.model('Item', itemSchema);
    const listModel = mongoose.model('list', listSchema);
    
//Default items
//insertMany
const defaultItemsArray = [{name:"Welcome to your Todo List"}, {name: "Hit the + button to add a new item"}, {name: "<--- hit this to delte an item"}]

const workItems = [];

app.get(['/', 'home'], (req, res) => {
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
app.get('/Favicon.ico', (req,res)=>{
    
    return 'your faveicon'
   })

app.get("/:customListName", (req, res) => {
    //parameter parasing
    const customlistName = _.capitalize(req.params.customListName);

    console.log('Custom Route "GET": listName ' + customlistName);

    //Querying the listsmodel Collection.
    //To see if a 'Document' with the same name already exsists.
    listModel.findOne({name: customlistName}, (err, foundList) => {
        if(!err){
            if(!foundList){
                console.log('err: List doesnt exsist');
                //create a new list
                const list = new listModel({
                    name: customlistName,
                    items: defaultItemsArray
                    });
                list.save();
                res.redirect('/'+ customlistName);
            }else{
                console.log('List Found!');
                //Show exsisting list
                res.render('lists', {listTitle: foundList.name, items:foundList.items})
            }
        }

    })

})

app.post('/', (req, res) =>{

    const reqItem = req.body.item;
    const listName = req.body.list;
    //create new item
    const newItem = new ItemModel({name: reqItem});
    

    if(listName === 'Today'){
        newItem.save();
        res.redirect("/");
    }else{
        listModel.findOne({name: listName}, (err, foundList) => {
            foundList.items.push(newItem);
            foundList.save();
            res.redirect("/" + listName);
        })
        
    }
});

app.post('/delete', (req, res) => {
    const checkBoxItemId = req.body.checkbox;
    const listTitle = req.body.listName;
    console.log('Delete: List Title: ' + listTitle);
    
    //list title 
    if(listTitle === 'Today'){
        ItemModel.findByIdAndDelete({_id: checkBoxItemId},function(err){
            if(err){
                console.log('An Error occurred' + err);
            }else{
                console.log('Successdfully item removed id' + checkBoxItemId);
                res.redirect("/"); 
            }

        });
    }else{
        listModel.findOneAndUpdate({name: listTitle}, {$pull:{items: {_id: checkBoxItemId}}}, function(err, foundList){
            if(!err){
                res.redirect('/' + listTitle);
            }
        })
    }
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
