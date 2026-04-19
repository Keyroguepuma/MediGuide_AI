const express = require('express');
const hbs = require('express-handlebars');
require('dotenv').config();

//Set up the variables
const app = express();
const port = process.env.PORT;

//For CSS
app.use(express.static('public'));

//Set Up handlebars
app.engine('handlebars', hbs.engine({
  defaultLayout: 'main',
  layoutsDir: './views/layouts',
  partialsDir: './views/partials',
  extname: "hbs"
}));

//This is where the front end is stored
app.set('view engine', 'handlebars');
app.set('views', './views');


//Home page
app.get('/', (req, res) => {

    res.send("Hello world\n");
})

//Start the server
app.listen(port, () => {

    console.log(`Listening app on port ${port}`);
})