export default function Dice(props) {
    const styles = {
        backgroundColor: "#59E391"
    }

    return (
        <div
            className="eachDie"
            id={props.boxId}
            onClick={() => {props.holdDice(props.boxId); props.runOnce()}}
            style={props.isHeld ? styles : null}
        >
            {props.value}
        </div>
    )
}
