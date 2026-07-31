import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AppNav from '../components/AppNav'
import { IconMic, IconSend } from '../components/Icons'

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
    { who: 'ai', text: "Namaste Meera — how has your sleep been this week?" },
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [done, setDone] = useState(false)
  const threadRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    threadRef.current?.scrollTo(0, threadRef.current.scrollHeight)
  }, [messages, typing])

  const send = (text) => {
    const value = (text ?? input).trim()
    if (!value) return
    setMessages((m) => [...m, { who: 'user', text: value }])
    setInput('')
    setTyping(true)
    setTimeout(() => {
      setTyping(false)
      setMessages((m) => [
        ...m,
        {
          who: 'ai',
          text: "Got it — that sounds like it's been disrupting your rest. I've logged this and put together your summary. Ready to take a look?",
        },
      ])
      setTimeout(() => setDone(true), 300)
    }, 1100)
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

        <div className="flex items-center gap-2.5 bg-white border-[1.5px] border-line rounded-full py-2 pl-[22px] pr-2">
          <button className="w-[42px] h-[42px] rounded-full bg-parchment text-wine flex items-center justify-center flex-shrink-0">
            <IconMic width={17} height={17} />
          </button>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send()}
            placeholder="Type your reply, or tap the mic to speak…"
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
    </div>
  )
}
