//Require modules and models

var express = require("express");
var models = require("./models/index");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");

var app = express();

//Set view engine

app.set("view engine", "ejs");

//Middleware

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({
    extended:true
}));

app.use(methodOverride("_method"));

app.get("/", function(req, res) {
    res.redirect(301, "/chirps");
});

//Get all chirps
app.get("/chirps", (req, res) => {
  // Step 1: Retrieve all chirps from DB
  // Step 2: Send back index.html with all of the chirps inside
  models.Chirp.findAll().then((chirps) => {
    res.render("index", { chirps });
  });
});

//Create new chirp
app.post("/chirps", (req, res) => {
  // Step 1: Retrieve new chirp text from the web form
  var newChirp = req.body;

  // Step 2: Insert new record into the Chirp table in the DB
  models.Chirp.create(newChirp).then(() => {
    // Step 3: Redirect user back to GET /chirps
    res.redirect("/chirps");
  });
});

//Get specific chirp
app.get("/chirps/:id/edit", (req, res) => {
  // Step 1: Retrieve chirp via its ID that comes from the URL from the DB
  models.Chirp.findById(req.params.id).then((chirp) => {
    // Step 2: Send back edit.html with the specific chirp inside
    res.render("edit", { chirp });
  });
});

//Edit a chirp
app.put("/chirps/:id", (req, res) => {
  // Step 1: Get new chirp information from the web form
  var editedChirp = req.body;

  // Step 2: Retrieve specific chirp from DB via its ID from the URL
  models.Chirp.findById(req.params.id).then((chirp) => {
    // Step 3: Perform update to specific record in DB
    chirp.updateAttributes(editedChirp).then(() => {
      // Step 4: Redirect user back to GET /chirps
      res.redirect("/chirps");
    });
  });
});

//Delete a chirp
// Hint: .destroy()
app.delete("/chirps/:id", (req, res) => {
  // Step 1: Find specific chirp via its ID from the URL
  models.Chirp.findById(req.params.id).then((chirp) => {
    // Step 2: Perform deletion on that chirp
    chirp.destroy().then(() => {
      // Step 3: Redirect back to GET /chirps
      res.redirect("/chirps");
    });
  });
});

app.listen(process.env.PORT || 3000);
