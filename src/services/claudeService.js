const MODEL = 'claude-sonnet-4-6'
const API_URL = 'https://api.anthropic.com/v1/messages'
const API_KEY = import.meta.env.VITE_CLAUDE_API_KEY

const SYSTEM_PROMPT = `أنت مساعد تعليمي ذكي متخصص في تحليل صور الدروس وتوليد محتوى تعليمي تفاعلي بصري باللغة العربية الفصحى البسيطة.

مهمتك:
1. تحليل صور الدرس بعمق واستخراج كل المفاهيم والرسومات والصيغ والجداول
2. توليد شرح تفاعلي بصري غني يشمل رسومات توضيحية وخطوات مرحلية وصيغ مُنسّقة
3. إنشاء أسئلة تقييمية متنوعة

قواعد توليد الرسومات (diagram):
- إذا كان المفهوم يحتوي معادلة/قانون → اختر type: "formula"
- إذا كان هناك إجراء أو خوارزمية خطوات → اختر type: "steps"
- إذا كان هناك جدول مقارنة أو بيانات → اختر type: "table"
- إذا كان هناك أشكال هندسية → اختر type: "geometry"
- إذا كان هناك نسب أو كميات قابلة للمقارنة → اختر type: "bar_chart"
- إذا كان مفهوماً نظرياً بحتاً → اختر type: "none"

أجب دائماً بصيغة JSON فقط بدون أي نص إضافي خارج الـ JSON.`

const USER_PROMPT = `حلّل هذه الصور للدرس وأنشئ محتوى تعليمياً تفاعلياً بصرياً كاملاً.

أرجع JSON فقط بهذا الشكل الدقيق (بدون markdown):

{
  "lesson_title": "عنوان الدرس",
  "subject": "المادة الدراسية",
  "subject_emoji": "إيموجي",
  "did_you_know": "معلومة طريفة أو مثيرة مرتبطة بالدرس",
  "key_concepts": [
    {
      "title": "عنوان المفهوم",
      "explanation": "شرح مفصل وواضح بأسلوب بسيط ومحادثاتي",
      "steps": ["الخطوة الأولى بالتفصيل", "الخطوة الثانية بالتفصيل"],
      "key_terms": [
        { "term": "مصطلح", "definition": "تعريف المصطلح بشكل بسيط" }
      ],
      "example": "مثال تطبيقي واضح",
      "diagram": {
        "type": "none",
        "title": ""
      }
    }
  ],
  "summary": "ملخص عام للدرس",
  "mcq_questions": [
    {
      "question": "نص السؤال",
      "options": ["الخيار أ", "الخيار ب", "الخيار ج", "الخيار د"],
      "correct": 0
    }
  ],
  "true_false_questions": [
    {
      "statement": "نص العبارة",
      "answer": true
    }
  ]
}

أنواع diagram المدعومة وبياناتها:

1. formula — لعرض معادلة أو قانون:
   { "type": "formula", "title": "اسم القانون", "formula": "نص الصيغة الرياضية", "variables": [{"symbol": "م", "meaning": "المسافة", "unit": "متر"}] }

2. steps — لعرض خطوات مرحلية:
   { "type": "steps", "title": "عنوان الإجراء", "items": ["الخطوة الأولى", "الخطوة الثانية", "الخطوة الثالثة"] }

3. table — لعرض جدول بيانات أو مقارنة:
   { "type": "table", "title": "عنوان الجدول", "headers": ["العمود 1", "العمود 2", "العمود 3"], "rows": [["قيمة", "قيمة", "قيمة"]] }

4. geometry — لعرض شكل هندسي مع تسميات:
   { "type": "geometry", "title": "اسم الشكل", "shape": "triangle|rectangle|circle|parallelogram|trapezoid", "labels": [{"position": "top|bottom|left|right|center", "text": "التسمية"}], "color": "#4f46e5" }

5. bar_chart — لعرض مقارنة بأعمدة:
   { "type": "bar_chart", "title": "عنوان المخطط", "bars": [{"label": "التسمية", "value": 75, "color": "#4f46e5"}] }

6. none — بدون رسم:
   { "type": "none" }

المتطلبات الإلزامية:
- key_concepts: من 3 إلى 5 مفاهيم
- لكل مفهوم: اختر diagram مناسباً من الأنواع أعلاه
- steps في المفهوم: أضف فقط إذا كان هناك إجراء خطوات واضح، وإلا اجعله مصفوفة فارغة []
- key_terms: من 1 إلى 3 مصطلحات أساسية لكل مفهوم
- mcq_questions: بالضبط 5 أسئلة، كل سؤال 4 خيارات، correct هو الفهرس (0-3)
- true_false_questions: بالضبط 4 أسئلة`

export async function analyzeLesson(imageFiles) {
  const apiKey = API_KEY
  const imageContents = await Promise.all(
    imageFiles.map(async (file) => {
      const base64 = await fileToBase64(file)
      const mediaType = file.type || 'image/jpeg'
      return {
        type: 'image',
        source: { type: 'base64', media_type: mediaType, data: base64 },
      }
    })
  )

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 6000,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: [...imageContents, { type: 'text', text: USER_PROMPT }],
        },
      ],
    }),
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    const msg = err?.error?.message || `خطأ في الاتصال (${response.status})`
    throw new Error(msg)
  }

  const data = await response.json()
  const text = data.content?.[0]?.text || ''
  const jsonText = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim()

  try {
    return JSON.parse(jsonText)
  } catch {
    throw new Error('فشل في تحليل إجابة الذكاء الاصطناعي. حاول مرة أخرى.')
  }
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result.split(',')[1])
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
