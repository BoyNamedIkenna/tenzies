import { useState } from "react";
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6 } from "lucide-react";

export default function Dice(props) {
    const [isRolling, setIsRolling] = useState(false);
    const styles = {
        backgroundColor: "#9333ea"
    }
    const iconColor = props.isHeld ? "white" : "black"; // Change color based on isHeld
    const dieFace = [
        <Dice1 key="die" size={42} color={iconColor} />,
        <Dice2 key="die" size={42} color={iconColor} />,
        <Dice3 key="die" size={42} color={iconColor} />,
        <Dice4 key="die" size={42} color={iconColor} />,
        <Dice5 key="die" size={42} color={iconColor} />,
        <Dice6 key="die" size={42} color={iconColor} />
    ];    
    const value = props.value
      
    const handleClick = () => {
    if (!props.isHeld) {
      setIsRolling(true);
      setTimeout(() => setIsRolling(false), 300); // match animation duration
    }

    props.holdDice(props.boxId);
    props.runOnce();
  };

    const classNames = ["eachDie",isRolling ? "rolling" : ""].join(" ");

    return (
        <div
            className={classNames}
            id={props.boxId}
            onClick={handleClick}
            style={props.isHeld ? styles : null}
        >
            {dieFace [value-1]}
        </div>
    )
}
