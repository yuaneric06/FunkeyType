import { useState, useEffect, useRef } from 'react'
import { getRandomWord } from '../utils.js'
import Word from './Word.jsx'
import './TypingTest.css'

export default function TypingTest() {
    const [typed, setTyped] = useState("");
    const [line, setLine] = useState(0);

    // holds the words we already typed
    const prevWordList = useRef([]);
    // holds the words we need to type
    const wordLists = useRef([]);
    const wordList = useRef(Array.from({ length: 100 }, () => getRandomWord()));
    const fieldRef = useRef(null);
    const lineWidth = 1000;

    
    let currentWord = useRef(getRandomWord());
    const stats = useRef({
        correct: 0,
        wrong: 0,
        missed: 0,
        extra: 0
    })
    console.log("linewidth: ", lineWidth);
    
    const uniqueId = useRef(0);
    
    useEffect(() => {
        for (let i = 0; i < 3; i++) {
            const line = [];
            let total = "";
            console.log(getTextWidth(total));
            while (getTextWidth(total) < lineWidth) {
                console.log(getTextWidth(total));
                const word = getRandomWord();
                line.push(word);
                total += word + " ";
            }
            line.pop();
            wordLists.current.push(line);
        }
        console.log(wordLists.current);
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

    function getPrevTextWidth() {
        if (prevWordList.current.length === 0) return 0;
        const allPrevTyped = prevWordList.current.reduce((acc, val) => acc += val.typedWord + " ", "");
        console.log(prevWordList.current);
        console.log("prev typed: ", allPrevTyped);
        const font = "32px roboto mono";

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
                stats.current.wrong++;
            }
            else if (typed[i] === currentWord.current[i]) {
                stats.current.correct++;
            }
        }
        if (typed.length > currentWord.current.length) {
            stats.current.extra += typed.length - currentWord.current.length;
        }
        else if (typed.length < currentWord.current.length) {
            stats.current.missed += currentWord.current.length - typed.length;
        }
        currentWord.current = wordList.current.shift();
        wordList.current.push(getRandomWord());

        let allPrevTyped = prevWordList.current.reduce((acc, val) => acc += val.typedWord + " ", "");
        if (getTextWidth(allPrevTyped) >= 1600) {
            while (getTextWidth(allPrevTyped) >= 800) {
                prevWordList.current.shift();
                allPrevTyped = prevWordList.current.reduce((acc, val) => acc += val.typedWord + " ", "");
            }
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

        allPrevTyped = prevWordList.current.reduce((acc, val) => acc += val.typedWord + " ", "");
        const totalWidth = getTextWidth(allPrevTyped) + getTextWidth(typed);
        if (totalWidth > lineWidth) {
            setLine(prev => prev + 1);
        }
    }

    console.log("NEW RENDER");
    console.log("getPrevTextWidth(): ", getPrevTextWidth());
    console.log("getTextWidth(typed): ", getTextWidth(typed));
    const caretStyle = {
        top: `${6 +  line * 40}px`,   // 40px = line height
        left: `${9 + ((getPrevTextWidth() + getTextWidth(typed)) % lineWidth)}px`
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
