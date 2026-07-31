import { Link } from 'react-router-dom'
import Nav from '../components/Nav'
import Waveform from '../components/Waveform'
import { IconMic, IconNote, IconPin, IconHeart } from '../components/Icons'

export default function Landing() {
  return (
    <div>
      <Nav />

      <section className="pt-24 pb-[70px] overflow-hidden">
        <div className="max-w-[1180px] mx-auto px-8 grid grid-cols-1 md:grid-cols-[1.05fr_0.95fr] gap-14 items-center">
          <div>
            <p className="eyebrow">Voice-first · For Indian women 45+</p>
            <h1 className="text-[40px] md:text-[56px] leading-[1.06] my-[18px]">
              Menopause shouldn't
              <br />
              be a <span className="text-wine">silent struggle.</span>
            </h1>
            <p className="text-lg leading-relaxed text-plum max-w-[480px] mb-8">
              No tracker, no checklist. Say what you're feeling the way you'd say it to a friend — Saathi turns
              it into a real symptom score and a next step you can act on.
            </p>
            <div className="flex gap-3.5 items-center flex-wrap">
              <Link to="/auth?mode=signup" className="btn-primary">Get Started</Link>
              <a href="#how" className="btn-ghost">See how it works</a>
            </div>
            <p className="mt-6 text-[13.5px] font-semibold text-rose">Speaks Hindi, English &amp; Hinglish. Takes under 2 minutes.</p>
          </div>

          <div className="relative bg-plum-deep rounded-[28px] p-9 shadow-premium text-cream overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(162,103,105,0.35),transparent_55%)]" />
            <div className="relative flex justify-between items-center mb-[34px]">
              <span className="text-[11.5px] font-bold tracking-[0.08em] uppercase text-rose-light bg-white/5 px-3 py-1.5 rounded-full">
                Live check-in
              </span>
              <span className="flex items-center gap-1.5 text-[12.5px] text-[#D9C3BE]">
                <span className="w-[7px] h-[7px] rounded-full bg-[#7FBF8E] pulse-dot" /> Listening…
              </span>
            </div>
            <div className="relative mb-[22px]">
              <Waveform count={34} minH={14} maxH={90} />
            </div>
            <div className="relative bg-white/5 border border-white/10 rounded-2xl px-5 py-[18px] font-display italic text-[15.5px] leading-relaxed text-[#EFE2DA]">
              "Aajkal raat ko bahut garmi lagti hai, neend nahi aati…"
            </div>
            <p className="relative mt-3.5 text-[12.5px] text-[#B99AA0]">
              — what a woman actually says, instead of ticking a symptom checklist
            </p>
          </div>
        </div>
      </section>

      <section className="bg-plum-deep py-[52px]">
        <div className="max-w-[1180px] mx-auto px-8 grid grid-cols-1 md:grid-cols-3 gap-7">
          <div>
            <div className="font-display text-[44px] font-semibold text-rose-light">120M+</div>
            <p className="mt-2.5 text-[14.5px] leading-relaxed text-[#C9B7BC] max-w-[280px]">
              Indian women will go through menopause in the next decade
            </p>
          </div>
          <div className="md:border-l border-white/10 md:pl-7">
            <div className="font-display text-[44px] font-semibold text-cream">Late</div>
            <p className="mt-2.5 text-[14.5px] leading-relaxed text-[#C9B7BC] max-w-[280px]">
              Most women only notice something's wrong once symptoms turn severe
            </p>
          </div>
          <div className="md:border-l border-white/10 md:pl-7">
            <div className="font-display text-[44px] font-semibold text-cream">Silent</div>
            <p className="mt-2.5 text-[14.5px] leading-relaxed text-[#C9B7BC] max-w-[280px]">
              No family or social conversation around it — unlike pregnancy
            </p>
          </div>
        </div>
      </section>

      <section className="bg-parchment py-[104px]" id="about">
        <div className="max-w-[1180px] mx-auto px-8">
          <div className="max-w-[600px] mb-14">
            <p className="eyebrow">About the idea</p>
            <h2 className="text-[38px] leading-[1.15] mt-3.5">
              What if the app noticed
              <br />
              <span className="text-wine">before she did?</span>
            </h2>
          </div>
          <p className="text-[17px] leading-[1.75] text-plum max-w-[640px] mb-14">
            Symptoms get blamed on <b className="text-plum-deep">"stress"</b> or <b className="text-plum-deep">"just ageing,"</b> so
            real risks like osteoporosis, heart disease and depression get caught too late. Saathi turns an
            everyday conversation into a real clinical signal — built on the Menopause Rating Scale, not guesswork.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 relative">
            <div className="absolute top-[19px] left-[19px] right-[19px] h-px bg-[repeating-linear-gradient(90deg,#A26769_0_6px,transparent_6px_12px)] z-[1] hidden md:block" />
            {[
              ['1', 'She speaks', 'Casually, in her own language — no checklist, no form.'],
              ['2', 'AI understands', 'Everyday words are mapped to real medical symptoms.'],
              ['3', 'Risk is scored', 'A clinical Menopause Rating Scale score is generated.'],
              ['4', 'She is guided', 'Plain-language guidance, family card, or a doctor referral.'],
            ].map(([n, title, desc]) => (
              <div key={n} className="pr-[22px] first:pl-0 mb-6 md:mb-0">
                <div className="relative z-[2] w-[38px] h-[38px] rounded-full border-[1.5px] border-wine bg-parchment text-wine font-display text-[15px] font-semibold flex items-center justify-center mb-[18px]">
                  {n}
                </div>
                <div className="font-extrabold text-[15.5px] text-plum-deep mb-2">{title}</div>
                <div className="text-sm leading-relaxed text-plum">{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="py-[104px]">
        <div className="max-w-[1180px] mx-auto px-8">
          <div className="max-w-[600px] mb-14">
            <p className="eyebrow">Features</p>
            <h2 className="text-[38px] leading-[1.15] mt-3.5">
              Everything happens
              <br />
              <span className="text-wine">around the conversation.</span>
            </h2>
            <p className="mt-4 text-base text-plum leading-relaxed">
              No dashboards to learn, no jargon to decode — just a companion that meets you where you are.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              [IconMic, 'Talk, don\u2019t type', 'Say it the way you\u2019d tell a friend. Saathi converts that into a real Menopause Rating Scale score — no checklist in between.'],
              [IconNote, 'Explain it simply', 'A 30-second voice note tells you what\u2019s actually going on in your body, in words you\u2019d use — not a clinical printout.'],
              [IconPin, 'Bridge to real care', 'Finds a verified gynaecologist near you and hands them a ready-made summary, so your 5-minute visit isn\u2019t spent explaining from scratch.'],
              [IconHeart, 'A card for family', 'One tap sends a plain-language card to your husband, daughter, or sister — the conversation your family never had a way to start.'],
            ].map(([Icon, title, desc]) => (
              <div key={title} className="card hover:-translate-y-1 hover:shadow-premium transition-all">
                <div className="w-[46px] h-[46px] rounded-[13px] bg-parchment text-wine flex items-center justify-center mb-5">
                  <Icon width={20} height={20} />
                </div>
                <h3 className="font-sans text-[17px] font-bold text-plum-deep mb-2">{title}</h3>
                <p className="text-[13.8px] leading-relaxed text-plum">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-plum-deep text-cream py-[104px]" id="how">
        <div className="max-w-[1180px] mx-auto px-8">
          <div className="max-w-[600px] mb-14">
            <p className="eyebrow text-rose-light">How it works</p>
            <h2 className="text-[38px] leading-[1.15] mt-3.5 text-cream">
              From a two-minute chat
              <br />
              <span className="text-rose-light">to a plan you can use.</span>
            </h2>
            <p className="mt-4 text-base text-[#C9B7BC] leading-relaxed">Four steps, start to finish — no account setup marathon.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              ['01', 'Open & check in', 'Choose voice or text and describe how you\u2019ve been feeling, in your own words.'],
              ['02', 'Get your score', 'Saathi maps what you said to the clinical Menopause Rating Scale, instantly.'],
              ['03', 'Understand why', 'A short voice note explains what\u2019s happening — plus a card to share with family.'],
              ['04', 'Take the next step', 'Book a verified gynaecologist nearby, or reach the closest ASHA worker.'],
            ].map(([n, title, desc]) => (
              <div key={n} className="bg-white/[0.04] border border-white/[0.09] rounded-[20px] p-[22px]">
                <div className="w-[38px] h-[38px] rounded-full border-[1.5px] border-rose-light text-rose-light font-display text-[15px] font-semibold flex items-center justify-center mb-[22px]">
                  {n}
                </div>
                <h3 className="text-cream text-[16.5px] font-bold mb-2.5">{title}</h3>
                <p className="text-[#BFA9AF] text-[13.5px] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-cream py-[104px]" id="why">
        <div className="max-w-[1180px] mx-auto px-8">
          <div className="max-w-[600px] mb-14">
            <p className="eyebrow">Why Saathi</p>
            <h2 className="text-[38px] leading-[1.15] mt-3.5">
              Not just another
              <br />
              <span className="text-wine">tracker app.</span>
            </h2>
          </div>

          {[
            ['Period/symptom tracker with English-only forms.', 'Voice-first and vernacular — works even for low digital-literacy users.'],
            ['Just a medical chatbot or FAQ page.', 'Actively destigmatizes menopause inside the family — not just for the user.'],
            ['"Cute" UX with no real medical grounding.', 'Built on a real clinical scale — the Menopause Rating Scale (MRS).'],
          ].map(([typical, saathi], i) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-4 bg-white border border-line rounded-[18px] overflow-hidden">
              <div className="p-[26px] pl-6 border-l-4 border-rose bg-parchment-deep">
                <span className="text-[11px] font-extrabold tracking-[0.08em] uppercase mb-2.5 flex items-center gap-2 text-wine-light">
                  <span className="w-[19px] h-[19px] rounded-full bg-rose text-white flex items-center justify-center text-[11px] font-extrabold">✕</span>
                  Typical app
                </span>
                <p className="text-[14.5px] leading-snug text-ink font-semibold">{typical}</p>
              </div>
              <div className="p-[26px] pl-6 border-l-4 border-wine bg-gradient-to-b from-wine/[0.05] to-wine/[0.02]">
                <span className="text-[11px] font-extrabold tracking-[0.08em] uppercase mb-2.5 flex items-center gap-2 text-wine">
                  <span className="w-[19px] h-[19px] rounded-full bg-wine text-cream flex items-center justify-center text-[11px] font-extrabold">✓</span>
                  Saathi
                </span>
                <p className="text-[14.5px] leading-snug text-plum-deep font-semibold">{saathi}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-parchment py-[104px]">
        <div className="max-w-[1180px] mx-auto px-8 grid grid-cols-1 md:grid-cols-2 gap-[60px] items-center">
          <div>
            <p className="eyebrow">Get started</p>
            <h2 className="text-[34px] my-3.5">
              Your dashboard, <span className="text-wine">the moment you sign in.</span>
            </h2>
            <p className="text-base text-plum leading-relaxed mb-[30px] max-w-[440px]">
              Check in by voice or text, watch your symptom trend over time, and get routed to the right kind of
              help — all from one screen.
            </p>
            <div className="flex gap-3.5 items-center flex-wrap">
              <Link to="/auth?mode=signup" className="btn-primary">Get Started →</Link>
              <Link to="/dashboard" className="btn-ghost">Peek at the dashboard</Link>
            </div>
          </div>
          <div className="bg-white rounded-[22px] shadow-premium border border-line p-[22px]">
            <div className="flex gap-1.5 mb-4">
              <span className="w-[9px] h-[9px] rounded-full bg-parchment-deep" />
              <span className="w-[9px] h-[9px] rounded-full bg-parchment-deep" />
              <span className="w-[9px] h-[9px] rounded-full bg-parchment-deep" />
            </div>
            <div className="bg-cream rounded-[14px] p-[18px] mb-3 border border-line">
              <div className="text-[11px] font-extrabold text-rose uppercase tracking-[0.06em] mb-2">Today's check-in</div>
              <div className="flex gap-2">
                <div className="flex-1 bg-wine text-cream rounded-full py-2 text-center text-xs font-bold">Voice</div>
                <div className="flex-1 bg-white border border-line rounded-full py-2 text-center text-xs font-bold text-plum">Text</div>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-1 bg-cream rounded-[14px] p-[18px] border border-line">
                <div className="text-[11px] font-extrabold text-rose uppercase tracking-[0.06em] mb-2.5">MRS Score</div>
                <div className="font-display text-[26px] text-plum-deep">Moderate</div>
              </div>
              <div className="flex-1 bg-cream rounded-[14px] p-[18px] border border-line">
                <div className="text-[11px] font-extrabold text-rose uppercase tracking-[0.06em] mb-2.5">4-week trend</div>
                <div className="flex items-end gap-[5px] h-[54px]">
                  {[40, 55, 35, 70, 50].map((h, i) => (
                    <div key={i} className={`flex-1 rounded-sm ${i === 3 ? 'bg-wine' : 'bg-rose-light'}`} style={{ height: `${h}%` }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-[100px]">
       
      </section>

      <footer className="bg-plum-deep text-[#B9A6AB] pt-[60px] pb-[34px]">
        <div className="max-w-[1180px] mx-auto px-8">
          <div className="flex flex-col md:flex-row justify-between items-start gap-8 pb-9 border-b border-white/[0.08]">
            <div>
              
              <p className="mt-3 text-[13.5px] max-w-[280px] leading-relaxed">
                A voice-first menopause companion for India — helping women notice, understand and act, in their
                own words.
              </p>
            </div>
           
          </div>
          <div className="pt-6 text-[12.5px] flex flex-col sm:flex-row justify-between gap-2">
            <span>© 2026 Saathi. Built for the Commudle Girls Hack Day.</span>
            <span>Made with care.</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
