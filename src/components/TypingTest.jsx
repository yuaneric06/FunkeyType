import { useState, useEffect, useRef } from 'react'
import { getRandomWord } from '../utils.js'
import Word from './Word.jsx'
import './TypingTest.css'

export default function TypingTest() {
    const [typed, setTyped] = useState("");
    
    // holds the words we already typed
    const prevWordList = useRef([]);
    // holds the words we need to type
    const wordList = useRef(Array.from({ length: 100}, () => getRandomWord()));
    // holds the current word we are attempting to type in wordList
    let currentWord = useRef(getRandomWord());
    const totalCorrectLetters = useRef(0);
    const totalWrongLetters = useRef(0);
    const totalMissedLetters = useRef(0);
    const totalExtraLetters = useRef(0);

    const uniqueId = useRef(0);


    function getKey() {
        return uniqueId.current++;
    }

    function getPrevTextWidth() {
        if (prevWordList.current.length === 0) return 0;
        const allPrevTyped = prevWordList.current.reduce((acc, val) => acc += val.text + " ");
        const font = "32px roboto mono"

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        context.font = font;
        const width = context.measureText(allPrevTyped).width;
        return width;
    }


    let prevWordElements = prevWordList.current.map((prevTyped, index) => {
        return <Word text={prevTyped.text} typedWord={prevTyped.typedWord} key={getKey()} />
    })
    let wordElements = [<Word typedWord={typed} text={currentWord.current} key={getKey()} />];
    wordElements = [...wordElements, wordList.current.map((word, index) => {
        return <Word text={word} key={getKey()} />
    })]


    function moveToNextWord() {
        prevWordList.current.push({
            typedWord: typed,
            text: currentWord.current
        });
        for (let i = 0; i < Math.min(typed.length, currentWord.current.length); i++) {
            if (typed[i] !== currentWord.current[i]) {
                totalWrongLetters.current++;
            }
            else if (typed[i] === currentWord.current[i]) {
                totalCorrectLetters.current++;
            }
        }
        if (typed.length > currentWord.current.length) {
            totalExtraLetters.current += typed.length - currentWord.current.length;
        }
        else if (typed.length < currentWord.current.length) {
            totalMissedLetters.current += currentWord.current.length - typed.length;
        }
        currentWord.current = wordList.current.shift();
        wordList.current.push(getRandomWord());

        while (getPrevTextWidth() >= 800) {
            prevWordList.current.shift();
        }
    }

    function handleInput(event) {
        if (event.target.value.at(-1) === ' ') {
            event.target.value = "";
            moveToNextWord();
            setTyped("");
        }
        else {
            setTyped(event.target.value);
        }
        
        // console.log(typed);
    }


    return (
        <>
            <section className="typing-field">
                <input
                    type="text"
                    onChange={handleInput}
                />
                {/* <div>
                    {typed.toString()}
                </div> */}
                {prevWordElements}
                {wordElements}
                
                
            </section>
            <div className="stats-field">
                <p key={getKey()}>Incorrect letters: {totalWrongLetters.current}</p>
                <p key={getKey()}>Correct letters: {totalCorrectLetters.current}</p>
                <p key={getKey()}>Extra letters: {totalExtraLetters.current}</p>
                <p key={getKey()}>Missing letters: {totalMissedLetters.current}</p>
            </div>
        </>
    )
}
            