import AppNav from '../components/AppNav'
import { IconWhatsapp, IconSms, IconEmail } from '../components/Icons'

export default function Family() {
  return (
    <div>
      <AppNav backTo="/report" backLabel="Back to summary" avatar />
      <div className="max-w-[640px] mx-auto px-8 pt-[50px] pb-[90px] text-center">
        <p className="eyebrow">Bring them in</p>
        <h2 className="text-[26px] my-2.5">A card that starts the conversation for you.</h2>
        <p className="text-[14.5px] text-plum mb-[30px]">No numbers, no charts — just what's happening and how they can help.</p>

        <div className="relative overflow-hidden bg-plum-deep rounded-[24px] px-9 py-[38px] text-cream text-left shadow-premium mb-[26px]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_90%_10%,rgba(162,103,105,0.3),transparent_55%)]" />
          <span className="relative block text-[11px] font-extrabold uppercase tracking-[0.08em] text-rose-light mb-3.5">
            From Meera's Saathi check-in
          </span>
          <h3 className="relative text-cream text-xl mb-3">Meera's going through some tough nights lately.</h3>
          <p className="relative text-sm leading-relaxed text-[#D9C3BE]">
            She's dealing with hot flashes and disrupted sleep — common early signs of perimenopause. A bit of
            patience, and maybe a cooler room at night, would help a lot right now.
          </p>
          <p className="relative mt-5 text-[12.5px] text-[#B99AA0]">Sent privately · not a diagnosis, just context</p>
        </div>

        <div className="flex gap-3 justify-center">
          {[
            [IconWhatsapp, 'WhatsApp'],
            [IconSms, 'SMS'],
            [IconEmail, 'Email'],
          ].map(([Icon, label]) => (
            <button key={label} className="flex-1 bg-white border border-line rounded-2xl p-[18px] flex flex-col items-center gap-2 hover:border-wine">
              <span className="w-10 h-10 rounded-xl bg-parchment text-wine flex items-center justify-center"><Icon width={18} height={18} /></span>
              <span className="text-[12.5px] font-bold text-plum-deep">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
