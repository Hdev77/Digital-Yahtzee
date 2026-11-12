import { calculateScore } from "./scoreCalculator";
import { CATEGORIES } from "./gameTypes";

const CATEGORY_ORDER = Object.values(CATEGORIES);

const CATEGORY_VALUE = {
  [CATEGORIES.ONES]: 1,
  [CATEGORIES.TWOS]: 2,
  [CATEGORIES.THREES]: 3,
  [CATEGORIES.FOURS]: 4,
  [CATEGORIES.FIVES]: 5,
  [CATEGORIES.SIXES]: 6,
};

const countDice = (dice) =>
  dice.reduce((counts, value) => {
    counts[value] = (counts[value] || 0) + 1;
    return counts;
  }, {});

const getAvailableCategories = (scoreSheet) =>
  CATEGORY_ORDER.filter((category) => scoreSheet[category] == null);

export const getAIKeepIndices = (dice, scoreSheet, rollsLeft) => {
  if (!Array.isArray(dice) || dice.length !== 5 || rollsLeft <= 0) return [];

  const availableCategories = getAvailableCategories(scoreSheet);
  if (availableCategories.length === 0) return [];

  const counts = countDice(dice);
  const sortedCounts = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const mostCommonValue = Number(sortedCounts[0]?.[0]);
  const mostCommonCount = counts[mostCommonValue] || 0;

  if (
    availableCategories.includes(CATEGORIES.DICE_PARTY) &&
    mostCommonCount >= 2
  ) {
    return dice.reduce((indices, val, idx) => {
      if (val === mostCommonValue) indices.push(idx);
      return indices;
    }, []);
  }

  const needsStraight =
    availableCategories.includes(CATEGORIES.LARGE_STRAIGHT) ||
    availableCategories.includes(CATEGORIES.SMALL_STRAIGHT);
  if (needsStraight) {
    const uniqueValues = [...new Set(dice)].sort((a, b) => a - b);
    let bestRun = [];
    let currentRun = [];
    for (let i = 0; i < uniqueValues.length; i++) {
      if (i === 0 || uniqueValues[i] === uniqueValues[i - 1] + 1) {
        currentRun.push(uniqueValues[i]);
      } else {
        currentRun = [uniqueValues[i]];
      }
      if (currentRun.length > bestRun.length) bestRun = [...currentRun];
    }
    const threshold = availableCategories.includes(CATEGORIES.LARGE_STRAIGHT)
      ? 4
      : 3;
    if (bestRun.length >= threshold) {
      return dice.reduce((indices, val, idx) => {
        if (bestRun.includes(val)) indices.push(idx);
        return indices;
      }, []);
    }
  }

  for (const [cat, val] of Object.entries(CATEGORY_VALUE)) {
    if (
      availableCategories.includes(cat) &&
      val >= 4 &&
      (counts[val] || 0) >= 2
    ) {
      return dice.reduce((indices, d, idx) => {
        if (d === val) indices.push(idx);
        return indices;
      }, []);
    }
  }

  return dice.reduce((indices, val, idx) => {
    if (val >= 5) indices.push(idx);
    return indices;
  }, []);
};

export const getAICategoryChoice = (dice, scoreSheet) => {
  const availableCategories = getAvailableCategories(scoreSheet);
  if (!dice || !availableCategories.length) return null;

  const scoredCategories = availableCategories.map((category) => ({
    category,
    score: calculateScore(category, dice),
  }));

  const positiveScores = scoredCategories.filter((c) => c.score > 0);
  if (positiveScores.length > 0) {
    return positiveScores.reduce((best, curr) =>
      curr.score > best.score ? curr : best,
    ).category;
  }

  const sacrificeOrder = [
    CATEGORIES.ONES,
    CATEGORIES.TWOS,
    CATEGORIES.DICE_PARTY,
    CATEGORIES.FOUR_OF_A_KIND,
    CATEGORIES.THREES,
    CATEGORIES.FOURS,
  ];

  return (
    sacrificeOrder.find((cat) => availableCategories.includes(cat)) ||
    availableCategories[0]
  );
};
