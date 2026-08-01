import { useState } from 'react'

export default function QuizPopup({ questions, onComplete, onClose }) {
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [selected, setSelected] = useState(null)

  const question = questions[index]
  const isLast = index === questions.length - 1

  const next = () => {
    if (selected === null) return
    const updated = { ...answers, [question.id]: selected }
    setAnswers(updated)
    setSelected(null)
    if (isLast) {
      onComplete(updated)
    } else {
      setIndex(index + 1)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] bg-plum-deep/60 backdrop-blur-sm flex items-center justify-center p-6">
      <div className="bg-white rounded-[22px] p-8 shadow-premium max-w-[440px] w-full">
        <div className="flex justify-between items-center mb-5">
          <span className="eyebrow">
            Quick check · {index + 1} of {questions.length}
          </span>
          <button onClick={onClose} className="text-plum text-xl leading-none hover:text-wine">
            ×
          </button>
        </div>

        <div className="flex gap-1.5 mb-6">
          {questions.map((_, i) => (
            <div key={i} className={`h-1 flex-1 rounded-full ${i <= index ? 'bg-wine' : 'bg-parchment-deep'}`} />
          ))}
        </div>

        <h3 className="text-xl mb-6">{question.question}</h3>

        <div className="flex flex-col gap-2.5 mb-7">
          {question.options.map((opt) => (
            <button
              key={opt.score}
              onClick={() => setSelected(opt.score)}
              className={`text-left px-4 py-3 rounded-xl border-[1.5px] text-sm font-semibold transition-colors ${
                selected === opt.score ? 'border-wine bg-parchment text-plum-deep' : 'border-line text-plum hover:border-rose'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <button onClick={next} disabled={selected === null} className="btn-primary w-full justify-center disabled:opacity-50">
          {isLast ? 'Finish' : 'Next'}
        </button>
      </div>
    </div>
  )
}