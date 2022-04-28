let possibleAnswers = new Set(); //store all possible answers
let possibleGuesses = new Set(); //store all possible guesses
let guessedWords = [[]]; //store current guesses of the word
let firstEmptySpace = 0; //store which space to fill in when adding letters to guesses
let currentWord = ""; //the currently correct word

//game statistics
let currentStreak = 0;
let maxStreak = 0;
let totalWins = 0;
let totalGames = 0;

function resetGame() {
    currentWord = getRandomWord();
    guessedWords = [[]];
    firstEmptySpace = 0; //reset back to first spot
    clearGuesses(); // clear tiles
}

function getRandomWord() {
    let idx = Math.floor(Math.random() * possibleAnswers.size);
    let items = [];
    possibleAnswers.forEach(v => items.push(v));

    console.log(items[idx]);
    return items[idx];
}

function clearGuesses() {
    //get and clear all tiles
    for(let i = 0 ; i < NUM_GUESSES*WORD_LENGTH ; i++) {
        const tile = document.getElementById(i);
        tile.textContent = undefined;
        tile.style.backgroundColor = "";
    }
}

async function initGuesses() {
    await fetch(guessesFile)
    .then(response => response.text())
    .then(data => {
        all = data.split(/\r?\n/);
        all.forEach(word => {
            possibleGuesses.add(word);
        });
    });
}

async function initAnswers() {
    await fetch(answersFile)
    .then(response => response.text())
    .then(data => {
        all = data.split(/\r?\n/);
        all.forEach(word => {
            possibleAnswers.add(word);
        });
    });
}

function createHeader() {
    const header = document.getElementById("title");

    let help = document.createElement("i");
    help.setAttribute("class", "far fa-question-circle");
    help.setAttribute("id", "help");
    header.appendChild(help);

    let title = document.createElement("h1");
    title.setAttribute("class", "title");
    title.textContent = "WORDLE";
    header.appendChild(title);

    let stats = document.createElement("i");
    stats.setAttribute("class", "fas fa-chart-bar");
    stats.setAttribute("id", "stats");
    header.appendChild(stats);
}

function createGuessTiles() {
    const board = document.getElementById("board");
    for(let i = 0 ; i < NUM_GUESSES*WORD_LENGTH ; i++) {
        let tile = document.createElement("div");
        tile.classList.add("tile");
        tile.setAttribute("id", i);
        board.appendChild(tile);
    }
}

function createKeyboard() {
    function keyboardRow(letters, rowNum, spacers, enterAndDelete) {
        const row = document.getElementById(`keyboard-row ${rowNum}`);
    
        let spacer1 = document.createElement("div");
        let spacer2 = document.createElement("div");
        spacer1.setAttribute("class", "spacer-half");
        spacer2.setAttribute("class", "spacer-half");
    
        let ent = document.createElement("button");
        ent.setAttribute("class", "wide-button");
        ent.setAttribute("data-key", "enter");
        ent.textContent = "ent";
    
        let del = document.createElement("button");
        del.setAttribute("class", "wide-button");
        del.setAttribute("data-key", "delete");
        del.textContent = "del";
    
        //adding buttons
        for(let i = 0 ; i < letters.length ; i++) {
            const letter = letters.charAt(i);
    
            let button = document.createElement("button");
            button.setAttribute("data-key", letter);
            button.textContent = letter;
            row.appendChild(button);
        }
        if(spacers) {
            row.insertBefore(spacer1, row.firstChild);
            row.appendChild(spacer2);
        }
        if(enterAndDelete) {
            row.insertBefore(ent, row.firstChild);
            row.appendChild(del);
        }
    }

    keyboardRow("qwertyuiop", 1, false, false);
    keyboardRow("asdfghjkl", 2, true, false);
    keyboardRow("zxcvbnm", 3, false, true);
}

function keyboardListeners() {
    //create listeners for keys
    const allKeys = document.querySelectorAll(".keyboard-row button");
    for(let i = 0 ; i < allKeys.length ; i++) {
        allKeys[i].onclick = ({target}) => {
            const key = target.getAttribute("data-key");
            update(key); //update depending, pass in data-key to know what to do
        };
    }
}

function isValidWord(word) {
    return possibleGuesses.has(word) || possibleAnswers.has(word);
}

function getCurrentGuess() { //will return last word as an array
    const numberGuesses = guessedWords.length
    return guessedWords[numberGuesses - 1];
}

function getCurrentWord() {
    return currentWord;
}

function update(key) { //if we pressed a letter
    //TODO:MAKE A BETTER IMPLEMENTATION OF THE COMPARISON BETWEEN WORD AND GUESSED WORD
    async function updateEnter() { //enter pressed
        function compareGuess(guess, actual) { //will return an array of length WORD_LENGTH, containing the colors to change
            let colors = Array(5).fill(grey);
            let map = new Map();
            for(let i = 0 ; i < WORD_LENGTH ; i++) {
                let c = actual.charAt(i);
                if(!map.has(c)) map.set(c, 0);
                map.set(c, map.get(c) + 1);
            }

            for(let i = 0 ; i < WORD_LENGTH ; i++) { //correct letter and position
                if(guess.charAt(i) == actual.charAt(i)) {
                    map.set(guess.charAt(i), map.get(i) - 1);
                    colors[i] = green;
                }
            }

            for(let i = 0 ; i < WORD_LENGTH ; i++) {
                let c = guess.charAt(i);
                if(colors[i] == grey && actual.includes(c) && map.get(c) > 0) {
                    map.set(c, map.get(c) - 1);
                    colors[i] = yellow;
                }
            }
            return colors;
        }

        let currentGuess = getCurrentGuess().join(""); //join together string
        let actualWord = getCurrentWord();
        // guess is not legal, ERROR MESSAGE
        if(currentGuess.length != WORD_LENGTH || !isValidWord(currentGuess)) {
            if(curr.length != WORD_LENGTH) {
                window.alert("Not enough letters");
            }
            else if(!isValidWord(currentGuess)) {
                window.alert("Not in word list");
            }
            return;
        }

        //loop through letters to change background colors
        let colors = compareGuess(currentGuess, actualWord);
        for(let i = 0 ; i < WORD_LENGTH ; i++) {
            tile = document.getElementById((guessedWords.length-1)*WORD_LENGTH + i);
            tile.classList.add("animate__animated", "animate__flipInX");
            tile.style.backgroundColor = colors[i]; //set color depending on letter
        }
        
        if(currentGuess == actualWord) { //GUESS IS CORRECT
            window.alert("Congratulations, You won!");
            currentStreak++;
            totalWins++;
            totalGames++;

            resetGame();
            updateStatsModal();
        }
        else { //GUESS IS WRONG
            if(guessedWords.length == NUM_GUESSES) { //NO MORE CHANCES REVEAL CORRECT ANSWER
                window.alert(`Sorry, you have no more guesses! The word was ${actualWord}.`);
                currentStreak = 0;
                totalGames++;

                resetGame();
                updateStatsModal();
            }
            else { //WE STILL HAVE MORE CHANCES
                guessedWords.push([]);
            }
        }
    }
    
    function updateDelete() { //delete key pressed
        let currentGuess = getCurrentGuess();
        currentGuess.pop();
        
        guessedWords[guessedWords.length-1] = currentGuess;
        
        const lastLetterElement = document.getElementById(String((guessedWords.length-1)*WORD_LENGTH + currentGuess.length));
        lastLetterElement.textContent = undefined; // clears the last tile
    
        if(firstEmptySpace > (guessedWords.length-1)*WORD_LENGTH) { //MAKE SURE WE DO NOT GO BACK TO PREVIOUS WORD
            firstEmptySpace--;
        }
    }
    
    function updateLetter(key) { //any letter key pressed
        const currentGuess = getCurrentGuess();
        if(currentGuess && currentGuess.length < WORD_LENGTH) { //CAN ONLY ADD LETTERS
            currentGuess.push(key.toLowerCase()); //store the words as lowercase
            const element = document.getElementById(firstEmptySpace);
    
            firstEmptySpace++;
            element.textContent = key;
        }
    }

    if(key == "enter") { //enter pressed
        updateEnter();
    }
    else if(key == "delete") { //delete pressed
        updateDelete();
    }
    else { //letter pressed
        updateLetter(key);
    }
}

function initHelpModal() {
    const modal = document.getElementById("help-modal");
    const btn = document.getElementById("help");
    const span = document.getElementById("close-help");
    // User clicks on the button, open the modal
    btn.addEventListener("click", function () {
        modal.style.display = "block";
    });
    // User clicks on x, close the modal
    span.addEventListener("click", function () {
        modal.style.display = "none";
    });
    // User clicks outside of the modal, close it
    window.addEventListener("click", function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    });
  }

function initStatsModal() {
    const modal = document.getElementById("stats-modal");
    const btn = document.getElementById("stats");
    const span = document.getElementById("close-stats");
    // User clicks on the button, open the modal
    btn.addEventListener("click", function () {
        updateStatsModal();
        modal.style.display = "block";
    });
    // User clicks on x, close the modal
    span.addEventListener("click", function () {
        modal.style.display = "none";
    });
    // User clicks outside of the modal, close it
    window.addEventListener("click", function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    });
}

function updateStatsModal() {
    // Set text
    document.getElementById("total-played").textContent = totalGames;
    document.getElementById("total-wins").textContent = totalWins;
    document.getElementById("current-streak").textContent = currentStreak;

    if(currentStreak > maxStreak) maxStreak = currentStreak;
    document.getElementById("max-streak").textContent = maxStreak;

    const winPercent = Math.round((totalWins / totalGames) * 100) || 0;
    document.getElementById("win-pct").textContent = winPercent;
}

document.addEventListener("DOMContentLoaded", async () => {
    await initAnswers();
    await initGuesses();

    createHeader(); //header
    initHelpModal(); //help button for header
    initStatsModal(); //stats button for header

    createGuessTiles(); //create 6x5 tiles for guesses
    createKeyboard(); //create keyboard buttons
    keyboardListeners(); //listeners for keyboard
    
    resetGame(); //clears everything
});
