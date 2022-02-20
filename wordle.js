// -- GAME SETUP -- //

// import word array from file
import { words } from './modules/4_letter_words.js'

// get random word
let word = words[Math.floor(Math.random() * words.length)].toLowerCase()
let charFreq = {}
console.log(word)


let row = 1 // 1-6 .guess-row[1-6]
let box = 1 // 1-4 .guess-row[1-6].box[1-4]

const WORD_SIZE = 4
const NUMBER_OF_ROWS = 6

let correct = false
let game_end = false

// guess list
let guess = []

// guess string
let guess_str = ""


// COLORS (added to display list and applied to boxes)
// const GRAY = "#abaeb3"
// const GREEN = "#05f541"
// const YELLOW = "#edf505"
const GRAY = "gray"
const GREEN = "green"
const YELLOW = "yellow"

// build display list
let display_list = []

const odeToJoy = new Audio('otj.mp3')


// END -- GAME SETUP -- END //


// 
function charFrequency(word) {
    let charFreq = {}
    for (const c of word) {
        if (charFreq[c] != null)
            charFreq[c] += 1
        else 
            charFreq[c] = 1
    }
    return charFreq
}

function checkGreen() {
    guess.forEach((letter, i) => {
        const currentKey = document.querySelector(`[data-key="${letter.toUpperCase().charCodeAt(0)}"]`)
        // console.log(`GREEN CHECK: ${word[i]} ${guess_str[i]}`)
        if (word[i] === guess_str[i] && charFreq[letter] > 0) {
            display_list[i] = GREEN
            currentKey.classList.remove('yellow')
            currentKey.classList.add('green')
            charFreq[letter] -= 1 // remove 1 count of the letter
        }
    })
}
        
function checkYellow() {
    guess.forEach((letter, i) => {
        const currentKey = document.querySelector(`[data-key="${letter.toUpperCase().charCodeAt(0)}"]`)
        // console.log(`YELLOW CHECK: ${word[i]} ${guess_str[i]}`)
        if (word.includes(letter) && charFreq[letter] > 0) {
            display_list[i] = YELLOW
            if (!currentKey.classList.contains("green")) {
                currentKey.classList.add('yellow')
            }
            charFreq[letter] -= 1 // remove 1 count of the letter
        } else if (!word.includes(letter)) {
            currentKey.classList.add('gray')
        }
    })
}

function colorRow() {
    let guessRow = document.querySelector(`.guess-row${row}`).children
    guessRow = [...guessRow]
    guessRow.forEach((box, i) => {
        box.classList.add(display_list[i])
        box.classList.remove('filled-box')
        console.log(display_list[i])
    })
}

// -- Check current guess, color tiles, move to next row -- //
function checkGuess() {

    charFreq = charFrequency(word)

    display_list = []
    for (const c of word) {
        display_list.push(GRAY)
    }

    guess = guess.map(letter => letter.toLowerCase())
    guess_str = guess.join("").toLowerCase()

    checkGreen()
    checkYellow()
    colorRow()
    
    console.log(display_list)
    if (display_list.filter(color => color == GREEN).length === WORD_SIZE) {
        console.log('You WIN!');
        odeToJoy.play()
        game_end = true
    } else {
        row += 1 
        guess = []
    }

    if (row > NUMBER_OF_ROWS) {
        game_end = true
        console.log('YOU LOSE')
    }    
    
}

// -- Add letter to board, keep track of board positon, call checkAnswer -- //
function enterLetter(e) {
    let key = null
    // check if key or button  // change to ternary
    if (e.type === 'click') {
        console.log(e.target)
        key = e.target
    } else {
        key = document.querySelector(`button[data-key="${e.keyCode}"]`)
    }
    // get key press and current box on game board
    let currentBox = document.querySelector(`.guess-row${row} .box${box}`)
    
    if (!game_end) {
        if (key.innerHTML === "DELETE") { // REMOVE LAST ENTERED LETTER //
            if (box > 1) {
                document.querySelector(`.guess-row${row} .box${box - 1}`).classList.remove('filled-box')
                guess.pop()
                box -= 1
                document.querySelector(`.guess-row${row} .box${box}`).innerHTML = ""
            }
        } else  if (box == WORD_SIZE + 1) { // CHECK FOR ANSWER IF ALL BOXES FILLED //
            if (key.innerHTML === "ENTER") {
                // check answer
                box = 1
                checkGuess()
            } else {
                // play animation to indicate end of entry
                console.log("unable to enter more letters animation")
            }
        } else if (box < WORD_SIZE + 1)  { // ADD LETTER TO BOARD //
                if (key.innerHTML === "ENTER") {
                    // animation that indicates not enough letters entered.
                    console.log("not enough letters animation")
                } else {
                    let letter = key.innerHTML // get letter from key pressed
                    currentBox.innerHTML = key.innerHTML // insert letter in box
                    guess.push(letter) // insert letter in guess array
                    document.querySelector(`.guess-row${row} .box${box}`).classList.add('filled-box')
                    box += 1
                }
        }
    }
}

const buttons = document.querySelectorAll('.key')
 buttons.forEach(button => button.addEventListener('click', enterLetter))
 buttons.forEach(button => button.addEventListener('touchstart', enterLetter))

window.addEventListener('keydown', enterLetter)