import { Link } from 'react-router-dom'
import AppNav from '../components/AppNav'
import { IconNote, IconPin, IconHeart, IconRefresh } from '../components/Icons'

export default function Report() {
  return (
    <div>
      <AppNav backTo="/dashboard" backLabel="Back to dashboard" avatar />
      <div className="max-w-[900px] mx-auto px-8 pt-[50px] pb-[90px]">
        <div className="mb-[30px]">
          <h1 className="text-[28px]">Your check-in summary</h1>
          <p className="mt-1.5 text-sm text-plum">Based on your conversation today, 30 July</p>
        </div>

        <div className="relative overflow-hidden bg-plum-deep rounded-[22px] px-10 py-9 text-cream flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_20%,rgba(162,103,105,0.3),transparent_55%)]" />
          <div className="relative">
            <p className="text-[11.5px] font-extrabold uppercase tracking-[0.08em] text-rose-light mb-2.5">Menopause Rating Scale</p>
            <p className="font-display text-[30px] max-w-[420px] leading-snug">
              Your symptoms are trending into the moderate range — mainly sleep and temperature-related.
            </p>
          </div>
          <div className="relative text-center flex-shrink-0">
            <div className="font-display text-[52px] text-cream">14</div>
            <div className="text-xs text-[#C9B7BC] mt-0.5">out of 44</div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {[
            ['Sleep disruption', 70, 'High this week', 'bg-wine'],
            ['Hot flashes', 55, 'Moderate this week', 'bg-rose'],
            ['Mood & irritability', 25, 'Mild this week', 'bg-parchment-deep'],
          ].map(([label, pct, val, color]) => (
            <div key={label} className="bg-white border border-line rounded-2xl p-5">
              <div className="text-[12.5px] font-bold text-plum-deep mb-2.5">{label}</div>
              <div className="h-2 rounded bg-parchment overflow-hidden mb-2">
                <div className={`h-full rounded ${color}`} style={{ width: `${pct}%` }} />
              </div>
              <div className="text-[11.5px] text-plum font-semibold">{val}</div>
            </div>
          ))}
        </div>

        <div className="bg-parchment rounded-[20px] px-[30px] py-7 mb-6">
          <div className="flex gap-4 items-start">
            <div className="w-[42px] h-[42px] rounded-xl bg-wine text-cream flex items-center justify-center flex-shrink-0">
              <IconNote width={19} height={19} />
            </div>
            <div>
              <h3 className="text-base mb-2">In plain words</h3>
              <p className="text-sm leading-relaxed text-plum">
                Falling oestrogen is affecting your body's temperature control, which is why the heat hits hardest
                at night and breaks your sleep. This is one of the most common early signs of perimenopause — and
                it's very manageable once a doctor knows about it.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3.5">
          <Link to="/doctor" className="flex-1 bg-white border border-line rounded-2xl p-6 flex flex-col gap-3 hover:-translate-y-1 hover:shadow-premium transition-all">
            <div className="w-[38px] h-[38px] rounded-[11px] bg-parchment text-wine flex items-center justify-center"><IconPin width={17} height={17} /></div>
            <h3 className="text-[15px]">Find a doctor nearby</h3>
            <p className="text-[12.5px] text-plum leading-relaxed">3 verified gynaecologists within 4 km, with this summary ready to share.</p>
          </Link>
          <Link to="/family" className="flex-1 bg-white border border-line rounded-2xl p-6 flex flex-col gap-3 hover:-translate-y-1 hover:shadow-premium transition-all">
            <div className="w-[38px] h-[38px] rounded-[11px] bg-parchment text-wine flex items-center justify-center"><IconHeart width={17} height={17} /></div>
            <h3 className="text-[15px]">Share with family</h3>
            <p className="text-[12.5px] text-plum leading-relaxed">Send a plain-language card so they understand what you're going through.</p>
          </Link>
          <Link to="/dashboard" className="flex-1 bg-white border border-line rounded-2xl p-6 flex flex-col gap-3 hover:-translate-y-1 hover:shadow-premium transition-all">
            <div className="w-[38px] h-[38px] rounded-[11px] bg-parchment text-wine flex items-center justify-center"><IconRefresh width={17} height={17} /></div>
            <h3 className="text-[15px]">Not now</h3>
            <p className="text-[12.5px] text-plum leading-relaxed">Skip for today — Saathi will check in again tomorrow.</p>
          </Link>
        </div>
      </div>
    </div>
  )
}
