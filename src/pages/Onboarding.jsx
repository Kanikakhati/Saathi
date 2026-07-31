import { useState } from 'react'
import { Link } from 'react-router-dom'
import AppNav from '../components/AppNav'

const LANGUAGES = ['हिंदी', 'English', 'Hinglish', 'मराठी']
const LANG_SUB = ['Hindi', 'English', 'Mix of both', 'Marathi']

export default function Onboarding() {
  const [step, setStep] = useState(1)
  const [lang, setLang] = useState(0)

  return (
    <div>
      <AppNav backTo="/" backLabel="Back to site" />
      <div className="max-w-[560px] mx-auto px-8 pt-[70px] pb-[90px]">
        <div className="flex gap-2 mb-10">
          {[1, 2, 3].map((n) => (
            <div key={n} className="flex-1 h-1 rounded-[3px] bg-parchment-deep overflow-hidden">
              <div className="h-full bg-wine transition-all duration-300" style={{ width: n <= step ? '100%' : '0%' }} />
            </div>
          ))}
        </div>

        <div className="bg-white border border-line rounded-[22px] p-9 shadow-premium">
          {step === 1 && (
            <>
              <p className="eyebrow mb-2.5">Step 1 of 3</p>
              <h2 className="text-2xl mb-2.5">Which language feels natural to you?</h2>
              <p className="text-[14.5px] text-plum leading-relaxed mb-[30px]">
                Saathi listens in whatever language you speak — mix languages freely, that's normal.
              </p>
              <div className="grid grid-cols-2 gap-3 mb-2">
                {LANGUAGES.map((l, i) => (
                  <div
                    key={l}
                    onClick={() => setLang(i)}
                    className={`border-[1.5px] rounded-2xl p-4 cursor-pointer flex items-center gap-3 transition-colors ${
                      lang === i ? 'border-wine bg-parchment' : 'border-line hover:border-rose'
                    }`}
                  >
                    <span className="text-xl">🗣️</span>
                    <div>
                      <div className="font-bold text-sm text-plum-deep">{l}</div>
                      <div className="text-[11.5px] text-plum mt-0.5">{LANG_SUB[i]}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center mt-8">
                <span className="text-[12.5px] font-semibold text-plum">1 / 3</span>
                <button onClick={() => setStep(2)} className="btn-primary">Continue</button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <p className="eyebrow mb-2.5">Step 2 of 3</p>
              <h2 className="text-2xl mb-2.5">A little about you</h2>
              <p className="text-[14.5px] text-plum leading-relaxed mb-[30px]">
                This helps Saathi read your symptoms against the right baseline — nothing here is shared without
                your say-so.
              </p>
              <label className="text-[12.5px] font-bold text-plum-deep mb-2 block">Your age</label>
              <input type="number" placeholder="e.g. 47" className="w-full border-[1.5px] border-line rounded-xl px-4 py-3 text-[14.5px] text-plum-deep bg-cream focus:outline-none focus:border-wine" />

              <label className="text-[12.5px] font-bold text-plum-deep mb-2 block mt-[22px]">When did your last period start?</label>
              <select className="w-full border-[1.5px] border-line rounded-xl px-4 py-3 text-[14.5px] text-plum-deep bg-cream focus:outline-none focus:border-wine">
                <option>Within the last 3 months</option>
                <option>3–12 months ago</option>
                <option>Over a year ago</option>
                <option>I'm not tracking this</option>
              </select>

              <label className="text-[12.5px] font-bold text-plum-deep mb-2 block mt-[22px]">Nearest city or town</label>
              <input type="text" placeholder="e.g. Lucknow" className="w-full border-[1.5px] border-line rounded-xl px-4 py-3 text-[14.5px] text-plum-deep bg-cream focus:outline-none focus:border-wine" />

              <div className="flex justify-between items-center mt-8">
                <span className="text-[12.5px] font-semibold text-plum">2 / 3</span>
                <button onClick={() => setStep(3)} className="btn-primary">Continue</button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <p className="eyebrow mb-2.5">Step 3 of 3</p>
              <h2 className="text-2xl mb-2.5">One last thing</h2>
              <p className="text-[14.5px] text-plum leading-relaxed mb-[30px]">
                Saathi records voice check-ins to score your symptoms and improve over time. You can delete your
                data any time from Settings.
              </p>
              <div className="flex gap-2.5 items-start mt-[22px] p-3.5 bg-parchment rounded-xl">
                <input type="checkbox" defaultChecked className="mt-0.5 accent-wine" />
                <p className="text-[12.5px] leading-relaxed text-plum">
                  I agree to Saathi listening to my voice check-ins to generate a symptom score, and storing my
                  check-in history on my account.
                </p>
              </div>
              <div className="flex gap-2.5 items-start mt-[10px] p-3.5 bg-parchment rounded-xl">
                <input type="checkbox" defaultChecked className="mt-0.5 accent-wine" />
                <p className="text-[12.5px] leading-relaxed text-plum">
                  I'd like Saathi to suggest nearby verified doctors or ASHA workers when relevant.
                </p>
              </div>
              <div className="flex justify-between items-center mt-8">
                <span className="text-[12.5px] font-semibold text-plum">3 / 3</span>
                <Link to="/dashboard" className="btn-primary">Start my first check-in</Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
