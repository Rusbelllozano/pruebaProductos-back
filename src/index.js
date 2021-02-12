const express = require("express");
const app = express();
const path = require('path')
const bodyParser = require('body-parser');
var cors = require('cors');

// use it before all route definitions
app.use(cors({origin: '*'}));
const mongoose = require('mongoose')
mongoose.Promise = global.Promise;
mongoose.connect('mongodb+srv://user-test:datos123W@cluster0.jvxbf.mongodb.net/ProductsTest?retryWrites=true&w=majority',{
  useNewUrlParser: true,
  useUnifiedTopology: true  
})
app.set('views', path.join(__dirname, 'views'));
// app.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
const router = require('./router/index');




app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(router);

app.listen( process.env.PORT ||3000, ()=>{
    console.log("Server on port", 3000)
})
