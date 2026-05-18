import { useEffect, useState } from 'react'

const STEPS = [
  'جاري قراءة محتوى الصور...',
  'تحليل مفاهيم الدرس...',
  'إعداد الشرح المبسط...',
  'توليد الأسئلة التفاعلية...',
]

export default function LoadingScreen() {
  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep(prev => (prev < STEPS.length - 1 ? prev + 1 : prev))
    }, 2200)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="screen loading-screen">
      <div className="loading-anim">📖</div>
      <p className="loading-title">يتم تحليل الدرس...</p>

      <div className="loading-steps">
        {STEPS.map((step, i) => (
          <div
            key={i}
            className={`loading-step ${i < activeStep ? 'done' : i === activeStep ? 'active' : ''}`}
          >
            <span className="step-dot" />
            <span>{i < activeStep ? '✓ ' : ''}{step}</span>
          </div>
        ))}
      </div>

      <p style={{ fontSize: 13, color: '#9ca3af', fontWeight: 600, textAlign: 'center', marginTop: 8 }}>
        قد يستغرق هذا 15-30 ثانية
      </p>
    </div>
  )
}
