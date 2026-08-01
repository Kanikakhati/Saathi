import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AppNav from '../components/AppNav'
import QuizPopup from '../components/QuizPopup'
import { IconMic, IconSend } from '../components/Icons'
import * as api from '../lib/api'
import { mergeScores } from '../lib/mrs'

const QUICK_REPLIES = [
  'Neend theek nahi ho rahi',
  'Sab normal hai',
  'Mood swings lately',
]
const QUICK_REPLY_TEXT = {
  'Neend theek nahi ho rahi': 'Neend theek nahi ho rahi, raat ko garmi lagti hai',
  'Sab normal hai': 'Sab normal hai, koi problem nahi',
  'Mood swings lately': 'Mood swings a lot lately',
}

export default function Checkin() {
  const [messages, setMessages] = useState([
    { who: 'ai', text: 'Namaste Meera — how has your sleep been this week?' },
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [done, setDone] = useState(false)
  const [voiceResult, setVoiceResult] = useState(null)
  const [lastText, setLastText] = useState('')
  const [quizQuestions, setQuizQuestions] = useState(null)
  const [isRecording, setIsRecording] = useState(false)
  const [micError, setMicError] = useState('')
  const threadRef = useRef(null)
  const navigate = useNavigate()
  const mediaRecorderRef = useRef(null)
  const streamRef = useRef(null)
  const recognitionRef = useRef(null)
  const audioChunksRef = useRef([])

  useEffect(() => {
    threadRef.current?.scrollTo(0, threadRef.current.scrollHeight)
  }, [messages, typing, quizQuestions])

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop()
      streamRef.current?.getTracks().forEach((track) => track.stop())
    }
  }, [])

  const appendAi = (text) => setMessages((m) => [...m, { who: 'ai', text }])
  const appendUser = (text) => setMessages((m) => [...m, { who: 'user', text }])

  const startRecording = async () => {
    setMicError('')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream

      audioChunksRef.current = []
      const recorder = new MediaRecorder(stream)
      recorder.ondataavailable = (e) => audioChunksRef.current.push(e.data)
      recorder.start()
      mediaRecorderRef.current = recorder

      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition()
        recognition.lang = 'en-IN'
        recognition.continuous = true
        recognition.interimResults = true
        recognition.onresult = (event) => {
          const transcript = Array.from(event.results).map((r) => r[0].transcript).join(' ')
          setInput(transcript)
        }
        recognition.onerror = () => {}
        recognition.start()
        recognitionRef.current = recognition
      } else {
        setMicError("Voice-to-text isn't supported in this browser — recording audio, but please type your message too.")
      }

      setIsRecording(true)
    } catch {
      setMicError('Microphone access was blocked — please allow it in your browser, or type your message instead.')
    }
  }

  const stopRecording = () => {
    mediaRecorderRef.current?.stop()
    recognitionRef.current?.stop()
    streamRef.current?.getTracks().forEach((track) => track.stop())
    setIsRecording(false)

    const finalTranscript = input.trim()
    if (finalTranscript) send(finalTranscript)
  }

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording()
    } else {
      startRecording()
    }
  }

  const finish = async (rawText, result, quizAnswers, source) => {
    const finalScores = mergeScores(result, quizAnswers)
    try {
      await api.submitEntry(rawText, finalScores, source)
    } catch {
      // Backend not reachable — still let the person see a local summary.
    }
    appendAi("Got it — I've logged this and put together your summary. Ready to take a look?")
    setDone(true)
  }

  const send = async (text) => {
    const value = (text ?? input).trim()
    if (!value) return
    appendUser(value)
    setInput('')
    setTyping(true)
    setLastText(value)

    try {
      const result = await api.scoreText(value, 'en')
      setTyping(false)

      if (result.ambiguous_symptoms?.length) {
        const allQuestions = await api.getMrsQuestions('en')
        const relevant = allQuestions.filter((q) => result.ambiguous_symptoms.includes(q.id))
        setVoiceResult(result)
        setQuizQuestions(relevant)
        appendAi("I want to double-check a couple of things — just a couple of quick questions.")
      } else {
        await finish(value, result, {}, 'voice')
      }
    } catch {
      setTyping(false)
      appendAi("I couldn't reach the scoring service just now — let's try again in a moment.")
    }
  }

  const handleQuizComplete = (answers) => {
    setQuizQuestions(null)
    finish(lastText, voiceResult, answers, 'hybrid')
  }

  const handleQuizClose = () => {
    setQuizQuestions(null)
    finish(lastText, voiceResult, {}, 'voice')
  }

  return (
    <div>
      <AppNav backTo="/dashboard" backLabel="Back to dashboard" />
      <div className="max-w-[640px] mx-auto px-8 pt-[50px] pb-10 flex flex-col min-h-[calc(100vh-200px)]">
        <div className="text-center mb-[30px]">
          <p className="eyebrow">Today's check-in</p>
          <h2 className="text-2xl mt-2">Tell me how you've been feeling.</h2>
        </div>

        <div ref={threadRef} className="flex-1 flex flex-col gap-3.5 mb-[26px] overflow-y-auto">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`rounded-2xl px-4 py-3.5 text-[13.8px] leading-relaxed max-w-[80%] ${
                m.who === 'user'
                  ? 'bg-parchment text-plum-deep rounded-br-[4px] ml-auto'
                  : 'bg-plum-deep text-cream rounded-bl-[4px]'
              }`}
            >
              <span className="block text-[10.5px] font-extrabold uppercase tracking-[0.06em] opacity-60 mb-1.5">
                {m.who === 'user' ? 'You' : 'Saathi'}
              </span>
              {m.text}
            </div>
          ))}
          {typing && (
            <div className="flex gap-1.5 items-center px-4 py-3.5 bg-plum-deep rounded-2xl rounded-bl-[4px] w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-light pulse-dot" />
              <span className="w-1.5 h-1.5 rounded-full bg-rose-light pulse-dot" style={{ animationDelay: '.15s' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-rose-light pulse-dot" style={{ animationDelay: '.3s' }} />
            </div>
          )}
          {done && (
            <button onClick={() => navigate('/report')} className="btn-primary mt-1 w-fit">
              View my summary →
            </button>
          )}
        </div>

        {micError && <p className="text-[12px] text-wine font-semibold text-center mb-2">{micError}</p>}

        <div className="flex items-center gap-2.5 bg-white border-[1.5px] border-line rounded-full py-2 pl-[22px] pr-2">
          <button
            onClick={toggleRecording}
            className={`w-[42px] h-[42px] rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
              isRecording ? 'bg-wine text-cream animate-pulse' : 'bg-parchment text-wine'
            }`}
          >
            <IconMic width={17} height={17} />
          </button>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send()}
            placeholder={isRecording ? 'Listening…' : 'Type your reply, or tap the mic to speak…'}
            className="flex-1 bg-transparent text-[14.5px] text-plum-deep focus:outline-none"
          />
          <button onClick={() => send()} className="w-[42px] h-[42px] rounded-full bg-wine text-cream flex items-center justify-center flex-shrink-0 hover:bg-wine-light">
            <IconSend width={16} height={16} />
          </button>
        </div>
        <div className="flex gap-2 flex-wrap mt-4 justify-center">
          {QUICK_REPLIES.map((q) => (
            <button
              key={q}
              onClick={() => send(QUICK_REPLY_TEXT[q])}
              className="text-[12.5px] font-semibold text-plum bg-parchment border border-line rounded-full px-3.5 py-2 hover:border-wine hover:text-wine"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {quizQuestions && (
        <QuizPopup questions={quizQuestions} onComplete={handleQuizComplete} onClose={handleQuizClose} />
      )}
    </div>
  )
}