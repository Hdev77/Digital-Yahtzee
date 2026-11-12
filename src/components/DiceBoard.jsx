const DiceFace = ({ value }) => {
  const renderPips = () => {
    switch (value) {
      case 1:
        return <span className="dice-board__pip dice-board__pip--center" />;
      case 2:
        return (
          <>
            <span className="dice-board__pip dice-board__pip--top-right" />
            <span className="dice-board__pip dice-board__pip--bottom-left" />
          </>
        );
      case 3:
        return (
          <>
            <span className="dice-board__pip dice-board__pip--top-right" />
            <span className="dice-board__pip dice-board__pip--center" />
            <span className="dice-board__pip dice-board__pip--bottom-left" />
          </>
        );
      case 4:
        return (
          <>
            <span className="dice-board__pip dice-board__pip--top-left" />
            <span className="dice-board__pip dice-board__pip--top-right" />
            <span className="dice-board__pip dice-board__pip--bottom-left" />
            <span className="dice-board__pip dice-board__pip--bottom-right" />
          </>
        );
      case 5:
        return (
          <>
            <span className="dice-board__pip dice-board__pip--top-left" />
            <span className="dice-board__pip dice-board__pip--top-right" />
            <span className="dice-board__pip dice-board__pip--center" />
            <span className="dice-board__pip dice-board__pip--bottom-left" />
            <span className="dice-board__pip dice-board__pip--bottom-right" />
          </>
        );
      case 6:
        return (
          <>
            <span className="dice-board__pip dice-board__pip--top-left" />
            <span className="dice-board__pip dice-board__pip--top-right" />
            <span className="dice-board__pip dice-board__pip--middle-left" />
            <span className="dice-board__pip dice-board__pip--middle-right" />
            <span className="dice-board__pip dice-board__pip--bottom-left" />
            <span className="dice-board__pip dice-board__pip--bottom-right" />
          </>
        );
      default:
        return null;
    }
  };

  return <div className="dice-board__face">{renderPips()}</div>;
};

const DiceBoard = ({
  dice,
  heldDice,
  onToggleHold,
  onRoll,
  rollsLeft,
  isRolling,
  isDisabled,
}) => {
  return (
    <div className="dice-board">
      <div className="dice-board__grid">
        {dice.map((value, index) => {
          const isHeld = heldDice[index];
          return (
            <div
              key={index}
              className={`dice-board__die-wrapper ${
                isHeld ? "dice-board__die-wrapper--held" : ""
              }`}
              onClick={() => !isDisabled && !isRolling && onToggleHold(index)}
            >
              <div
                className={`dice-board__die ${
                  isRolling && !isHeld ? "dice-board__die--rolling" : ""
                }`}
              >
                <DiceFace value={value} />
              </div>
              <span className="dice-board__hold-badge">
                {isHeld ? "HELD" : "KEEP"}
              </span>
            </div>
          );
        })}
      </div>

      <div className="dice-board__actions">
        <button
          className="dice-board__roll-btn"
          onClick={onRoll}
          disabled={isDisabled || isRolling || rollsLeft === 0}
        >
          {isRolling
            ? "Rolling..."
            : rollsLeft === 3
              ? "Roll Dice"
              : `Roll Again (${rollsLeft} left)`}
        </button>
      </div>
    </div>
  );
};

export default DiceBoard;
