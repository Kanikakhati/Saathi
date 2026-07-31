import { Link } from 'react-router-dom'
import { IconBack } from './Icons'

export default function AppNav({ backTo, backLabel = 'Back', avatar = false }) {
  return (
    <div className="bg-plum-deep py-[18px]">
      <div className="max-w-[1180px] mx-auto px-8 flex items-center justify-between">
        <Link to={backTo} className="flex items-center gap-1.5 text-[13.5px] font-semibold text-[#C9B7BC] hover:text-cream">
          <IconBack />
          {backLabel}
        </Link>
        <div className="font-display font-bold text-[23px] text-cream flex items-center gap-[9px]">
          <span className="w-2 h-2 rounded-full bg-wine" />
          Saathi
        </div>
        {avatar ? (
          <div className="w-[38px] h-[38px] rounded-full bg-rose flex items-center justify-center text-white font-display text-sm">
            M
          </div>
        ) : (
          <div className="w-20" />
        )}
      </div>
    </div>
  )
}
