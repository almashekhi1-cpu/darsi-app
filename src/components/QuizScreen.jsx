import { useState } from 'react'

const LETTERS = ['أ', 'ب', 'ج', 'د']

export default function QuizScreen({ questions, onFinish }) {
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState(null)
  const [answers, setAnswers] = useState([])

  const question = questions[current]
  const total = questions.length
  const progress = ((current) / total) * 100

  function handleSelect(optionIndex) {
    if (selected !== null) return
    setSelected(optionIndex)
  }

  function handleNext() {
    const isCorrect = selected === question.correct
    const newAnswers = [...answers, { correct: isCorrect, selected, question }]

    if (current + 1 < total) {
      setAnswers(newAnswers)
      setCurrent(c => c + 1)
      setSelected(null)
    } else {
      onFinish(newAnswers)
    }
  }

  function getOptionClass(index) {
    if (selected === null) return ''
    if (index === question.correct) {
      return selected === index ? 'selected-correct' : 'show-correct'
    }
    if (index === selected) return 'selected-wrong'
    return ''
  }

  return (
    <div className="screen quiz-screen">
      {/* Header */}
      <div className="quiz-header">
        <div className="quiz-type-badge">
          <span>🧠</span> اختيار من متعدد
        </div>
        <div className="quiz-progress-row">
          <span className="quiz-progress-label">السؤال {current + 1} من {total}</span>
          <span className="quiz-progress-label">{Math.round(((current + (selected !== null ? 1 : 0)) / total) * 100)}%</span>
        </div>
        <div className="quiz-progress-bar">
          <div
            className="quiz-progress-fill"
            style={{ width: `${((current + (selected !== null ? 1 : 0)) / total) * 100}%` }}
          />
        </div>
      </div>

      {/* Body */}
      <div className="quiz-body">
        <div className="quiz-question" key={current} style={{ animation: 'fadeSlideIn 0.3s ease' }}>
          {question.question}
        </div>

        <div className="options-list">
          {question.options.map((option, i) => (
            <button
              key={i}
              className={`option-btn ${getOptionClass(i)}`}
              onClick={() => handleSelect(i)}
              disabled={selected !== null}
            >
              <span className="option-letter">{LETTERS[i]}</span>
              <span style={{ flex: 1 }}>{option}</span>
              {selected !== null && i === question.correct && <span>✓</span>}
              {selected === i && i !== question.correct && <span>✗</span>}
            </button>
          ))}
        </div>

        {selected !== null && (
          <div className={`answer-feedback ${selected === question.correct ? 'correct' : 'wrong'}`}>
            {selected === question.correct
              ? <><span>🎉</span> إجابة صحيحة! أحسنت</>
              : <><span>💡</span> الإجابة الصحيحة: {question.options[question.correct]}</>
            }
          </div>
        )}

        {selected !== null && (
          <button className="btn btn-primary" onClick={handleNext} style={{ animation: 'fadeSlideIn 0.3s ease' }}>
            {current + 1 < total ? <><span>👉</span> السؤال التالي</> : <><span>🏁</span> الجزء التالي</>}
          </button>
        )}
      </div>
    </div>
  )
}
