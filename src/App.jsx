import { useState, useCallback } from 'react'
import UploadScreen from './components/UploadScreen'
import LoadingScreen from './components/LoadingScreen'
import LessonScreen from './components/LessonScreen'
import QuizScreen from './components/QuizScreen'
import TrueFalseScreen from './components/TrueFalseScreen'
import ResultScreen from './components/ResultScreen'
import { analyzeLesson } from './services/claudeService'

const SCREENS = {
  UPLOAD: 'upload',
  LOADING: 'loading',
  LESSON: 'lesson',
  QUIZ: 'quiz',
  TRUE_FALSE: 'truefalse',
  RESULT: 'result',
}

export default function App() {
  const [screen, setScreen] = useState(SCREENS.UPLOAD)
  const [lesson, setLesson] = useState(null)
  const [mcqAnswers, setMcqAnswers] = useState([])
  const [error, setError] = useState(null)

  const handleStart = useCallback(async (images) => {
    setError(null)
    setScreen(SCREENS.LOADING)
    try {
      const data = await analyzeLesson(images)
      setLesson(data)
      setScreen(SCREENS.LESSON)
    } catch (err) {
      setError(err.message || 'حدث خطأ. تأكد من صحة المفتاح والاتصال بالإنترنت.')
      setScreen(SCREENS.UPLOAD)
    }
  }, [])

  const handleStartQuiz = useCallback(() => {
    setMcqAnswers([])
    setScreen(SCREENS.QUIZ)
  }, [])

  const handleMcqFinish = useCallback((answers) => {
    setMcqAnswers(answers)
    setScreen(SCREENS.TRUE_FALSE)
  }, [])

  const handleTFFinish = useCallback((allAnswers) => {
    setScreen(SCREENS.RESULT)
    // Store combined answers for result screen via state
    setMcqAnswers(allAnswers)
  }, [])

  const handleReviewLesson = useCallback(() => {
    setMcqAnswers([])
    setScreen(SCREENS.LESSON)
  }, [])

  const handleRestart = useCallback(() => {
    setLesson(null)
    setMcqAnswers([])
    setError(null)
    setScreen(SCREENS.UPLOAD)
  }, [])

  return (
    <div className="app-shell">
      {screen === SCREENS.UPLOAD && (
        <UploadScreen onStart={handleStart} />
      )}
      {screen === SCREENS.LOADING && (
        <LoadingScreen />
      )}
      {screen === SCREENS.LESSON && lesson && (
        <LessonScreen lesson={lesson} onStartQuiz={handleStartQuiz} />
      )}
      {screen === SCREENS.QUIZ && lesson && (
        <QuizScreen
          questions={lesson.mcq_questions}
          onFinish={handleMcqFinish}
        />
      )}
      {screen === SCREENS.TRUE_FALSE && lesson && (
        <TrueFalseScreen
          questions={lesson.true_false_questions}
          mcqAnswers={mcqAnswers}
          onFinish={handleTFFinish}
        />
      )}
      {screen === SCREENS.RESULT && lesson && (
        <ResultScreen
          answers={mcqAnswers}
          lessonTitle={lesson.lesson_title}
          onRestart={handleRestart}
          onReviewLesson={handleReviewLesson}
        />
      )}

      {error && (
        <div className="error-toast" onClick={() => setError(null)}>
          ⚠️ {error}
        </div>
      )}

      <footer style={{
        textAlign: 'center',
        padding: '14px 20px',
        fontSize: 13,
        fontWeight: 600,
        color: '#9ca3af',
        borderTop: '1px solid #e5e7eb',
        background: '#fafafa',
      }}>
        © جميع الحقوق محفوظة لـ عبدالله المشيخي 2026
      </footer>
    </div>
  )
}
