import { PLAYERS } from "../logic/gameTypes";

const GameHeader = ({ currentPlayer, rollsLeft, isRolling = false }) => {
  const isHumanTurn = currentPlayer === PLAYERS.HUMAN;

  return (
    <header className="game-header">
      <div className="game-header__title-group">
        <span className="game-header__eyebrow">DICE PARTY</span>
        <h1 className="game-header__title">Roll the dice. Make your move.</h1>
      </div>

      <div
        className={`game-header__status ${
          isHumanTurn ? "game-header__status--human" : "game-header__status--ai"
        }`}
        aria-live="polite"
      >
        <span className="game-header__status-dot" />
        <span className="game-header__status-text">
          {isRolling
            ? "Rolling dice..."
            : isHumanTurn
              ? "Your turn"
              : "AI's turn"}
        </span>
      </div>

      <div
        className="game-header__rolls"
        aria-label={`${rollsLeft} rolls left`}
      >
        <span className="game-header__rolls-label">Rolls left</span>
        <span className="game-header__rolls-value">{rollsLeft}</span>
        <span className="game-header__rolls-total">/ 3</span>
      </div>
    </header>
  );
};

export default GameHeader;
