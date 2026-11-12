import { PLAYERS } from "../logic/gameTypes";

const GameOverModal = ({
  isOpen,
  winner,
  playerTotal = 0,
  aiTotal = 0,
  onPlayAgain,
}) => {
  if (!isOpen) return null;

  const result = {
    [PLAYERS.HUMAN]: {
      title: "You win!",
      message: "Great game. You outscored AI.",
      className: "game-over-modal__content--win",
      icon: "🏆",
    },
    [PLAYERS.AI]: {
      title: "AI wins",
      message: "Good game. Ready for a rematch?",
      className: "game-over-modal__content--loss",
      icon: "🤖",
    },
    tie: {
      title: "It's a tie!",
      message: "You and AI finished with the same score.",
      className: "game-over-modal__content--tie",
      icon: "🤝",
    },
  }[winner] ?? {
    title: "Game over",
    message: "The game has finished.",
    className: "",
    icon: "🎲",
  };

  return (
    <div
      className="game-over-modal"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          // Close
        }
      }}
    >
      <section
        className={`game-over-modal__content ${result.className}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="game-over-title"
      >
        <div className="game-over-modal__icon" aria-hidden="true">
          {result.icon}
        </div>

        <p className="game-over-modal__eyebrow">FINAL SCORE</p>
        <h2 className="game-over-modal__title" id="game-over-title">
          {result.title}
        </h2>
        <p className="game-over-modal__message">{result.message}</p>

        <div className="game-over-modal__scores">
          <div className="game-over-modal__score">
            <span className="game-over-modal__score-label">You</span>
            <strong>{playerTotal}</strong>
          </div>

          <span className="game-over-modal__score-divider" aria-hidden="true">
            :
          </span>

          <div className="game-over-modal__score">
            <span className="game-over-modal__score-label">AI</span>
            <strong>{aiTotal}</strong>
          </div>
        </div>

        <button
          className="game-over-modal__button"
          type="button"
          onClick={onPlayAgain}
          autoFocus
        >
          Play again
        </button>
      </section>
    </div>
  );
};

export default GameOverModal;
