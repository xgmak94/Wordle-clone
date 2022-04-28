# Introduction
This is a clone project of the popular word guessing game [Wordle](https://www.nytimes.com/games/wordle/index.html) made using HTML, CSS, and JS.
<br>
It's Wordle but you can play as long as you want.
<br>
[Try it out here!](https://xgmak94.github.io/Wordle-clone/)

# Rules
* You get 6 tries to guess a 5-letter predetermined word.
* Click on the *Question Mark* symbol on the top left to learn through an example.
* Click on the *Graph* symbol on the top right for your session statistics.
* After each guess, the letters will light up to assist and give you clues about the correct word.
    * Green means a letter is both correct in the word and in the correct spot.
    * Yellow means a letter is in the word but is in a different spot in the word.
    * Gray means a letter is not in the word at all.

# Notes
* Words are randomly chosen from a predetermined list, words.txt.
* The correct word is logged to the console each time it is chosen.
* Statistics are tracked, but only for the current session.