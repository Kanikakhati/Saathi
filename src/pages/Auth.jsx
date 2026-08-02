import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import AppNav from '../components/AppNav'
import * as api from '../lib/api'

export default function Auth() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const [mode, setMode] = useState(params.get('mode') === 'login' ? 'login' : 'signup')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const copy =
    mode === 'login'
      ? {
          headline: 'Welcome back',
          sub: 'Enter your mobile number and password to continue.',
          switchText: 'New to Saathi?',
          switchAction: 'Create an account',
          submitLabel: 'Log in',
        }
      : {
          headline: 'Welcome to Saathi',
          sub: 'Enter your mobile number and set a password — no email needed.',
          switchText: 'Already have an account?',
          switchAction: 'Log in',
          submitLabel: 'Create account',
        }

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (mode === 'login') {
        await api.login(phone, password)
        navigate('/dashboard')
      } else {
        await api.signup(phone, password, name)
        navigate('/onboarding')
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <AppNav backTo="/" backLabel="Back to site" />
      <div className="max-w-[440px] mx-auto px-8 pt-[90px] pb-[90px]">
        <form onSubmit={submit} className="bg-white border border-line rounded-[22px] p-9 shadow-premium">
          <div className="flex gap-2 bg-parchment rounded-full p-1 mb-7">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`flex-1 text-center py-2.5 rounded-full text-[13.5px] font-bold transition-all ${mode === 'login' ? 'bg-wine text-cream' : 'text-plum'}`}
            >
              Log in
            </button>
            <button
              type="button"
              onClick={() => setMode('signup')}
              className={`flex-1 text-center py-2.5 rounded-full text-[13.5px] font-bold transition-all ${mode === 'signup' ? 'bg-wine text-cream' : 'text-plum'}`}
            >
              Sign up
            </button>
          </div>

          <h2 className="text-2xl mb-2.5">{copy.headline}</h2>
          <p className="text-[14.5px] text-plum leading-relaxed mb-[30px]">{copy.sub}</p>
          {mode === 'signup' && (
  <>
    <label className="text-[12.5px] font-bold text-plum-deep mb-2 block">Full name</label>
    <input
      type="text"
      value={name}
      onChange={(e) => setName(e.target.value)}
      placeholder="e.g. Meera Sharma"
      required
      className="w-full border-[1.5px] border-line rounded-xl px-4 py-3 text-[14.5px] text-plum-deep bg-cream focus:outline-none focus:border-wine mb-[18px]"
    />
  </>
)}

          <label className="text-[12.5px] font-bold text-plum-deep mb-2 block">Mobile number</label>
          <div className="flex gap-2.5 mb-[18px]">
            <div className="flex items-center gap-1.5 border-[1.5px] border-line rounded-xl px-3.5 text-[14.5px] font-bold text-plum-deep bg-cream flex-shrink-0">
              🇮🇳 +91
            </div>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              maxLength={10}
              placeholder="98765 43210"
              required
              className="flex-1 border-[1.5px] border-line rounded-xl px-4 py-3 text-[14.5px] text-plum-deep bg-cream focus:outline-none focus:border-wine"
            />
          </div>

          <label className="text-[12.5px] font-bold text-plum-deep mb-2 block">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            minLength={6}
            className="w-full border-[1.5px] border-line rounded-xl px-4 py-3 text-[14.5px] text-plum-deep bg-cream focus:outline-none focus:border-wine"
          />

          {error && <p className="text-[12.5px] text-wine font-semibold mt-3">{error}</p>}

          <button type="submit" disabled={loading} className="btn-primary w-full justify-center mt-[26px] disabled:opacity-60">
            {loading ? 'Please wait…' : copy.submitLabel}
          </button>

          <p className="text-xs text-plum leading-relaxed mt-5">
            By continuing, you agree to Saathi's <a className="text-wine font-bold">Terms of Use</a> and{' '}
            <a className="text-wine font-bold">Privacy Policy</a>.
          </p>
        </form>

        <p className="text-center mt-[22px] text-[13.5px] text-plum">
          {copy.switchText}{' '}
          <a className="text-wine font-bold cursor-pointer" onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}>
            {copy.switchAction}
          </a>
        </p>
      </div>
    </div>
  )
}