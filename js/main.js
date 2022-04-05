let allWords = new Set();
let guessedWords = [[]];
let firstEmptySpace = 0;

const words = ["sweet", "onion", "shoes", "heavy", "couch"];
let currentWordIndex = 0;
let currentWord = words[currentWordIndex];

//EXAMPLE WORD RIGHT NOW
function getRandomWord() {
    return "dairy";
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
        tile.classList.add("animate__animated");
        tile.classList.add("tile");
        tile.setAttribute("id", i);
        board.appendChild(tile);
    }
}

function createKeyboard() {
    keyboardRow("qwertyuiop", 1, false, false);
    keyboardRow("asdfghjkl", 2, true, false);
    keyboardRow("zxcvbnm", 3, false, true);
}

function keyboardRow(letters, rowNum, spacers, enterAndDelete) {
    const row = document.getElementById(`keyboard-row ${rowNum}`);

    let spacer1 = document.createElement("div");
    let spacer2 = document.createElement("div");
    spacer1.setAttribute("class", "spacer-half");
    spacer2.setAttribute("class", "spacer-half");

    let ent = document.createElement("button");
    ent.setAttribute("class", "wide-button");
    ent.setAttribute("data-key", "Enter");
    ent.textContent = "Enter";

    let del = document.createElement("button");
    del.setAttribute("class", "wide-button");
    del.setAttribute("data-key", "Delete");
    del.textContent = "Delete";

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
    return words[currentWordIndex];
}

function update(key) { //if we pressed a letter
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

function updateEnter() { //enter pressed
    const currentWord = getCurrentGuess();
    const guess = currentWord.join("");
    if(currentWord.length != WORD_LENGTH) {
        window.alert("Not enough letters");
        return;
    }

    //TODO: CHECK WORD IS REAL
    if(!isValidWord(guess)) {
        window.alert("Not in word list");
        return;
    }

    //TODO: FUNCTION TO SHOW CORRECT LETTERS
    for(let i = 0 ; i < currentWord.length ; i++) {
        tile = document.getElementById((guessedWords.length-1)*WORD_LENGTH + i);
        tile.classList.add("animate__flipInX");
        tile.style.backgroundColor = compareLetter(currentWord[i], guess, i); //set color depending on letter
    }

    if(guess == getCurrentWord()) { //correct guess
        window.alert("Congratulations!")
    }
    else { //guess is wrong
        if(guessedWords.length == NUM_GUESSES) { //out of chances, display correct answer
            window.alert(`Sorry, you have no more guesses! The word was ${word}.`);
        }
        else { //guess was wrong we still have more chances
            guessedWords.push([]);
        }
    }
}

function updateDelete() { //delete key pressed
    const currentWord = getCurrentGuess();
    currentWord.pop();

    console.log(currentWord);
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

function compareLetter(letter, guess, index) { //check if letter exists in correct word
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

//TODO:LOCAL STORAGE TO KEEP TRACK OF STATS
function updateStatsModal() {
    const currentStreak = window.localStorage.getItem("currentStreak") || 0;
    const totalWins = window.localStorage.getItem("totalWins") || 0;
    const totalGames = window.localStorage.getItem("totalGames") || 0;
    
    document.getElementById("total-played").textContent = totalGames;
    document.getElementById("total-wins").textContent = totalWins;
    document.getElementById("current-streak").textContent = currentStreak;

    const winPct = Math.round((totalWins / totalGames) * 100) || 0;
    document.getElementById("win-pct").textContent = winPct;
}

function initHelpModal() {
    const modal = document.getElementById("help-modal");
    // Get the button that opens the modal
    const btn = document.getElementById("help");
    // Get the <span> element that closes the modal
    const span = document.getElementById("close-help");
    // When the user clicks on the button, open the modal
    btn.addEventListener("click", function () {
        modal.style.display = "block";
    });
    // When the user clicks on <span> (x), close the modal
    span.addEventListener("click", function () {
        modal.style.display = "none";
    });
    // When the user clicks anywhere outside of the modal, close it
    window.addEventListener("click", function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    });
  }

function initStatsModal() {
    const modal = document.getElementById("stats-modal");
    // Get the button that opens the modal
    const btn = document.getElementById("stats");
    // Get the <span> element that closes the modal
    const span = document.getElementById("close-stats");
    // When the user clicks on the button, open the modal
    btn.addEventListener("click", function () {
        updateStatsModal();
        modal.style.display = "block";
    });
    // When the user clicks on <span> (x), close the modal
    span.addEventListener("click", function () {
        modal.style.display = "none";
    });
    // When the user clicks anywhere outside of the modal, close it
    window.addEventListener("click", function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    });
}

function initSet() {
    fetch('words.txt')
        .then(response => response.text())
        .then(data => {
            all = data.split(/\r?\n/);
            all.forEach(word => {
                allWords.add(word);
            });
        });
}

document.addEventListener("DOMContentLoaded", () => {
    initSet();

    getRandomWord();

    createHeader();
    initHelpModal(); //help button for header
    initStatsModal(); //stats button for header

    createGuessTiles(); //create 6x5 for guesses
    createKeyboard(); //create keyboard buttons
    keyboardListeners(); //listeners for keyboard
});
