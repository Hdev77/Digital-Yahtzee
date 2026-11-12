import { CATEGORIES } from "./gameTypes";

const getCounts = (dice) => {
  const counts = {};
  dice.forEach((d) => {
    counts[d] = (counts[d] || 0) + 1;
  });
  return counts;
};

const getSum = (dice) => dice.reduce((acc, val) => acc + val, 0);

export const calculateScore = (category, dice) => {
  if (!dice || dice.length !== 5) return 0;
  const counts = getCounts(dice);
  const values = Object.values(counts);

  switch (category) {
    case CATEGORIES.ONES:
      return (counts[1] || 0) * 1;
    case CATEGORIES.TWOS:
      return (counts[2] || 0) * 2;
    case CATEGORIES.THREES:
      return (counts[3] || 0) * 3;
    case CATEGORIES.FOURS:
      return (counts[4] || 0) * 4;
    case CATEGORIES.FIVES:
      return (counts[5] || 0) * 5;
    case CATEGORIES.SIXES:
      return (counts[6] || 0) * 6;

    case CATEGORIES.THREE_OF_A_KIND:
      return values.some((count) => count >= 3) ? getSum(dice) : 0;

    case CATEGORIES.FOUR_OF_A_KIND:
      return values.some((count) => count >= 4) ? getSum(dice) : 0;

    case CATEGORIES.FULL_HOUSE:
      return (values.includes(3) && values.includes(2)) || values.includes(5)
        ? 25
        : 0;

    case CATEGORIES.SMALL_STRAIGHT: {
      const uniqueSorted = [...new Set(dice)].sort((a, b) => a - b).join("");
      return /1234|2345|3456/.test(uniqueSorted) ? 30 : 0;
    }

    case CATEGORIES.LARGE_STRAIGHT: {
      const uniqueSorted = [...new Set(dice)].sort((a, b) => a - b).join("");
      return /12345|23456/.test(uniqueSorted) ? 40 : 0;
    }

    case CATEGORIES.DICE_PARTY:
      return values.includes(5) ? 50 : 0;

    case CATEGORIES.CHANCE:
      return getSum(dice);

    default:
      return 0;
  }
};
