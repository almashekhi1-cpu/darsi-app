import { useState, useRef } from 'react'
import DiagramRenderer from './DiagramRenderer'

const CONCEPT_COLORS = [
  { primary: '#4f46e5', light: '#eef2ff', badge: '#c7d2fe' },
  { primary: '#059669', light: '#ecfdf5', badge: '#6ee7b7' },
  { primary: '#d97706', light: '#fffbeb', badge: '#fcd34d' },
  { primary: '#dc2626', light: '#fff1f2', badge: '#fca5a5' },
  { primary: '#7c3aed', light: '#f5f3ff', badge: '#c4b5fd' },
]

export default function LessonScreen({ lesson, onStartQuiz }) {
  const [activeIdx, setActiveIdx] = useState(0)
  const [expandedTerms, setExpandedTerms] = useState({})
  const cardRef = useRef(null)

  const concepts = lesson.key_concepts || []
  const concept = concepts[activeIdx]
  const color = CONCEPT_COLORS[activeIdx % CONCEPT_COLORS.length]
  const totalQ = (lesson.mcq_questions?.length || 0) + (lesson.true_false_questions?.length || 0)

  function goTo(i) {
    setActiveIdx(i)
    setExpandedTerms({})
    cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function toggleTerm(i) {
    setExpandedTerms(prev => ({ ...prev, [i]: !prev[i] }))
  }

  return (
    <div className="screen lesson-screen">

      {/* ── Header ── */}
      <div className="lesson-header" style={{ background: `linear-gradient(135deg, ${color.primary} 0%, ${color.primary}cc 100%)` }}>
        <div className="lesson-badge">
          <span>{lesson.subject_emoji || '📚'}</span>
          <span>{lesson.subject}</span>
        </div>
        <h1 className="lesson-title">{lesson.lesson_title}</h1>
        <p className="lesson-subtitle">
          {concepts.length} مفاهيم · {totalQ} سؤال تفاعلي
        </p>

        {/* Concept nav pills */}
        <div className="concept-nav">
          {concepts.map((c, i) => (
            <button
              key={i}
              className={`concept-pill${i === activeIdx ? ' active' : ''}`}
              onClick={() => goTo(i)}
              style={i === activeIdx ? { background: '#fff', color: color.primary } : {}}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      {/* ── Concept Card ── */}
      <div className="lesson-body" ref={cardRef}>

        {concept && (
          <div className="concept-full-card" style={{ borderColor: color.primary }} key={activeIdx}>

            {/* Title */}
            <div className="cf-title" style={{ color: color.primary }}>
              <span className="cf-number" style={{ background: color.light, color: color.primary }}>
                {activeIdx + 1}
              </span>
              {concept.title}
            </div>

            {/* Explanation */}
            <p className="cf-explanation">{concept.explanation}</p>

            {/* Diagram */}
            {concept.diagram && concept.diagram.type !== 'none' && (
              <DiagramRenderer diagram={concept.diagram} />
            )}

            {/* Steps */}
            {concept.steps?.length > 0 && (
              <div className="cf-section">
                <p className="cf-section-label" style={{ color: color.primary }}>
                  🔢 الخطوات
                </p>
                <div className="cf-steps">
                  {concept.steps.map((step, i) => (
                    <div key={i} className="cf-step" style={{ borderColor: color.badge }}>
                      <span className="cf-step-num" style={{ background: color.primary }}>{i + 1}</span>
                      <span className="cf-step-text">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Key Terms */}
            {concept.key_terms?.length > 0 && (
              <div className="cf-section">
                <p className="cf-section-label" style={{ color: color.primary }}>
                  📖 المصطلحات الأساسية
                </p>
                <div className="cf-terms">
                  {concept.key_terms.map((t, i) => (
                    <div
                      key={i}
                      className={`cf-term${expandedTerms[i] ? ' expanded' : ''}`}
                      style={{ background: color.light, borderColor: color.badge }}
                      onClick={() => toggleTerm(i)}
                    >
                      <div className="cf-term-header">
                        <span className="cf-term-word" style={{ color: color.primary }}>{t.term}</span>
                        <span className="cf-term-arrow" style={{ color: color.primary }}>
                          {expandedTerms[i] ? '▲' : '▼'}
                        </span>
                      </div>
                      {expandedTerms[i] && (
                        <p className="cf-term-def">{t.definition}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Example */}
            {concept.example && (
              <div className="cf-example" style={{ background: color.light, borderColor: color.primary }}>
                <span className="cf-example-label" style={{ color: color.primary }}>✏️ مثال</span>
                <p className="cf-example-text">{concept.example}</p>
              </div>
            )}

            {/* Concept navigation buttons */}
            <div className="cf-nav-btns">
              {activeIdx > 0 && (
                <button
                  className="cf-nav-btn secondary"
                  onClick={() => goTo(activeIdx - 1)}
                  style={{ borderColor: color.primary, color: color.primary }}
                >
                  ← السابق
                </button>
              )}
              {activeIdx < concepts.length - 1 ? (
                <button
                  className="cf-nav-btn primary"
                  onClick={() => goTo(activeIdx + 1)}
                  style={{ background: color.primary }}
                >
                  المفهوم التالي ←
                </button>
              ) : (
                <div style={{ flex: 1 }} />
              )}
            </div>
          </div>
        )}

        {/* ── Summary ── */}
        {lesson.summary && (
          <div className="summary-card">
            <p className="section-title"><span>📋</span> ملخص الدرس</p>
            <p className="summary-text" style={{ marginTop: 10 }}>{lesson.summary}</p>
          </div>
        )}

        {/* ── Quiz CTA ── */}
        <div className="quiz-cta-card">
          <div className="quiz-cta-inner">
            <span className="quiz-cta-icon">🎓</span>
            <div>
              <p className="quiz-cta-title">هل أنت مستعد للاختبار؟</p>
              <p className="quiz-cta-sub">{lesson.mcq_questions?.length} اختيار متعدد · {lesson.true_false_questions?.length} صح أو خطأ</p>
            </div>
          </div>
          <button className="btn btn-primary" onClick={onStartQuiz}>
            <span>✏️</span> ابدأ الاختبار
          </button>
        </div>

      </div>
    </div>
  )
}
