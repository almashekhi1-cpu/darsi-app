import { useState } from 'react'

export default function TrueFalseScreen({ questions, mcqAnswers, onFinish }) {
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState(null)
  const [answers, setAnswers] = useState([])

  const question = questions[current]
  const total = questions.length

  function handleAnswer(value) {
    if (selected !== null) return
    setSelected(value)
  }

  function handleNext() {
    const isCorrect = selected === question.answer
    const newAnswers = [...answers, { correct: isCorrect, selected, question }]

    if (current + 1 < total) {
      setAnswers(newAnswers)
      setCurrent(c => c + 1)
      setSelected(null)
    } else {
      onFinish([...mcqAnswers, ...newAnswers])
    }
  }

  function getTrueClass() {
    if (selected === null) return 'tf-btn true-btn'
    if (selected === true) {
      return `tf-btn true-btn ${question.answer === true ? 'selected-correct' : 'selected-wrong'}`
    }
    if (question.answer === true) return 'tf-btn true-btn show-correct'
    return 'tf-btn true-btn'
  }

  function getFalseClass() {
    if (selected === null) return 'tf-btn false-btn'
    if (selected === false) {
      return `tf-btn false-btn ${question.answer === false ? 'selected-correct' : 'selected-wrong'}`
    }
    if (question.answer === false) return 'tf-btn false-btn show-correct'
    return 'tf-btn false-btn'
  }

  return (
    <div className="screen quiz-screen">
      {/* Header */}
      <div className="quiz-header">
        <div className="quiz-type-badge">
          <span>✅</span> صح أو خطأ
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
      <div className="quiz-body tf-body">
        <div className="tf-statement" key={current} style={{ animation: 'fadeSlideIn 0.3s ease' }}>
          {question.statement}
        </div>

        <div className="tf-buttons">
          <button
            className={getTrueClass()}
            onClick={() => handleAnswer(true)}
            disabled={selected !== null}
          >
            <span className="tf-icon">✅</span>
            صحيح
          </button>
          <button
            className={getFalseClass()}
            onClick={() => handleAnswer(false)}
            disabled={selected !== null}
          >
            <span className="tf-icon">❌</span>
            خطأ
          </button>
        </div>

        {selected !== null && (
          <div className={`answer-feedback ${selected === question.answer ? 'correct' : 'wrong'}`} style={{ animation: 'fadeSlideIn 0.3s ease', width: '100%' }}>
            {selected === question.answer
              ? <><span>🎉</span> إجابة صحيحة! أحسنت</>
              : <><span>💡</span> الإجابة الصحيحة: {question.answer ? 'صحيح ✅' : 'خطأ ❌'}</>
            }
          </div>
        )}

        {selected !== null && (
          <button className="btn btn-primary" onClick={handleNext} style={{ animation: 'fadeSlideIn 0.3s ease', width: '100%' }}>
            {current + 1 < total
              ? <><span>👉</span> السؤال التالي</>
              : <><span>🏆</span> عرض النتيجة</>
            }
          </button>
        )}
      </div>
    </div>
  )
}
