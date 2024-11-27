const fetchFileURL = '../json/words.json';

let usedIndices = [];

const Game = {
    word: "",
    hint: "",
    imageSource: `../images/0.png`,
    guessedLetters: [],
    remainingAttempts: 7,

    displayWord: function() {
        return this.word.split('').map(letter => {
            return this.guessedLetters.includes(letter) ? letter : '_';
        }).join(' ');
    },

    guessLetter: function(letter) {
        if (this.guessedLetters.includes(letter) || this.remainingAttempts <= 0) {
            return;
        }
        this.guessedLetters.push(letter);
        if (!this.word.includes(letter)) {
            this.remainingAttempts--;
            this.imageSource = `../images/${7 - this.remainingAttempts}.png`;
        }
        updateUI();
    },
    isGameOver: function() {
        return this.remainingAttempts === 0 || this.displayWord().indexOf('_') === -1;
    },
    isWinner: function() {
        return this.displayWord().indexOf('_') === -1;
    }
};


function fetchData() {
    fetch(fetchFileURL).then(function(response) {
            console.log(`Fetch response received. response.ok is ${response.ok}`);
            if (response.ok) {
                console.log(`Response is ok, proceed to access data`);
                return response.json();
            }
        })
        .then(function(data) {
            if (usedIndices.length === data.length) {
                usedIndices = [];
            }
            let randomIndex;
            do {
                randomIndex = Math.floor(Math.random() * data.length);
            } while (usedIndices.includes(randomIndex));
            usedIndices.push(randomIndex);
            Game.word = data[randomIndex].word;
            Game.hint = data[randomIndex].hint;
            updateUI();
        })
        .catch(function() {
            console.log("Catch fetch error");
        });
}

fetchData();

function restartGame() {
    Game.word = "";
    Game.hint = "";
    Game.imageSource = `../images/0.png`;
    Game.guessedLetters = [];
    Game.remainingAttempts = 7;
    fetchData();
}

function updateUI() {
    document.getElementById('word-section').innerHTML = Game.displayWord();
    document.getElementById('hint-section').innerHTML = 'Hint: ' + Game.hint + ` (You have ${Game.remainingAttempts} attempt(s) remaining)`;
    document.getElementById('hangman-image').setAttribute('src', Game.imageSource);

    if (Game.isWinner()) {
        document.getElementById('popup').innerHTML = `<h1>Congrats!</h1>
      <p>You beat the game.<br>
        <br>Press the restart<br>button to play the game again! 
      </p>
      <img id="restart-button" src="../images/restart.png" alt="restart-button">`;
        setTimeout(function() {
            document.getElementById('popup').style.opacity = '1';
        }, 300);

        const restartButton = document.getElementById('restart-button');

        restartButton.addEventListener("click", function() {
            document.getElementById('popup').style.opacity = '0';
            restartGame();
        });
    } else if (Game.isGameOver()) {
        document.getElementById('popup').innerHTML = `<h1>Oops, try again.</h1>
      <p>You ran out of attempts.<br>
        <br>Press the restart<br>button to play the game again! 
      </p>
      <img id="restart-button" src="../images/restart.png" alt="restart-button">`;
        setTimeout(function() {
            document.getElementById('popup').style.opacity = '1';
        }, 500);
        const restartButton = document.getElementById('restart-button');
        restartButton.addEventListener("click", function() {
            document.getElementById('popup').style.opacity = '0';
            restartGame();
        });
    }
}

function createLetterButtons() {
    const alphabet = 'qwertyuiopasdfghjklzxcvbnm';
    const container = document.getElementById('keyboard-section');
    alphabet.split('').forEach(letter => {
        const button = document.createElement('button');
        button.textContent = letter;
        button.classList.add('letter-button');
        button.addEventListener('click', () => Game.guessLetter(letter));
        if (letter === 'p' || letter === 'l') {
            container.appendChild(document.createElement('br'));
            container.appendChild(button);
        } else {
            container.appendChild(button);
        }
    });
}

function initGame() {
    createLetterButtons();
}

initGame();