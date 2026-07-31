import { useState, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import AppNav from '../components/AppNav'

export default function Auth() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const [mode, setMode] = useState(params.get('mode') === 'login' ? 'login' : 'signup')
  const [step, setStep] = useState('phone')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const otpRefs = useRef([])

  const sendOtp = () => {
    setStep('otp')
    setTimeout(() => otpRefs.current[0]?.focus(), 50)
  }

  const handleOtpChange = (i, val) => {
    const digit = val.replace(/[^0-9]/g, '').slice(0, 1)
    const next = [...otp]
    next[i] = digit
    setOtp(next)
    if (digit && i < 5) otpRefs.current[i + 1]?.focus()
  }

  const handleOtpKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) otpRefs.current[i - 1]?.focus()
  }

  const verify = () => {
    navigate(mode === 'login' ? '/dashboard' : '/onboarding')
  }

  const copy =
    mode === 'login'
      ? {
          headline: 'Welcome back',
          sub: 'Enter the mobile number you signed up with.',
          switchText: 'New to Saathi?',
          switchAction: 'Create an account',
          verifyLabel: 'Verify & continue',
        }
      : {
          headline: 'Welcome to Saathi',
          sub: 'Enter your mobile number — no email, no password to remember.',
          switchText: 'Already have an account?',
          switchAction: 'Log in',
          verifyLabel: 'Verify & create account',
        }

  return (
    <div>
      <AppNav backTo="/" backLabel="Back to site" />
      <div className="max-w-[440px] mx-auto px-8 pt-[90px] pb-[90px]">
        {step === 'phone' ? (
          <div className="bg-white border border-line rounded-[22px] p-9 shadow-premium">
            <div className="flex gap-2 bg-parchment rounded-full p-1 mb-7">
              <button
                onClick={() => setMode('login')}
                className={`flex-1 text-center py-2.5 rounded-full text-[13.5px] font-bold transition-all ${mode === 'login' ? 'bg-wine text-cream' : 'text-plum'}`}
              >
                Log in
              </button>
              <button
                onClick={() => setMode('signup')}
                className={`flex-1 text-center py-2.5 rounded-full text-[13.5px] font-bold transition-all ${mode === 'signup' ? 'bg-wine text-cream' : 'text-plum'}`}
              >
                Sign up
              </button>
            </div>
            <h2 className="text-2xl mb-2.5">{copy.headline}</h2>
            <p className="text-[14.5px] text-plum leading-relaxed mb-[30px]">{copy.sub}</p>

            <label className="text-[12.5px] font-bold text-plum-deep mb-2 block">Mobile number</label>
            <div className="flex gap-2.5">
              <div className="flex items-center gap-1.5 border-[1.5px] border-line rounded-xl px-3.5 text-[14.5px] font-bold text-plum-deep bg-cream flex-shrink-0">
                🇮🇳 +91
              </div>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                maxLength={10}
                placeholder="98765 43210"
                className="flex-1 border-[1.5px] border-line rounded-xl px-4 py-3 text-[14.5px] text-plum-deep bg-cream focus:outline-none focus:border-wine"
              />
            </div>

            <button onClick={sendOtp} className="btn-primary w-full justify-center mt-[26px]">
              Send OTP
            </button>
            <p className="text-xs text-plum leading-relaxed mt-5">
              By continuing, you agree to Saathi's <a className="text-wine font-bold">Terms of Use</a> and{' '}
              <a className="text-wine font-bold">Privacy Policy</a>. We'll only use your number to verify it's you.
            </p>
          </div>
        ) : (
          <div className="bg-white border border-line rounded-[22px] p-9 shadow-premium">
            <p className="eyebrow mb-2.5">Verify your number</p>
            <h2 className="text-2xl mb-2.5">Enter the OTP</h2>
            <p className="text-[14.5px] text-plum leading-relaxed mb-[30px]">
              We've sent a 6-digit code by SMS to <b className="text-plum-deep">+91 {phone || '98765 43210'}</b>.
            </p>
            <div className="flex gap-2.5 my-1.5">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => (otpRefs.current[i] = el)}
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(i, e)}
                  maxLength={1}
                  inputMode="numeric"
                  className="w-12 h-14 text-center text-[22px] font-bold font-display border-[1.5px] border-line rounded-xl text-plum-deep bg-cream focus:outline-none focus:border-wine"
                />
              ))}
            </div>
            <div className="flex justify-between items-center mt-4.5 text-[12.5px] text-plum">
              <span>
                Didn't get it? <a className="text-wine font-bold cursor-pointer">Resend code</a>
              </span>
              <span className="underline cursor-pointer" onClick={() => setStep('phone')}>
                Change number
              </span>
            </div>
            <button onClick={verify} className="btn-primary w-full justify-center mt-[26px]">
              {copy.verifyLabel}
            </button>
          </div>
        )}

        {step === 'phone' && (
          <p className="text-center mt-[22px] text-[13.5px] text-plum">
            {copy.switchText}{' '}
            <a className="text-wine font-bold cursor-pointer" onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}>
              {copy.switchAction}
            </a>
          </p>
        )}
      </div>
    </div>
  )
}
