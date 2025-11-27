import { useState, useEffect, useRef } from 'react'
import { getRandomWord } from '../utils.js'
import Word from './Word.jsx'
import './TypingTest.css'

export default function TypingTest() {
    const [typed, setTyped] = useState("");
    const [line, setLine] = useState(-1);

    // holds the words we already typed
    const prevWordList = useRef(Array(2).fill().map(() => []));
    // holds the words we need to type
    const wordLists = useRef(Array(3));
    const fieldRef = useRef(null);
    const lineWidth = 1000;

    const allPrevTyped = prevWordList.current.flat().reduce((acc, val) => acc += val.typedWord + " ", "");

    const currentWordIdx = useRef(0);
    const currentWord = wordLists.current[0] ? wordLists.current[line][currentWordIdx.current] : "";
    const stats = useRef({
        correct: 0,
        wrong: 0,
        missed: 0,
        extra: 0
    })

    const uniqueId = useRef(0);

    useEffect(() => {
        for (let i = 0; i < 3; i++) {
            const lineWords = [];
            let total = "";
            while (getTextWidth(total) < lineWidth) {
                const word = getRandomWord();
                lineWords.push(word);
                total += word + " ";
            }
            lineWords.pop();
            wordLists.current[i] = lineWords;
        }
        setLine(0);
    }, [])

    function getKey() {
        return uniqueId.current++;
    }

    function getTextWidth(text) {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        ctx.font = "32px roboto mono";
        return ctx.measureText(text).width;
    }

    let prevWordElements = prevWordList.current.flat().map((prevTyped, index) => {
        if (!prevTyped.text || !prevTyped.typedWord) {
            return null;
        }
        return <Word text={prevTyped.text} typedWord={prevTyped.typedWord} key={getKey()} />
    })

    let wordElements = [<Word typedWord={typed} text={currentWord} key={getKey()} />];
    if (wordLists.current[0]) {
        for (let i = line; i < 3; i++) {
            for (let j = (i === line ? currentWordIdx.current + 1 : 0); j < wordLists.current[i].length; j++) {
                wordElements.push(<Word text={wordLists.current[i][j]} key={getKey()} />);
            }
        }
    }


    function moveToNextWord() {
        prevWordList.current[line].push({
            typedWord: typed,
            text: currentWord
        });
        for (let i = 0; i < Math.min(typed.length, currentWord.length); i++) {
            if (typed[i] !== currentWord[i]) {
                stats.current.wrong++;
            }
            else if (typed[i] === currentWord[i]) {
                stats.current.correct++;
            }
        }
        if (typed.length > currentWord.length) {
            stats.current.extra += typed.length - currentWord.length;
        }
        else if (typed.length < currentWord.length) {
            stats.current.missed += currentWord.length - typed.length;
        }
        currentWordIdx.current++;
        const lineLength = wordLists.current[line].length;
        console.log(prevWordList.current);
        if (currentWordIdx.current >= lineLength) {
            if (line === 1) {
                prevWordList.current.shift();
                prevWordList.current.push([]);
                wordLists.current.shift();
                const lineWords = [];
                let total = "";
                while (getTextWidth(total) < lineWidth) {
                    const word = getRandomWord();
                    lineWords.push(word);
                    total += word + " ";
                }
                lineWords.pop();
                wordLists.current.push(lineWords);
                setLine(1);
            }
            else {
                setLine(prev => prev + 1);
            }
            currentWordIdx.current = 0;
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
    }

    const prevTypedOnLine = prevWordList.current[line].reduce((acc, val) => {
        return acc + val;
    }, "");

    const caretStyle = {
        top: `${6 + line * 40}px`,   // 40px = line height
        left: `${9 + ((getTextWidth(prevTypedOnLine) + getTextWidth(typed)) % lineWidth)}px`
    };

    /**
     * render each line individually, when we finish one line, move the next
     */

    return (
        <>
            <section ref={fieldRef} className="typing-field">
                <div style={caretStyle} id="caret"></div>
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
                <p key={getKey()}>Incorrect letters: {stats.current.wrong}</p>
                <p key={getKey()}>Correct letters: {stats.current.correct}</p>
                <p key={getKey()}>Extra letters: {stats.current.extra}</p>
                <p key={getKey()}>Missing letters: {stats.current.missed}</p>
            </div>
        </>
    )
}
