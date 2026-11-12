import {
  UPPER_CATEGORIES,
  LOWER_CATEGORIES,
  CATEGORY_DETAILS,
  UPPER_SECTION_BONUS_THRESHOLD,
  UPPER_SECTION_BONUS_POINTS,
} from "../logic/gameTypes";
import { calculateScore } from "../logic/scoreCalculator";

const ScoreTable = ({
  playerScores,
  aiScores,
  currentDice,
  rollsLeft,
  isAITurn,
  onSelectCategory,
}) => {
  const calculateUpperTotal = (scores) =>
    UPPER_CATEGORIES.reduce((sum, cat) => sum + (scores[cat] ?? 0), 0);

  const playerUpperTotal = calculateUpperTotal(playerScores);
  const aiUpperTotal = calculateUpperTotal(aiScores);

  const playerBonus =
    playerUpperTotal >= UPPER_SECTION_BONUS_THRESHOLD
      ? UPPER_SECTION_BONUS_POINTS
      : 0;
  const aiBonus =
    aiUpperTotal >= UPPER_SECTION_BONUS_THRESHOLD
      ? UPPER_SECTION_BONUS_POINTS
      : 0;

  const calculateGrandTotal = (scores, bonus) => {
    const categoriesTotal = Object.values(scores).reduce(
      (sum, val) => sum + (val ?? 0),
      0,
    );
    return categoriesTotal + bonus;
  };

  const playerTotal = calculateGrandTotal(playerScores, playerBonus);
  const aiTotal = calculateGrandTotal(aiScores, aiBonus);

  const renderCombinedRow = (upperKey, lowerKey) => {
    const renderSectionCells = (categoryKey) => {
      if (!categoryKey) {
        return (
          <>
            <td className="score-table__cell score-table__cell--category"></td>
            <td className="score-table__cell score-table__cell--score"></td>
            <td className="score-table__cell score-table__cell--score"></td>
          </>
        );
      }

      const meta = CATEGORY_DETAILS[categoryKey];
      const playerVal = playerScores[categoryKey];
      const aiVal = aiScores[categoryKey];

      const canSelect = !isAITurn && rollsLeft < 3 && playerVal == null;
      const previewScore = canSelect
        ? calculateScore(categoryKey, currentDice)
        : null;

      return (
        <>
          <td
            className={`score-table__cell score-table__cell--category ${
              canSelect ? "score-table__row--selectable" : ""
            }`}
            onClick={() => canSelect && onSelectCategory(categoryKey)}
          >
            <span className="score-table__icon">{meta.icon}</span>
            <div className="score-table__info">
              <span className="score-table__label">{meta.label}</span>
              <span className="score-table__desc">{meta.desc}</span>
            </div>
          </td>

          <td
            className="score-table__cell score-table__cell--score score-table__cell--player"
            onClick={() => canSelect && onSelectCategory(categoryKey)}
          >
            {playerVal !== null ? (
              <span className="score-table__value">{playerVal}</span>
            ) : previewScore !== null ? (
              <span className="score-table__preview">+{previewScore}</span>
            ) : (
              <span className="score-table__empty">-</span>
            )}
          </td>

          <td
            className="score-table__cell score-table__cell--score score-table__cell--ai"
            onClick={() => canSelect && onSelectCategory(categoryKey)}
          >
            {aiVal !== null ? (
              <span className="score-table__value">{aiVal}</span>
            ) : (
              <span className="score-table__empty">-</span>
            )}
          </td>
        </>
      );
    };

    return (
      <tr
        key={`${upperKey}-${lowerKey || "empty"}`}
        className="score-table__row"
      >
        {renderSectionCells(upperKey)}
        <td
          className="score-table__cell score-table__cell--divider"
          style={{
            width: "12px",
            padding: 0,
            background: "rgba(255,255,255,0.03)",
          }}
        ></td>
        {renderSectionCells(lowerKey)}
      </tr>
    );
  };

  const maxLength = Math.max(UPPER_CATEGORIES.length, LOWER_CATEGORIES.length);
  const rows = [];

  for (let i = 0; i < maxLength; i++) {
    rows.push({
      upper: UPPER_CATEGORIES[i] || null,
      lower: LOWER_CATEGORIES[i] || null,
    });
  }

  return (
    <div className="score-table">
      <table className="score-table__table">
        <thead>
          <tr className="score-table__header-row">
            <th className="score-table__th">Upper Section</th>
            <th className="score-table__th score-table__th--player">You</th>
            <th className="score-table__th score-table__th--ai"> AI</th>
            <th
              className="score-table__th score-table__th--divider"
              style={{ width: "12px", padding: 0 }}
            ></th>
            <th className="score-table__th">Lower Section</th>
            <th className="score-table__th score-table__th--player">You</th>
            <th className="score-table__th score-table__th--ai"> AI</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => renderCombinedRow(row.upper, row.lower))}

          <tr className="score-table__row score-table__row--subtotal">
            <td className="score-table__cell score-table__cell--category">
              <span className="score-table__label">
                Bonus (≥ {UPPER_SECTION_BONUS_THRESHOLD} Pts = +
                {UPPER_SECTION_BONUS_POINTS})
              </span>
            </td>
            <td className="score-table__cell score-table__cell--score">
              {playerBonus > 0
                ? `+${playerBonus}`
                : `${playerUpperTotal}/${UPPER_SECTION_BONUS_THRESHOLD}`}
            </td>
            <td className="score-table__cell score-table__cell--score">
              {aiBonus > 0
                ? `+${aiBonus}`
                : `${aiUpperTotal}/${UPPER_SECTION_BONUS_THRESHOLD}`}
            </td>

            <td
              className="score-table__cell score-table__cell--divider"
              style={{ padding: 0, background: "rgba(255,255,255,0.03)" }}
            ></td>

            <td className="score-table__cell score-table__cell--category">
              <span className="score-table__total-label">Grand Total</span>
            </td>
            <td className="score-table__cell score-table__cell--score score-table__cell--total-val">
              {playerTotal}
            </td>
            <td className="score-table__cell score-table__cell--score score-table__cell--total-val">
              {aiTotal}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ScoreTable;
