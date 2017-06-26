const express = require('express');
const app = express();
const mustacheExpress = require('mustache-express');
const session = require('express-session');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const fs = require('fs');
const words = fs.readFileSync("/usr/share/dict/words", "utf-8").toLowerCase().split("\n");

app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
app.use(expressValidator());
app.use(express.static('public'));

app.use(session({
  secret: 'true',
  resave: false,
  saveUninitialized: true
}));

app.engine('mustache', mustacheExpress());
app.set('views', './views');
app.set ('view engine', 'mustache');

app.get('/', function(req, res) {
  res.render('index', gameSettings);
});

app.post('/', function(req, res){
  var guess = req.body.guess;
  if(gameInProgress) submitLetter(guess);
  else startGame();

  res.render('index', gameSettings);
});

app.listen(3000, function() {
  console.log("Hangman... Listening on 3000");
});

var word;
var gameSettings;
var gameInProgress = false;

function pickRandomWord() {

  const words = fs.readFileSync("/usr/share/dict/words", "utf-8").toLowerCase().split("\n");
  var randomNumber = Math.floor(Math.random() * words.length);
  var word;

  word = words[randomNumber];

  return word;

}

function isLetterInWord(letter) {

  if (gameSettings.word.indexOf(letter)!=-1) {
    return true;

  } else {
    return false;
  }

}

function subtractGuess() {
  gameSettings.remainingGuesses--;
}

function startGame() {
  gameInProgress = true;

  gameSettings = {
    remainingGuesses: 8,
    word: pickRandomWord(),
    wrongLettersGuessed: [],
    rightLettersGuessed: [],
    allLettersGuessed: []
  };


}
function submitLetter(letter) {

  if (isLetterInWord(letter)){
     gameSettings.rightLettersGuessed.push(letter);
  } else {
    gameSettings.wrongLettersGuessed.push(letter)
  }

  gameSettings.allLettersGuessed.push(letter);

  subtractGuess();


}
