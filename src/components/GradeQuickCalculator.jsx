import { Calculator, Minus, Plus } from "lucide-react";
import { useMemo, useState } from "react";

export function GradeQuickCalculator() {
  const [marks, setMarks] = useState([80, 88, 92]);

  const average = useMemo(() => {
    const sum = marks.reduce((total, mark) => total + Number(mark || 0), 0);
    return Math.round((sum / marks.length) * 10) / 10;
  }, [marks]);

  function updateMark(index, value) {
    setMarks((current) => current.map((mark, currentIndex) => (currentIndex === index ? Number(value) : mark)));
  }

  function addMark() {
    setMarks((current) => [...current, 85]);
  }

  function removeMark(index) {
    setMarks((current) => current.filter((_, currentIndex) => currentIndex !== index));
  }

  return (
    <section className="calculator-panel">
      <div className="section-heading compact-heading">
        <Calculator size={22} />
        <div>
          <h2>Калькулятор середнього балу</h2>
        </div>
      </div>
      <div className="mark-list">
        {marks.map((mark, index) => (
          <label key={`${index}-${marks.length}`} className="mark-input">
            <span>Оцінка {index + 1}</span>
            <input min="0" max="100" type="number" value={mark} onChange={(event) => updateMark(index, event.target.value)} />
            <button type="button" className="icon-button" onClick={() => removeMark(index)} disabled={marks.length <= 1} title="Прибрати оцінку">
              <Minus size={16} />
            </button>
          </label>
        ))}
      </div>
      <div className="calculator-footer">
        <button type="button" className="button secondary" onClick={addMark}>
          <Plus size={16} />
          Додати оцінку
        </button>
        <strong>Середній бал: {average}</strong>
      </div>
    </section>
  );
}
