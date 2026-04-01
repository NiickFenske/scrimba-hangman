import React from "react"
import { languages } from "./languages"
import { clsx } from "clsx"
import { getFarewellText, getRandomWord } from "./utils"

export default function AssemblyEndgame() {

  const [currentWord, setCurrentWord] = React.useState(() => getRandomWord())
  const [guessedLetters, setGuessedLetters] = React.useState([])

  const wrongGuessCount = guessedLetters.filter(letter => !currentWord.includes(letter)).length
  const lastGuessedLetter = guessedLetters[guessedLetters.length -1]
  const isLastGuessIncorrect = lastGuessedLetter && !currentWord.includes(lastGuessedLetter)

  const isGameLost = wrongGuessCount >= languages.length -1
  const isGameWon = currentWord.split("").every(letter => guessedLetters.includes(letter))
  const isGameOver = isGameWon || isGameLost

  const alphabet = "abcdefghijklmnopqrstuvwxyz"

  const languageElements = languages.map((lang, i) => {
    const styles = {
        backgroundColor: lang.backgroundColor,
        color: lang.color
    }
    const className = clsx("chip", {lost: i < wrongGuessCount})
    return (
        <span
            className={className}
            style={styles}
            key={lang.name}
        >
            {lang.name}
        </span>
    )
  })
  
  const letterElements = currentWord.split("").map((letter, index) => {
      const revealLetter = isGameLost || guessedLetters.includes(letter)
      const letterClassName = clsx(isGameLost && !guessedLetters.includes(letter) && "missed-letter")
      return (
        <span className={letterClassName} key={index}>{revealLetter ? letter.toUpperCase(): ""}</span>
      )
    })
  
  const keyboardElements = alphabet.split("").map(letter => {
    const isGuessed = guessedLetters.includes(letter)
    const isCorrect = isGuessed && currentWord.includes(letter)
    const isWrong = isGuessed && !currentWord.includes(letter)
    const className = clsx({
      correct: isCorrect,
      wrong: isWrong
    })

    return (
      <button 
        className={className}
        onClick={() => addGuessedLetter(letter)} 
        disabled={isGameOver}
        key={letter}
        >
          {letter.toUpperCase()}
      </button>
    )
  })

  function addGuessedLetter(letter) {
    setGuessedLetters(prevLetters => 
      prevLetters.includes(letter) ? 
        prevLetters : 
        [...prevLetters, letter]
    )
  }

  const gameStatusClass = clsx("game-status", {
    won: isGameWon,
    lost: isGameLost,
    farewell: !isGameOver && isLastGuessIncorrect
  })

  function startNewGame(){
    setCurrentWord(getRandomWord())
    setGuessedLetters([])
  }
  return (
      <main>
          <header>
              <h1>Assembly: Endgame</h1>
              <p>Guess the word within 8 attempts to keep the
              programming world safe from Assembly!</p>
          </header>
          <section className={gameStatusClass}>
            {isGameOver ? (
                isGameWon ? (
                  <>
                    <h2>You win!</h2>
                    <p>Well done! 🎉</p>
                  </>
                ) : (
                  <>
                    <h2>Game over!</h2>
                    <p>You lose! Better start learning Assembly 😭</p>
                  </>
                )
            ) : isLastGuessIncorrect && (
                  <p className="farewell-message">{getFarewellText(languages[wrongGuessCount - 1].name)}</p>
                )
            }
          </section>
          <section className="language-chips">
              {languageElements}
          </section>
          <section className="word">
              {letterElements}
          </section>
          <section className="keyboard">
              {keyboardElements}
          </section>
          {isGameOver && <button onClick={startNewGame} className="new-game">New Game</button>}
      </main>
  )
}

