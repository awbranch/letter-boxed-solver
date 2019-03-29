const fs = require('fs')

const dictPath = process.argv[2]
const puzzle = process.argv[3]

if(process.argv.length !== 4) {
  console.log("Incorrect number of arguments")
  process.exit(-1)
}

if(!fs.existsSync(dictPath)) {
  console.log(`File: ${dictPath} does not exist`)
  process.exit(-1)
}

console.log(`Dictionary: ${dictPath}`)
console.log(`Puzzle: ${puzzle}`)

// Create a grid from the puzzle
let grid = []
puzzle.split(',').forEach((side, i) => {
  [...side].forEach(l => {
    grid.push({
      letter: l.toLowerCase(),
      side: i
    })
  })
})

// Read the dictionary and filter invalid words
let dict = fs.readFileSync(dictPath).toString()
  .split('\r\n')
  .filter(w => validWord(w, grid))
  .map(w => w.toLowerCase())

// Get the list of answers
let answers = solveIt(dict)
if(answers.length > 0) {
  console.log("Answers:\n------------------")
  answers.forEach(a => {
    console.log(`${a.word1}-${a.word2}`)
  })
} else {
  console.log("No Solution Found")
}

function validWord(word, grid) {
  if(word.length < 3) return false

  let lastSide = -1
  for(let i=0; i < word.length; i++) {

    // Find the letter in the grid
    let f = grid.find(g => g.letter === word[i])

    // Not found in grid, skip this word
    if(!f) return false

    // If the letter is on the same side as the last side skip this word
    if(f.side === lastSide) return false

    // Remember the last side
    lastSide = f.side
  }
  return true
}

function solveIt(dict) {
  let answers = []

  for(let i=0; i<dict.length; i++) {
    let word1 = dict[i]

    for(let j=0; j<dict.length; j++) {
      let word2 = dict[j]

      if(word1[word1.length - 1] === word2[0] &&
        uniqueLetterCount(word1 + word2) === 12) {
        answers.push({
          word1: word1.toUpperCase(),
          word2: word2.toUpperCase()
        })
      }
    }
  }

  return answers
}

function uniqueLetterCount(word) {
  let letters = new Set()
  for(let i=0; i<word.length; i++) {
    letters.add(word[i])
  }
  return letters.size
}

