//jshint esversion:6
require('dotenv').config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

console.log(process.env.API_KEY);

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

//This code put the mongoose in action - Used to connect to mongoDB.
//the localhost:27017 is the default port;
//At the end write the database's name.
mongoose.connect("mongodb://localhost:27017/userD");

//Create a schema(structure for your database):
//Remember that is schema is our Javascript Object.
const userSchema = new mongoose.Schema ({
  email: String,
  password: String
});



//Using the convenient encryption:
userSchema.plugin(encrypt, {secret: process.env.SECRET,  encryptedFields: ["password"]});//This has to be created before the model.
//Plugins extend functionality.
//encrypts when you call save, and decrypt when you call find.



//After create an Schema -- Create a model.
//Model always have first letter capitalized;
//Inside the parentheses specify the name of the Collection:
//Remember - Collection's name using quotation marks + comma + schema.
const User = new mongoose.model("User", userSchema);
// Next step is create data or documents. Created in the register page.

//This code allow us to view the webpage:
//Use app.get to render the home page.
//res.render is used to render a view and sends the render HTML string to the client.
app.get("/", function(req, res){
 res.render("home");
});

app.get("/login", function(req, res){
 res.render("login");
});

app.get("/register", function(req, res){
 res.render("register");
});
// Now you can use http://localhost:3000/ to see what is in these pages.



//Catching data from the users: After this:
// const User = new mongoose.model("User", userSchema);
//Inside the callback we will create our new brand user.
//we get the information from the form in the register page.
//name="take this information"
app.post("/register", function(req, res){
  const newUser = new User ({
    email: req.body.username,
    password: req.body.password
  });
  // Now save this new user and add a callback to check to see that during the
  //save process happens any erros.
  newUser.save(function(err){
    if (err){
      console.log(err);
    } else {
      res.render("secrets");
    }
  });
});

//Create app.post for a login page:
//This part will check if the database provide by the user is correct or not.
app.post("/login", function(req, res){
  //store the information provided by the user in the login page.
  const username = req.body.username;
  const password = req.body.password;
//Checking in our database if the user provided a valid user name, if 'yes' --
//the password matches with the username.

//Looking through our collection of users 'User'.
//Look if our email's field matches with our username field.
User.findOne({email:username}, function(err, foundUser){
  if (err){
    console.log(err);
  }else{
    if (foundUser){ //If the user exists run the next code:
      if(foundUser.password === password){
        res.render("secrets");
        //Now, to to the login page, if you write the username and the password
      //right you will be sent to the page secrets.
      }
    }
  }
});

});














app.listen(3000, function(){
  console.log("Server started on port 3000.");

});
