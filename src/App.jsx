import './App.css'
import Word from './components/Word.jsx'
import { useState } from 'react'

export default function App() {
  /**
   * TODO: 
   * make an input where the words to type exist
   * make a keyboard where users can click to type, 
   *  each button lights up when their key is pressed
   * make a score keeper
   */

  /**
   * for the input: 
   * 
   */

  const [typed, setTyped] = useState([]);

  function handleInput(event) {
    setTyped(event.target.value);
    console.log(typed);
  }

  return (
    <>
      <header>
        <h1>FunkeyType</h1>
        <p>MonkeyType but with more funk</p>
      </header>

      <main>
        <input 
          type="text"

          onChange={handleInput}
        />
        <div>
          {typed.toString()}
        </div>
      </main>
    </>
  )
}