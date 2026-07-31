import { useState } from 'react'
import AppNav from '../components/AppNav'

const DOCTORS = [
  { name: 'Dr. Ritu Malhotra', meta: 'MBBS, MS · 14 yrs practice', place: "Fortina Women's Hospital", km: '1.8 km', slot: 'Next slot: today, 6 PM' },
  { name: 'Dr. Sunita Rao', meta: 'MBBS, DGO · 21 yrs practice', place: 'City Care Clinic', km: '3.1 km', slot: 'Next slot: tomorrow, 11 AM' },
  { name: 'Dr. Anjali Kapoor', meta: 'MBBS, MS · 9 yrs practice', place: 'Sanjeevani Hospital', km: '3.9 km', slot: 'Next slot: Fri, 4 PM' },
]

export default function Doctor() {
  const [tab, setTab] = useState('doctors')

  return (
    <div>
      <AppNav backTo="/report" backLabel="Back to summary" avatar />
      <div className="max-w-[1000px] mx-auto px-8 pt-[50px] pb-[90px]">
        <p className="eyebrow">Get care</p>
        <h2 className="text-[28px] my-2.5">Verified care near you</h2>
        <p className="text-[14.5px] text-plum mb-[26px]">
          Every listing is registration-checked — number, hospital, and years in practice, before they ever appear
          here.
        </p>

        <div className="flex gap-2 bg-parchment rounded-full p-1 w-fit mb-[30px]">
          <button
            onClick={() => setTab('doctors')}
            className={`px-5 py-2.5 rounded-full text-[13.5px] font-bold transition-all ${tab === 'doctors' ? 'bg-wine text-cream' : 'text-plum'}`}
          >
            Gynaecologists
          </button>
          <button
            onClick={() => setTab('asha')}
            className={`px-5 py-2.5 rounded-full text-[13.5px] font-bold transition-all ${tab === 'asha' ? 'bg-wine text-cream' : 'text-plum'}`}
          >
            ASHA / ANM worker
          </button>
        </div>

        {tab === 'doctors' ? (
          <div className="flex flex-col gap-3.5">
            {DOCTORS.map((d) => (
              <div key={d.name} className="bg-white border border-line rounded-2xl p-[22px] flex flex-wrap items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-parchment text-wine flex items-center justify-center font-display text-xl flex-shrink-0">DR</div>
                <div className="flex-1 min-w-[200px]">
                  <h3 className="text-base mb-1">{d.name}</h3>
                  <div className="text-[12.5px] text-plum flex gap-3.5 flex-wrap">
                    <span className="text-[10.5px] font-extrabold uppercase tracking-[0.05em] bg-parchment text-wine px-2.5 py-1 rounded-full">Verified</span>
                    <span>{d.meta}</span>
                    <span>{d.place}</span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="font-display text-xl text-plum-deep">{d.km}</div>
                  <div className="text-[11px] text-plum">{d.slot}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-line rounded-2xl p-8 text-center text-plum text-sm">
            ASHA / ANM worker directory for your area is being set up.
          </div>
        )}
      </div>
    </div>
  )
}
