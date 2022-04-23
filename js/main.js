let allWords = new Set();
let guessedWords = [[]];
let firstEmptySpace = 0;
let currentWord = ""

//game statistics
let currentStreak = 0;
let totalWins = 0;
let totalGames = 0;

function resetGame() {
    initSetWords();
    guessedWords = [[]];
    firstEmptySpace = 0;
    currentWord = "";
    clearGuesses();
}

function clearGuesses() {
    for(let i = 0 ; i < NUM_GUESSES*WORD_LENGTH ; i++) {
        const tile = document.getElementById(i);
        tile.textContent = undefined;
        tile.style.backgroundColor = "";
    }
}

async function initSetWords() { //initializes a set containing all valid words from `words.txt` file
    function getRandomWord() {
        let items = [];
        allWords.forEach(v => items.push(v));
        currentWord = items[Math.floor(Math.random() * items.length)]
        console.log(currentWord);
    }
    await fetch('words.txt')
        .then(response => response.text())
        .then(data => {
            all = data.split(/\r?\n/);
            all.forEach(word => {
                allWords.add(word);
            });
        });
    getRandomWord();
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
        ent.setAttribute("data-key", "Enter");
        ent.textContent = "Ent";
    
        let del = document.createElement("button");
        del.setAttribute("class", "wide-button");
        del.setAttribute("data-key", "Delete");
        del.textContent = "Del";
    
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
    const keys = document.querySelectorAll(".keyboard-row button");
    for(let i = 0 ; i < keys.length ; i++) {
        keys[i].onclick = ({target}) => {
            const key = target.getAttribute("data-key");
            update(key); //update depending on the key pressed
        };
    }
}

function isValidWord(word) {
    return allWords.has(word);
}

function getCurrentGuess() { //will return last word as an array
    const numberGuesses = guessedWords.length
    return guessedWords[numberGuesses - 1];
}

function getCurrentWord() {
    return currentWord;
}

function update(key) { //if we pressed a letter
    async function updateEnter() { //enter pressed
        function compareLetter(letter, guess, index) { //checks if letter exists in correct word
            let word = getCurrentWord();
            if(word.charAt(index) == letter) { // letter and position are correct
                return `rgb(83, 141, 78)`;
            }
            else if(word.includes(letter)) {
                return `rgb(181, 159, 59)`;
            }
            else {
                return `rgb(58, 58, 60)`;
            }
        }

        const curr = getCurrentGuess();
        const guess = curr.join("");

        //Guess is not legal, ERROR MESSAGE
        if(curr.length != WORD_LENGTH || !isValidWord(guess)) {
            if(curr.length != WORD_LENGTH) {
                window.alert("Not enough letters");
            }
            else if(!isValidWord(guess)) {
                window.alert("Not in word list");
            }
            return;
        }

        //loop through letters to change background colors
        for(let i = 0 ; i < curr.length ; i++) {
            tile = document.getElementById((guessedWords.length-1)*WORD_LENGTH + i);
            tile.classList.add("animate__animated", "animate__flipInX");
            tile.style.backgroundColor = compareLetter(curr[i], guess, i); //set color depending on letter
        }
        
        if(guess == getCurrentWord()) { //correct guess
            window.alert("Congratulations, You won!");
            currentStreak++;
            totalWins++;
            totalGames++;
            resetGame();
            updateStatsModal();
        }
        else { //guess is wrong
            if(guessedWords.length == NUM_GUESSES) { //out of chances, display correct answer
                window.alert(`Sorry, you have no more guesses! The word was ${currentWord}.`);
                currentStreak = 0;
                totalGames++;
                resetGame();
                updateStatsModal();
            }
            else { //guess was wrong we still have a chance
                guessedWords.push([]);
            }
        }
    }
    
    function updateDelete() { //delete key pressed
        const currentWord = getCurrentGuess();
        currentWord.pop();
        
        guessedWords[guessedWords.length-1] = currentWord;
        
        const lastLetterElement = document.getElementById(String((guessedWords.length-1)*WORD_LENGTH + currentWord.length));
        lastLetterElement.textContent = '';
    
        if(firstEmptySpace > (guessedWords.length-1)*WORD_LENGTH) { //limit to only current word
            firstEmptySpace--;
        }
    }
    
    function updateLetter(key) { //any letter key pressed
        const currentWord = getCurrentGuess();
        if(currentWord && currentWord.length < WORD_LENGTH) {
            currentWord.push(key.toLowerCase()); //store the words as lowercase
            const element = document.getElementById(firstEmptySpace);
    
            firstEmptySpace++;
            element.textContent = key;
        }
    }

    if(key == "Enter") { //enter pressed
        updateEnter();
    }
    else if(key == "Delete") { //delete pressed
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

    const winPercent = Math.round((totalWins / totalGames) * 100) || 0;
    document.getElementById("win-pct").textContent = winPercent;
}

document.addEventListener("DOMContentLoaded", async () => {
    createHeader();
    initHelpModal(); //help button for header
    initStatsModal(); //stats button for header

    createGuessTiles(); //create 6x5 for guesses
    createKeyboard(); //create keyboard buttons
    keyboardListeners(); //listeners for keyboard
    
    resetGame(); //clears everything
});
