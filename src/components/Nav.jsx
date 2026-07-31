export default function Nav() {
  return (
    <header className="sticky top-0 z-50 bg-plum-deep/95 backdrop-blur-md border-b border-white/10">
      <div className="max-w-[1180px] mx-auto px-8 py-[18px] flex items-center justify-between">
        <div className="font-display font-bold text-[23px] text-cream flex items-center gap-[9px]">
          <span className="w-2 h-2 rounded-full bg-rose-light" />
          Saathi
        </div>
        <nav className="hidden md:flex items-center gap-10">
          <a href="#about" className="nav-link">About Us</a>
          <a href="#features" className="nav-link">Features</a>
          <a href="#how" className="nav-link">How It Works</a>
          <a href="#why" className="nav-link">Why Saathi</a>
        </nav>
      </div>
    </header>
  )
}
