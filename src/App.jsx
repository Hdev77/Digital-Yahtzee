import { useCallback, useEffect, useState } from "react";

import DiceBoard from "./components/DiceBoard";
import GameHeader from "./components/GameHeader";
import GameOverModal from "./components/GameOverModal";
import ScoreTable from "./components/ScoreTable";
import {
  DICE_COUNT,
  MAX_ROLLS,
  PLAYERS,
  UPPER_CATEGORIES,
  UPPER_SECTION_BONUS_POINTS,
  UPPER_SECTION_BONUS_THRESHOLD,
  createInitialScoreSheet,
} from "./logic/gameTypes";

import { getAICategoryChoice, getAIKeepIndices } from "./logic/aiPlatoEngine";

import { calculateScore } from "./logic/scoreCalculator";

const createEmptyDice = () => Array(DICE_COUNT).fill(1);

const rollValue = () => Math.floor(Math.random() * 6) + 1;

const createRandomDice = () =>
  Array.from({ length: DICE_COUNT }, () => rollValue());

const calculateTotalScore = (scores) => {
  const categoryTotal = Object.values(scores).reduce(
    (total, score) => total + (score ?? 0),
    0,
  );

  const upperTotal = UPPER_CATEGORIES.reduce(
    (total, category) => total + (scores[category] ?? 0),
    0,
  );

  const bonus =
    upperTotal >= UPPER_SECTION_BONUS_THRESHOLD
      ? UPPER_SECTION_BONUS_POINTS
      : 0;

  return categoryTotal + bonus;
};

const areAllCategoriesFilled = (scores) =>
  Object.values(scores).every((score) => score !== null);

const App = () => {
  const [currentPlayer, setCurrentPlayer] = useState(PLAYERS.HUMAN);

  const [dice, setDice] = useState(createEmptyDice);
  const [heldDice, setHeldDice] = useState(() => Array(DICE_COUNT).fill(false));

  const [rollsLeft, setRollsLeft] = useState(MAX_ROLLS);
  const [isRolling, setIsRolling] = useState(false);

  const [playerScores, setPlayerScores] = useState(createInitialScoreSheet);
  const [aiScores, setAiScores] = useState(createInitialScoreSheet);

  const [isGameOver, setIsGameOver] = useState(false);
  const [winner, setWinner] = useState(null);

  const isHumanTurn = currentPlayer === PLAYERS.HUMAN;

  const switchTurn = useCallback((nextPlayer) => {
    setCurrentPlayer(nextPlayer);
    setRollsLeft(MAX_ROLLS);
    setHeldDice(Array(DICE_COUNT).fill(false));
    setDice(createEmptyDice());
    setIsRolling(false);
  }, []);

  const finishGameIfNeeded = useCallback((nextPlayerScores, nextAiScores) => {
    const playerFinished = areAllCategoriesFilled(nextPlayerScores);
    const aiFinished = areAllCategoriesFilled(nextAiScores);

    if (!playerFinished || !aiFinished) {
      return false;
    }

    const playerTotal = calculateTotalScore(nextPlayerScores);
    const aiTotal = calculateTotalScore(nextAiScores);

    if (playerTotal > aiTotal) {
      setWinner(PLAYERS.HUMAN);
    } else if (aiTotal > playerTotal) {
      setWinner(PLAYERS.AI);
    } else {
      setWinner("tie");
    }

    setIsGameOver(true);
    return true;
  }, []);

  const handleRollDice = useCallback(() => {
    if (!isHumanTurn || isRolling || isGameOver || rollsLeft <= 0) {
      return;
    }

    setIsRolling(true);

    window.setTimeout(() => {
      setDice((previousDice) =>
        previousDice.map((value, index) =>
          heldDice[index] ? value : rollValue(),
        ),
      );

      setRollsLeft((previousRolls) => previousRolls - 1);
      setIsRolling(false);
    }, 500);
  }, [heldDice, isGameOver, isHumanTurn, isRolling, rollsLeft]);

  const handleToggleHold = useCallback(
    (index) => {
      if (!isHumanTurn || isRolling || isGameOver || rollsLeft === MAX_ROLLS) {
        return;
      }

      setHeldDice((previousHeldDice) =>
        previousHeldDice.map((isHeld, diceIndex) =>
          diceIndex === index ? !isHeld : isHeld,
        ),
      );
    },
    [isGameOver, isHumanTurn, isRolling, rollsLeft],
  );

  const handleSelectCategory = useCallback(
    (categoryKey) => {
      if (
        !isHumanTurn ||
        isRolling ||
        isGameOver ||
        rollsLeft === MAX_ROLLS ||
        playerScores[categoryKey] !== null
      ) {
        return;
      }

      const score = calculateScore(categoryKey, dice);

      const updatedPlayerScores = {
        ...playerScores,
        [categoryKey]: score,
      };

      setPlayerScores(updatedPlayerScores);

      const gameFinished = finishGameIfNeeded(updatedPlayerScores, aiScores);

      if (!gameFinished) {
        switchTurn(PLAYERS.AI);
      }
    },
    [
      aiScores,
      dice,
      finishGameIfNeeded,
      isGameOver,
      isHumanTurn,
      isRolling,
      playerScores,
      rollsLeft,
      switchTurn,
    ],
  );

  useEffect(() => {
    if (currentPlayer !== PLAYERS.AI || isGameOver || isRolling) {
      return undefined;
    }

    let timerId;

    if (rollsLeft === MAX_ROLLS) {
      timerId = window.setTimeout(() => {
        setIsRolling(true);

        window.setTimeout(() => {
          setDice(createRandomDice());
          setRollsLeft((previousRolls) => previousRolls - 1);
          setIsRolling(false);
        }, 500);
      }, 700);

      return () => window.clearTimeout(timerId);
    }

    if (rollsLeft > 0 && rollsLeft < MAX_ROLLS) {
      timerId = window.setTimeout(() => {
        const indicesToKeep = getAIKeepIndices(dice, aiScores, rollsLeft);

        if (indicesToKeep.length === DICE_COUNT) {
          const chosenCategory = getAICategoryChoice(dice, aiScores);

          const score = calculateScore(chosenCategory, dice);

          const updatedAiScores = {
            ...aiScores,
            [chosenCategory]: score,
          };

          setAiScores(updatedAiScores);

          const gameFinished = finishGameIfNeeded(
            playerScores,
            updatedAiScores,
          );

          if (!gameFinished) {
            switchTurn(PLAYERS.HUMAN);
          }

          return;
        }

        const nextHeldDice = Array(DICE_COUNT).fill(false);

        indicesToKeep.forEach((index) => {
          nextHeldDice[index] = true;
        });

        setHeldDice(nextHeldDice);
        setIsRolling(true);

        window.setTimeout(() => {
          setDice((previousDice) =>
            previousDice.map((value, index) =>
              nextHeldDice[index] ? value : rollValue(),
            ),
          );

          setRollsLeft((previousRolls) => previousRolls - 1);
          setIsRolling(false);
        }, 500);
      }, 900);

      return () => window.clearTimeout(timerId);
    }

    if (rollsLeft === 0) {
      timerId = window.setTimeout(() => {
        const chosenCategory = getAICategoryChoice(dice, aiScores);

        const score = calculateScore(chosenCategory, dice);

        const updatedAiScores = {
          ...aiScores,
          [chosenCategory]: score,
        };

        setAiScores(updatedAiScores);

        const gameFinished = finishGameIfNeeded(playerScores, updatedAiScores);

        if (!gameFinished) {
          switchTurn(PLAYERS.HUMAN);
        }
      }, 800);

      return () => window.clearTimeout(timerId);
    }

    return undefined;
  }, [
    aiScores,
    currentPlayer,
    dice,
    finishGameIfNeeded,
    isGameOver,
    isRolling,
    playerScores,
    rollsLeft,
    switchTurn,
  ]);

  const handlePlayAgain = useCallback(() => {
    setCurrentPlayer(PLAYERS.HUMAN);
    setDice(createEmptyDice());
    setHeldDice(Array(DICE_COUNT).fill(false));
    setRollsLeft(MAX_ROLLS);
    setIsRolling(false);

    setPlayerScores(createInitialScoreSheet());
    setAiScores(createInitialScoreSheet());

    setIsGameOver(false);
    setWinner(null);
  }, []);

  const playerTotal = calculateTotalScore(playerScores);
  const aiTotal = calculateTotalScore(aiScores);

  return (
    <div className="app-container">
      <GameHeader
        currentPlayer={currentPlayer}
        rollsLeft={rollsLeft}
        isRolling={isRolling}
      />

      <main className="app-container__main">
        <DiceBoard
          dice={dice}
          heldDice={heldDice}
          onToggleHold={handleToggleHold}
          onRoll={handleRollDice}
          rollsLeft={rollsLeft}
          isRolling={isRolling}
          isDisabled={!isHumanTurn || isGameOver}
        />

        <ScoreTable
          playerScores={playerScores}
          aiScores={aiScores}
          currentDice={dice}
          rollsLeft={rollsLeft}
          isAITurn={!isHumanTurn}
          onSelectCategory={handleSelectCategory}
        />
      </main>

      <GameOverModal
        isOpen={isGameOver}
        winner={winner}
        playerTotal={playerTotal}
        aiTotal={aiTotal}
        onPlayAgain={handlePlayAgain}
      />
    </div>
  );
};

export default App;
