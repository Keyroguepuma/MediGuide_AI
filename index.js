//Load libraries
const express = require('express');
const hbs = require('express-handlebars');
const {getMedicineInfo} = require("./openservice");
require('dotenv').config();


//Set up the variables
const app = express();
const port = process.env.PORT || 3000;

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
app.use(express.json());

//Home page
app.get('/', (req, res) => {

    res.render('home');
})

//Getting response from the home page
app.post('/input', async (req, res) => {
  try {
    // Get user input
    let userInput = req.body.medicineInput;

    // 1. Check empty input
    if (!userInput || userInput.trim() === "") {
      return res.status(400).json({
        error: "Please enter a medicine name."
      });
    }

    const cleanedInput = userInput.trim();
    const lowerInput = cleanedInput.toLowerCase();

    // 2. Limit input length
    if (cleanedInput.length > 120) {
      return res.status(400).json({
        error: "Input too long. Please enter a short sentence or medicine name."
      });
    }

    // 3. Make sure input contains letters
    if (!/[a-zA-Z]/.test(cleanedInput)) {
      return res.status(400).json({
        error: "Invalid input. Please enter a medicine name."
      });
    }

    // 4. Block unsafe/unrelated words
    const blockedWords = ["bomb", "weapon", "kill", "suicide", "overdose"];

    if (blockedWords.some(word => lowerInput.includes(word))) {
      return res.status(400).json({
        error: "Please enter a medication-related query only."
      });
    }

    // 5. Detect medicine name from input
    const medicineList = [
      "tylenol", "acetaminophen",
      "ibuprofen", "advil", "motrin",
      "aspirin", "aleve", "naproxen",
      "benadryl", "diphenhydramine",
      "zyrtec", "cetirizine",
      "claritin", "loratadine",
      "amoxicillin", "metformin",
      "atorvastatin", "lisinopril",
      "omeprazole", "tums", "pepto"
    ];

    const detectedMedicine = medicineList.find(med =>
      lowerInput.includes(med)
    );

    // 6. Call the API if medicine found
    if(detectedMedicine){

      const url = `https://api.fda.gov/drug/label.json?search=openfda.brand_name:${detectedMedicine}&limit=1`;


      fetch(url)
      .then(res => res.json())
      
      .then(data => {

      userInput = userInput + JSON.stringify(data.result[0]);})
      
      .catch(error => {
        console.log(error);
      })


    }

    console.log(userInput);

   

    // 7. Call AI ONLY with clean medicine name
    // const result = await getMedicineInfo(detectedMedicine);
    const result = await getMedicineInfo(userInput);

    //Send result to frontend
    // res.json(result); - This line was creating the limited chat

    // Added this line for it to fully show the result via chat.
    res.json({
  reply: result
});

  } catch (error) {
    console.error("Error in /input route:", error);

    res.status(500).json({
      error: "Something went wrong. Please try again."
    });
  }
});

//Start the server
app.listen(port, () => {
  console.log(`Listening app on port ${port}`);
});