import React from "react";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";
import Dice from "./components/Dice";

export default function App() {
 

  const [dice, setDice] = React.useState(allNewDice());
  const [tenzies, setTenzies] = React.useState(false);
  const [seconds, setSeconds] = React.useState(0);
  const [minutes, setMinutes] = React.useState(0);
  const [hours, setHours] = React.useState(0);
  const [time, setTime] = React.useState(`0${hours}:0${minutes}:0${seconds}`);
  const [hasRunOnce, setHasRunOnce] = React.useState(false);
  const [count,setCount] = React.useState(0)
  const highScore = localStorage.getItem("highScore") || "00:00:00"

  function runOnce() {
    if (!hasRunOnce) {
      setHasRunOnce(true);
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
      setSeconds(0);
      setMinutes(0);
      setHours(0);
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

  React.useEffect(() => {
    if (hasRunOnce) {
      const interval = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [hasRunOnce]);

  React.useEffect(() => {
    if (seconds === 60) {
      setMinutes((prevMinutes) => prevMinutes + 1);
      setSeconds(0);
    }
    if (minutes === 60) {
      setHours((prevHours) => prevHours + 1);
      setMinutes(0);
    }
    if (seconds < 10 && minutes < 10 && hours < 10) {
      setTime(`0${hours}:0${minutes}:0${seconds}`);
    } else if (seconds >= 10 && minutes < 10 && hours < 10) {
      setTime(`0${hours}:0${minutes}:${seconds}`);
    } else if (seconds >= 10 && minutes >= 10 && hours < 10) {
      setTime(`0${hours}:${minutes}:${seconds}`);
    } else {
      setTime(`${hours}:${minutes}:${seconds}`);
    }
  }, [seconds, minutes, hours]);

  React.useEffect(() => {
    const same = dice.every((die) => die.value === dice[0].value);
    const held = dice.every((die) => die.isHeld);

    if (same && held) {
      setTenzies(true);
      setHasRunOnce(false);
      if(time < highScore){
        localStorage.setItem("highScore",time)
      }
    }
  }, [dice, time,highScore]);

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
  console.log(highScore)
  return (
    <main>
      {tenzies && <Confetti />}
      <h1>Tenzies</h1>
      <p>
        Roll until all dice are the same. Click each dice to freeze it at its
        current value between rolls.
      </p>
      <h2>Time Taken: {time}</h2>
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
