// Import the array of possible words from the words.js file
import { WORDS } from "./words.js"; 

// Set the total number of guesses allowed in the game
const NUMBER_OF_GUESSES = 6; 

// Initialize the counter for the remaining guesses to the maximum set above
let guessesRemaining = NUMBER_OF_GUESSES; 

// Array to store the letters of the current guess
let currentGuess=[]; 

// Index to keep track of the next letter position in the current guess
let nextLetter = 0; 

// Select a random word from the WORDS array to be the target word for the current game
let rightGuessString = WORDS[Math.floor(Math.random() * WORDS.length)]

// Output the correct word to the console for debugging
console.log(rightGuessString)

// Function to initialize the game board
function initBoard() {
    // Get the game board container by its element ID
    let board = document.getElementById("game-board"); 
    
    // Create rows for the number of guesses allowed
    for (let i = 0; i < NUMBER_OF_GUESSES; i ++) {
        // Create a new div element for each row of guesses
        let row = document.createElement("div")
        row.className = "letter-row" // Assign class for styling purposes

        // Create five boxes per row to hold each letter of the guess
        for (let j= 0; j < 5; j++) {
            let box=document.createElement("div")
            box.className = "letter-box" // Assign class for styling purposes
            row.appendChild(box) // Add the box to the current row
        }
        board.appendChild(row) // Add the completed row to the board
    }
}
