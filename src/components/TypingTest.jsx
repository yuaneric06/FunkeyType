import { useState, useEffect, useRef } from 'react'
import { getRandomWord } from '../utils.js'
import Word from './Word.jsx'
import './TypingTest.css'

export default function TypingTest() {
    const [typed, setTyped] = useState("");
    const [line, setLine] = useState(1);

    // holds the words we already typed
    const prevWordList = useRef(Array(3).fill().map(() => []));
    // holds the words we need to type
    const wordLists = useRef([]);
    const fieldRef = useRef(null);
    const bodyWidth = document.body.clientWidth;
    const lineWidth = bodyWidth * 0.7;

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
            wordLists.current.push(lineWords);
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

    const prevTypedOnLine = prevWordList.current[line] ? prevWordList.current[line]
        .map(val => {
            let temp = val.typedWord;
            for (let idx = temp.length; idx < val.text.length; idx++) {
                temp += val.text[idx];
            }
            return temp;
        })
        .join("") : 0;

    const caretStyle = {
        top: `${6 + line * 44}px`,   // 40px = line height
        left: `${9 + getTextWidth(prevTypedOnLine) + getTextWidth(typed) + 20 * currentWordIdx.current}px`
    };

    /**
     * render each line individually, when we finish one line, move the next
     */
    const lines = [];
    for (let lineIdx = 0; lineIdx < wordLists.current.length; lineIdx++) {
        const temp = [];
        let idx = 0;
        for (idx; idx < prevWordList.current[lineIdx].length; idx++) {
            const { typedWord, text } = prevWordList.current[lineIdx][idx];
            temp.push(
                <Word text={text} typedWord={typedWord} key={getKey()} />
            );
        }
        if (lineIdx == line) { // render current word
            temp.push(
                <Word text={wordLists.current[lineIdx][idx]} typedWord={typed} />
            );
            idx++;
        }
        for (idx; idx < wordLists.current[lineIdx].length; idx++) {
            const text = wordLists.current[lineIdx][idx];
            temp.push(
                <Word text={text} key={getKey()} />
            );
        }
        lines.push(temp);
    }

    // console.log(lines);
    // console.log(wordLists.current);
    const lineElements = lines.map(val => {
        return <div className="line" key={getKey()}>{val}</div>
    })

    return (
        <>
            <section ref={fieldRef} className="typing-field" style={ { width: `${lineWidth}px` }}>
                <div style={caretStyle} id="caret"></div>
                <input
                    type="text"
                    onChange={handleInput}
                />
                {/* <div>
                    {typed.toString()}
                </div> */}
                {lineElements}


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
