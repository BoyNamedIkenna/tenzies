import {useState,useEffect} from "react";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";
import Dice from "./components/Dice";

export default function App() {

  const [dice, setDice] = useState(allNewDice());
  const [tenzies, setTenzies] = useState(false);
  const [time, setTime] =  useState(0);
  const [hasRunOnce, setHasRunOnce] =  useState(false);
  const [count,setCount] =  useState(0)
  const highScore = localStorage.getItem("highScore") || "00:00:00"
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = time % 60;

  function runOnce() {
    if (!hasRunOnce && !tenzies) {
      setHasRunOnce(true);
    }
    else if(tenzies && hasRunOnce){
      setTime(0)
      setHasRunOnce(false)
    }
  }

  function allNewDice() {
    const newDice = [];
    for (let i = 0; i < 10; i++) {
      newDice[i] = {
        id: nanoid(),
        value: Math.ceil(Math.random() * 6),
        isHeld: false,
      };
    }
    return newDice;
  }

  function rollDice() {
    if (!tenzies) {
      setDice((oldDice) =>
        oldDice.map((die) =>
          die.isHeld
            ? die
            : {
                id: nanoid(),
                value: Math.ceil(Math.random() * 6),
                isHeld: false,
              }
        )
      );
      setCount(prevCount => prevCount+1)
    } else {
      setTenzies(false);
      setDice(allNewDice());
      setCount(0)
    }
  }

  function holdDice(id) {
    setDice((oldDice) =>
      oldDice.map((die) => {
        if (die.id === id) {
          return { ...die, isHeld: !die.isHeld };
        } else {
          return die;
        }
      })
    );
  }

   useEffect(() => {
    let interval
    if (hasRunOnce && !tenzies) {
       interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
    
  }, [hasRunOnce,tenzies]);


   useEffect(() => {
    const same = dice.every((die) => die.value === dice[0].value);
    const held = dice.every((die) => die.isHeld);

    if (same && held) {
      setTenzies(true);
      if(time < highScore){
        localStorage.setItem("highScore",time)
      }
    }
  }, [dice, time,highScore]);

  const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;


  const diceGrid = dice.map((die) => {
    return (
      <Dice
        value={die.value}
        isHeld={die.isHeld}
        key={die.id}
        boxId={die.id}
        holdDice={holdDice}
        runOnce={runOnce}
      />
    );
  });

  return (
    <main>
      {tenzies && <Confetti />}
      <h1>Tenzies</h1>
      <p>
        Roll until all dice are the same. Click each dice to freeze it at its
        current value between rolls.
      </p>
      <h2>{formattedTime}</h2>
      <h2>High Score: {highScore} </h2>
      <h2>Dice Rolls: {count}</h2>
      <div className="diceElements">{diceGrid}</div>
      <button
        onClick={() => {
          runOnce();
          rollDice();
        }}
      >
        {tenzies ? "New Game" : "Roll"}
      </button>
    </main>
  );
}
