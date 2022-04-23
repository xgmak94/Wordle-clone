# Introduction
This is a clone project of the popular word guessing game [Wordle](https://www.nytimes.com/games/wordle/index.html). 
It's Wordle but you can play as long as you want.

# Rules
* You get 6 tries to guess a 5-letter predetermined word.
* Click on the *Question Mark* symbol on the top left to learn through an example.
* Click on the *Graph* symbol on the top right for your session statistics.
* After each guess, the letters light up in various colors as clues.
* After each guess, the letters will light up to assist and give you clues about the correct word.
    * Green means a letter is both correct in the word and in the correct spot.
    * Yellow means a letter is in the word but is in a different spot in the word.
    * Gray means a letter is not in the word at all.
<br>

# Notes
* Words are randomly chosen from a predetermined list, words.txt.
* The correct word is logged to the console each time it is chosen.
* Statistics are tracked, but only for the current session.