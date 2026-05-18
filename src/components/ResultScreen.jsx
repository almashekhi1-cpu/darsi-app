import { useEffect, useRef, useState } from 'react'

function getGrade(percent) {
  if (percent >= 90) return { emoji: '🏆', title: 'ممتاز!', msg: 'أداء رائع! أتقنت هذا الدرس بشكل مميز. استمر في هذا التفوق!', color: '#10b981' }
  if (percent >= 75) return { emoji: '🌟', title: 'جيد جداً!', msg: 'أداء جيد جداً! لديك فهم قوي للدرس. راجع بعض المفاهيم للوصول للتميز!', color: '#4f46e5' }
  if (percent >= 60) return { emoji: '👍', title: 'جيد', msg: 'أداء جيد! يمكنك تحسين نتيجتك بمراجعة الدرس مرة أخرى.', color: '#f59e0b' }
  if (percent >= 40) return { emoji: '📚', title: 'يحتاج مراجعة', msg: 'لا بأس! الدرس يحتاج مزيداً من المراجعة. اقرأ الشرح مجدداً وحاول من جديد!', color: '#f97316' }
  return { emoji: '💪', title: 'حاول مجدداً', msg: 'لا تستسلم! راجع الدرس بعناية وحاول الاختبار مرة أخرى. الممارسة تصنع الفرق!', color: '#ef4444' }
}

export default function ResultScreen({ answers, lessonTitle, onRestart, onReviewLesson }) {
  const correct = answers.filter(a => a.correct).length
  const total = answers.length
  const percent = Math.round((correct / total) * 100)
  const grade = getGrade(percent)

  const circumference = 2 * Math.PI * 58
  const [dashOffset, setDashOffset] = useState(circumference)
  const animatedRef = useRef(false)

  useEffect(() => {
    if (!animatedRef.current) {
      animatedRef.current = true
      requestAnimationFrame(() => {
        setTimeout(() => {
          setDashOffset(circumference - (percent / 100) * circumference)
        }, 100)
      })
    }
  }, [circumference, percent])

  return (
    <div className="screen result-screen">
      <div className="result-header">
        <span className="result-emoji">{grade.emoji}</span>
        <h2 className="result-grade-title">{grade.title}</h2>
        <p className="result-grade-sub">{lessonTitle}</p>
      </div>

      {/* Score Circle */}
      <div className="score-circle-wrap">
        <svg width="160" height="160" viewBox="0 0 160 160">
          <circle className="score-circle-bg" cx="80" cy="80" r="58" />
          <circle
            className="score-circle-fill"
            cx="80" cy="80" r="58"
            stroke={grade.color}
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
          />
        </svg>
        <div className="score-circle-text">
          <span className="score-number" style={{ color: grade.color }}>{percent}%</span>
          <span className="score-total">{correct}/{total}</span>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-row">
        <div className="stat-card correct-stat">
          <div className="stat-icon">✅</div>
          <div className="stat-value">{correct}</div>
          <div className="stat-label">إجابة صحيحة</div>
        </div>
        <div className="stat-card wrong-stat">
          <div className="stat-icon">❌</div>
          <div className="stat-value">{total - correct}</div>
          <div className="stat-label">إجابة خاطئة</div>
        </div>
      </div>

      {/* Message */}
      <div className="result-message">
        {grade.msg}
      </div>

      {/* Actions */}
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button className="btn btn-primary" onClick={onReviewLesson}>
          <span>📖</span> إعادة الدرس والاختبار
        </button>
        <button className="btn btn-outline" onClick={onRestart}>
          <span>✨</span> بدء درس جديد
        </button>
      </div>
    </div>
  )
}
