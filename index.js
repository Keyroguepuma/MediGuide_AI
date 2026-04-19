const express = require('express');
const hbs = require('express-handlebars');
require('dotenv').config();

//Set up the variables
const app = express();
const port = process.env.PORT;

//For CSS
app.use(express.static('public'));

//Set Up handlebars
app.engine('hbs', hbs.engine({

  defaultLayout: 'main',
  layoutsDir: './views/layouts',
  partialsDir: './views/partials',
  extname: "hbs"
}));

//This is where the front end is stored (views)
app.set('view engine', 'hbs');
app.set('views', './views');

//To get user data
app.use(express.urlencoded({ extended: true }));

//Home page
app.get('/', (req, res) => {

    res.render('home');
})

//Getting response from the home page
app.post('/input', (req, res) => {

    console.log(req.body.medicineInput);

    res.send("Read input");

    /*Here we are going to call get medicine info from openservice.js
    and then console.log it test it first*/
})

//Start the server
app.listen(port, () => {

    console.log(`Listening app on port ${port}`);
})