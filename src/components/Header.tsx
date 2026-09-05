export function Header() {
  return (
    <header className="relative z-10 flex items-start justify-between w-full px-8 pt-7">
      <div className="flex flex-col items-start gap-1">
        <div className="relative p-2 inline-block">
          <span className="absolute top-0 left-0 w-3 h-3 border-t-[2.5px] border-l-[2.5px] border-[#F2B90F]"></span>
          <span className="absolute top-0 right-0 w-3 h-3 border-t-[2.5px] border-r-[2.5px] border-[#F2B90F]"></span>
          <span className="absolute bottom-0 left-0 w-3 h-3 border-b-[2.5px] border-l-[2.5px] border-[#F2B90F]"></span>
          <span className="absolute bottom-0 right-0 w-3 h-3 border-b-[2.5px] border-r-[2.5px] border-[#F2B90F]"></span>
          <div className="icqr-dots select-none">
            <span>I</span><span>C</span><span>Q</span><span>R</span>
          </div>
        </div>
        
        <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#EAB308] text-stone-900 text-[11px] font-medium shadow-xs transition-colors duration-150">
          <svg className="w-3 h-3 text-stone-900" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round"></path>
            <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" strokeLinecap="round" strokeLinejoin="round"></path>
          </svg>
          <span>I see QR</span>
          <span className="text-[9px] font-bold">›</span>
        </div>
      </div>
      
      <button 
        aria-label="Information" 
        className="w-7 h-7 flex items-center justify-center rounded-full text-stone-600 hover:text-stone-900 border border-stone-400/80 hover:border-stone-700 transition-colors duration-150 bg-transparent text-sm font-serif italic" 
        type="button"
      >
        i
      </button>
    </header>
  );
}
