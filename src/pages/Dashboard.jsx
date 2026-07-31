import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Doughnut, Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
} from 'chart.js'
import AppNav from '../components/AppNav'
import Waveform from '../components/Waveform'
import { IconMic, IconNote, IconHeart, IconCheckDoc, IconPin } from '../components/Icons'

ChartJS.register(ArcElement, Tooltip, CategoryScale, LinearScale, PointElement, LineElement, Filler)

const WINE = '#6D2E46'
const ROSE = '#A26769'
const ROSE_LIGHT = '#C99B96'
const PARCHMENT_DEEP = '#E1D3BC'
const INK = '#3A2530'

const gaugeData = {
  datasets: [
    {
      data: [33, 33, 34],
      backgroundColor: [PARCHMENT_DEEP, ROSE, WINE],
      borderWidth: 0,
      circumference: 180,
      rotation: 270,
      cutout: '75%',
    },
  ],
}
const gaugeOptions = { responsive: false, plugins: { legend: { display: false }, tooltip: { enabled: false } } }

const trendData = {
  labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
  datasets: [
    {
      label: 'Hot flashes',
      data: [3, 5, 4, 7],
      borderColor: WINE,
      backgroundColor: 'rgba(109,46,70,0.08)',
      fill: true,
      tension: 0.4,
      pointBackgroundColor: WINE,
      pointRadius: 4,
      borderWidth: 2.5,
    },
    {
      label: 'Sleep disruption',
      data: [2, 3, 3, 5],
      borderColor: ROSE_LIGHT,
      backgroundColor: 'rgba(201,155,150,0.08)',
      fill: true,
      tension: 0.4,
      pointBackgroundColor: ROSE_LIGHT,
      pointRadius: 4,
      borderWidth: 2.5,
    },
  ],
}
const trendOptions = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: { legend: { display: false } },
  scales: {
    y: { beginAtZero: true, grid: { color: 'rgba(74,53,64,0.08)' }, ticks: { color: INK, font: { family: 'Manrope', size: 11 } } },
    x: { grid: { display: false }, ticks: { color: INK, font: { family: 'Manrope', size: 11 } } },
  },
}

export default function Dashboard() {
  const [mode, setMode] = useState('text')

  return (
    <div>
      <AppNav backTo="/" backLabel="Back to site" avatar />
      <div className="max-w-[1180px] mx-auto px-8 pt-11 pb-[90px]">
        <div className="flex justify-between items-end mb-[34px] flex-wrap gap-4">
          <div>
            <h1 className="text-[30px]">Namaste, Meera</h1>
            <p className="mt-1.5 text-sm text-plum">Here's how you've been doing this week.</p>
          </div>
          <div className="bg-white border border-line rounded-full px-[18px] py-2.5 text-[13px] font-bold text-wine">
            Thursday, 30 July
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.35fr_1fr] gap-6">
          <div>
            <div className="card mb-6">
              <div className="text-[12.5px] font-extrabold uppercase tracking-[0.07em] text-rose mb-1">Check in</div>
              <div className="font-display text-xl text-plum-deep mb-5">How are you feeling today?</div>

              <div className="flex gap-2 bg-parchment rounded-full p-1 mb-[22px] w-fit">
                <button
                  onClick={() => setMode('text')}
                  className={`flex items-center gap-1.5 px-5 py-2.5 rounded-full text-[13.5px] font-bold transition-all ${mode === 'text' ? 'bg-wine text-cream' : 'text-plum'}`}
                >
                  <IconNote width={14} height={14} /> Text
                </button>
                <button
                  onClick={() => setMode('voice')}
                  className={`flex items-center gap-1.5 px-5 py-2.5 rounded-full text-[13.5px] font-bold transition-all ${mode === 'voice' ? 'bg-wine text-cream' : 'text-plum'}`}
                >
                  <IconMic width={14} height={14} /> Voice
                </button>
              </div>

              {mode === 'text' ? (
                <div>
                  <textarea
                    placeholder="Type how you've been feeling — e.g. 'Aajkal raat ko bahut garmi lagti hai, neend nahi aati...'"
                    className="w-full min-h-[96px] border-[1.5px] border-line rounded-2xl p-4 text-[14.5px] text-plum-deep bg-cream resize-none focus:outline-none focus:border-wine"
                  />
                  <div className="flex justify-between items-center mt-3.5">
                    <span className="text-[12.5px] text-plum bg-parchment px-3 py-1.5 rounded-full">Hindi · English · Hinglish</span>
                    <Link to="/checkin" className="bg-wine text-cream px-[22px] py-2.5 rounded-full font-bold text-[13.5px] hover:bg-wine-light">
                      Send
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center text-center py-3.5">
                  <Link to="/checkin" className="relative w-[78px] h-[78px] rounded-full bg-wine text-cream flex items-center justify-center mb-4.5 shadow-[0_0_0_8px_rgba(109,46,70,0.08)] mic-ripple">
                    <IconMic width={26} height={26} />
                  </Link>
                  <Waveform count={20} small />
                  <p className="text-[13.5px] text-plum max-w-[280px] leading-relaxed">
                    Tap the mic and speak naturally — in Hindi, English, or Hinglish. Saathi is listening.
                  </p>
                </div>
              )}
            </div>

            <div className="card">
              <div className="text-[12.5px] font-extrabold uppercase tracking-[0.07em] text-rose mb-1">Recent conversation</div>
              <div className="font-display text-xl text-plum-deep mb-5">Yesterday, 9:42 PM</div>
              <div className="rounded-2xl px-4 py-3.5 text-[13.8px] leading-relaxed max-w-[88%] mb-3 ml-auto bg-parchment text-plum-deep rounded-br-[4px]">
                <span className="block text-[10.5px] font-extrabold uppercase tracking-[0.06em] opacity-60 mb-1.5">You said</span>
                Bahut garmi lagti hai raat ko, aur neend puri nahi hoti aajkal.
              </div>
              <div className="rounded-2xl px-4 py-3.5 text-[13.8px] leading-relaxed max-w-[88%] bg-plum-deep text-cream rounded-bl-[4px]">
                <span className="block text-[10.5px] font-extrabold uppercase tracking-[0.06em] opacity-60 mb-1.5">Saathi</span>
                That sounds like night sweats disrupting your sleep — a common early sign. I've logged it and
                added one point to your weekly trend. Want a simple explanation of why this happens?
              </div>
            </div>
          </div>

          <div>
            <div className="card mb-6">
              <div className="flex justify-between items-start mb-0.5">
                <div>
                  <div className="text-[12.5px] font-extrabold uppercase tracking-[0.07em] text-rose mb-1">This week</div>
                  <div className="font-display text-xl text-plum-deep">MRS Risk Score</div>
                </div>
                <div className="text-[11px] font-bold text-wine bg-parchment px-3 py-1.5 rounded-full whitespace-nowrap mt-0.5">
                  ▲ +2 vs last wk
                </div>
              </div>
              <div className="relative flex justify-center mt-[18px] mb-2.5">
                <Doughnut data={gaugeData} options={gaugeOptions} width={200} height={128} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[42%] text-center">
                  <div className="font-display text-[32px] leading-none text-plum-deep">
                    14<span className="text-sm text-plum font-semibold ml-0.5">/ 44</span>
                  </div>
                  <div className="inline-block mt-2.5 bg-rose text-cream text-[11px] font-bold px-[15px] py-1 rounded-full">
                    Moderate
                  </div>
                </div>
              </div>
              <div className="flex justify-center gap-5 mt-0.5 text-[11px] text-plum font-semibold">
                <span><span className="inline-block w-[7px] h-[7px] rounded-full bg-parchment-deep opacity-45 mr-1.5 align-middle" />Low</span>
                <span><span className="inline-block w-[7px] h-[7px] rounded-full bg-rose mr-1.5 align-middle shadow-[0_0_0_3px_rgba(162,103,105,0.16)]" />Moderate</span>
                <span><span className="inline-block w-[7px] h-[7px] rounded-full bg-wine opacity-45 mr-1.5 align-middle" />High</span>
              </div>
              <p className="mt-[18px] pt-4 border-t border-line text-[12.5px] leading-relaxed text-plum">
                Mainly driven by sleep disruption and hot flashes this week.{' '}
                <Link to="/report" className="text-wine font-bold whitespace-nowrap">See full breakdown →</Link>
              </p>
            </div>

            <div className="card">
              <div className="text-[12.5px] font-extrabold uppercase tracking-[0.07em] text-rose mb-1">Quick actions</div>
              <div className="font-display text-xl text-plum-deep mb-5">Next step</div>
              <div className="flex flex-col gap-2.5">
                <Link to="/doctor" className="flex items-center gap-3 p-3.5 rounded-2xl bg-cream border border-line hover:border-wine">
                  <span className="w-[34px] h-[34px] rounded-[10px] bg-parchment text-wine flex items-center justify-center flex-shrink-0"><IconPin width={16} height={16} /></span>
                  <div>
                    <div className="text-[13px] font-bold text-plum-deep">Find a doctor nearby</div>
                    <div className="text-[11.5px] text-plum mt-0.5">3 verified gynaecologists within 4 km</div>
                  </div>
                </Link>
                <Link to="/family" className="flex items-center gap-3 p-3.5 rounded-2xl bg-cream border border-line hover:border-wine">
                  <span className="w-[34px] h-[34px] rounded-[10px] bg-parchment text-wine flex items-center justify-center flex-shrink-0"><IconHeart width={16} height={16} /></span>
                  <div>
                    <div className="text-[13px] font-bold text-plum-deep">Share with family</div>
                    <div className="text-[11.5px] text-plum mt-0.5">Send this week's card</div>
                  </div>
                </Link>
                <Link to="/report" className="flex items-center gap-3 p-3.5 rounded-2xl bg-cream border border-line hover:border-wine">
                  <span className="w-[34px] h-[34px] rounded-[10px] bg-parchment text-wine flex items-center justify-center flex-shrink-0"><IconCheckDoc width={16} height={16} /></span>
                  <div>
                    <div className="text-[13px] font-bold text-plum-deep">View full report</div>
                    <div className="text-[11.5px] text-plum mt-0.5">Plain-language summary</div>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          <div className="card lg:col-span-2">
            <div className="text-[12.5px] font-extrabold uppercase tracking-[0.07em] text-rose mb-1">Symptom trend</div>
            <div className="font-display text-xl text-plum-deep mb-5">Hot flashes &amp; sleep disruption — last 4 weeks</div>
            <Line data={trendData} options={trendOptions} height={80} />
            <div className="flex gap-[18px] mt-3.5">
              <div className="flex items-center gap-1.5 text-xs text-plum"><span className="w-[9px] h-[9px] rounded-full bg-wine" />Hot flashes</div>
              <div className="flex items-center gap-1.5 text-xs text-plum"><span className="w-[9px] h-[9px] rounded-full bg-rose-light" />Sleep disruption</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
