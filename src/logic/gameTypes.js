export const CATEGORIES = Object.freeze({
  ONES: "ones",
  TWOS: "twos",
  THREES: "threes",
  FOURS: "fours",
  FIVES: "fives",
  SIXES: "sixes",

  THREE_OF_A_KIND: "threeOfAKind",
  FOUR_OF_A_KIND: "fourOfAKind",
  FULL_HOUSE: "fullHouse",
  SMALL_STRAIGHT: "smallStraight",
  LARGE_STRAIGHT: "largeStraight",
  DICE_PARTY: "diceParty",
  CHANCE: "chance",
});

export const CATEGORY_DETAILS = Object.freeze({
  [CATEGORIES.ONES]: { label: "Aces (Ones)", icon: "⚀", desc: "Sum of all 1s" },
  [CATEGORIES.TWOS]: { label: "Twos", icon: "⚁", desc: "Sum of all 2s" },
  [CATEGORIES.THREES]: { label: "Threes", icon: "⚂", desc: "Sum of all 3s" },
  [CATEGORIES.FOURS]: { label: "Fours", icon: "⚃", desc: "Sum of all 4s" },
  [CATEGORIES.FIVES]: { label: "Fives", icon: "⚄", desc: "Sum of all 5s" },
  [CATEGORIES.SIXES]: { label: "Sixes", icon: "⚅", desc: "Sum of all 6s" },
  [CATEGORIES.THREE_OF_A_KIND]: {
    label: "3 of a Kind",
    icon: "🎲",
    desc: "At least 3 same / Sum all",
  },
  [CATEGORIES.FOUR_OF_A_KIND]: {
    label: "4 of a Kind",
    icon: "🎲",
    desc: "At least 4 same / Sum all",
  },
  [CATEGORIES.FULL_HOUSE]: {
    label: "Full House",
    icon: "🏠",
    desc: "3 same + 2 same (25 pts)",
  },
  [CATEGORIES.SMALL_STRAIGHT]: {
    label: "Small Straight",
    icon: "📏",
    desc: "Sequence of 4 (30 pts)",
  },
  [CATEGORIES.LARGE_STRAIGHT]: {
    label: "Large Straight",
    icon: "📐",
    desc: "Sequence of 5 (40 pts)",
  },
  [CATEGORIES.DICE_PARTY]: {
    label: "Dice Party",
    icon: "🎉",
    desc: "5 of a kind (50 pts)",
  },
  [CATEGORIES.CHANCE]: { label: "Chance", icon: "❓", desc: "Sum of all dice" },
});

export const UPPER_CATEGORIES = Object.freeze([
  CATEGORIES.ONES,
  CATEGORIES.TWOS,
  CATEGORIES.THREES,
  CATEGORIES.FOURS,
  CATEGORIES.FIVES,
  CATEGORIES.SIXES,
]);

export const LOWER_CATEGORIES = Object.freeze([
  CATEGORIES.THREE_OF_A_KIND,
  CATEGORIES.FOUR_OF_A_KIND,
  CATEGORIES.FULL_HOUSE,
  CATEGORIES.SMALL_STRAIGHT,
  CATEGORIES.LARGE_STRAIGHT,
  CATEGORIES.DICE_PARTY,
  CATEGORIES.CHANCE,
]);

export const PLAYERS = Object.freeze({
  HUMAN: "human",
  AI: "ai",
});

export const MAX_ROLLS = 3;
export const DICE_COUNT = 5;
export const UPPER_SECTION_BONUS_THRESHOLD = 63;
export const UPPER_SECTION_BONUS_POINTS = 35;

export const createInitialScoreSheet = () =>
  Object.values(CATEGORIES).reduce((acc, cat) => {
    acc[cat] = null;
    return acc;
  }, {});
