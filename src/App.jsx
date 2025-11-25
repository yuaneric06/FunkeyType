import './App.css'
import TypingTest from './components/TypingTest.jsx'

export default function App() {
  /**
   * TODO: 
   * make a keyboard where users can click to type, 
   *  each button lights up when their key is pressed
   * make a score keeper
   */

  /**
   * for the input: 
   * make an array of 100 words queued to be rendered
   */

  return (
    <>
      <header>
        <h1>FunkeyType</h1>
        <p>MonkeyType but with more funk</p>
      </header>

      <main>
        <TypingTest />
      </main>
    </>
  )
}