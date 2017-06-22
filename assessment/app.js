const express = require("express");
const bodyParser = require("body-parser");
const validator = require("express-validator");
const mustacheExpress = require("mustache-express");
const path = require("path");
const session = require("express-session");

const app = express();

app.use(express.static(path.join(__dirname, "public")));


app.engine("mustache", mustacheExpress());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "mustache");


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(validator());


app.use(session({
  secret: 'Yes!',
  resave: false,
  saveUninitialized: false
}));

let users = [{username: "", password: "password"}];
let messages = [];


app.get("/", function(req, res) {
  if (req.session.username) {
    res.redirect("/user");
  } else {
    res.render("index");
  }
});

app.get("/login", function(req, res) {
  res.render("login");
});

app.post("/login", function(req, res) {
  let loggedUser;
  messages = [];
  req.session.username = req.body.username

  users.forEach(function(user){
    if (user.username === req.body.username) {
      loggedUser = user;
    }
  });

  req.checkBody("username", "Please Enter a valid username.").notEmpty().isLength({min: 6, max: 20});
  req.checkBody("password", "Please Enter a Password.").notEmpty();
  req.checkBody("password", "Invalid password and username combination.").equals(loggedUser.password);

  let errors = req.validationErrors();

  if (errors) {
    errors.forEach(function(error) {
      messages.push(error.msg);
    });
    res.render("login", {errors: messages});
  } else {

    req.session.username = req.body.username;

    res.redirect("/user");
  }

  res.redirect("/user");
});

app.get("/user", function(req, res) {
  res.render("user", {username: req.session.username});
});

app.listen(8080, function() {
  console.log("App is running on localhost:8080");
});