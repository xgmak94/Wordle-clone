var NUM_GUESSES = 6;
var WORD_LENGTH = 5;

//file names
var guessesFile = 'wordle_guesses.txt'; //possible words that can be guessed
var answersFile = 'wordle_answers.txt'; //possible words that can be the answer

//colors for clues
var green = `rgb(83, 141, 78)`; //correct letter && position
var yellow = `rgb(181, 159, 59)`; //correct letter, wrong position
var grey = `rgb(58, 58, 60)`; //wrong letter