import { cn } from "../lib/utils";
import { ThemeColor } from "../App";

interface ControlsProps {
  url: string;
  setUrl: (url: string) => void;
  onShare: () => void;
  season: 'spring' | 'summer' | 'autumn';
  setSeason: (season: 'spring' | 'summer' | 'autumn') => void;
  isMuted: boolean;
  setIsMuted: (isMuted: boolean) => void;
  activeColor: string;
  setActiveColor: (color: string) => void;
  colors: ThemeColor[];
}

export function Controls({
  url, setUrl, onShare, season, setSeason, isMuted, setIsMuted, activeColor, setActiveColor, colors
}: ControlsProps) {
  return (
    <footer className="relative z-10 w-full max-w-2xl mx-auto px-4 pb-7 flex flex-col items-center gap-3.5">
      <div className="w-full flex items-center gap-2">
        <div className="relative flex-1">
          <input 
            className="w-full h-12 px-5 bg-white/95 focus:bg-white border border-stone-200/90 rounded-2xl text-stone-700 text-sm md:text-base font-normal shadow-2xs focus:ring-2 focus:ring-stone-300 focus:outline-none transition-colors" 
            id="qr-target-url" 
            spellCheck={false}
            type="text" 
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>
        <button 
          aria-label="Share or Export QR" 
          className="h-12 w-12 flex-shrink-0 flex items-center justify-center rounded-2xl bg-terracotta hover:bg-terracotta-hover text-white shadow-xs transition-colors duration-150 active:scale-95" 
          type="button"
          onClick={onShare}
        >
          <svg className="w-5 h-5 stroke-current" fill="none" strokeWidth="2.2" viewBox="0 0 24 24">
            <path d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 4v12m0-12l-4 4m4-4l4 4" strokeLinecap="round" strokeLinejoin="round"></path>
          </svg>
        </button>
      </div>

      <div className="w-full flex items-center gap-2">
        <div className="flex-1 grid grid-cols-3 gap-1 bg-[#EFE9DF]/80 p-1 rounded-2xl border border-stone-200/70">
          <button 
            className={cn(
              "flex items-center justify-center gap-1.5 py-2 px-2 text-xs md:text-sm font-medium rounded-xl transition-all duration-200",
              season === 'spring' ? "bg-sandstone text-stone-800 shadow-2xs" : "text-stone-600 hover:text-stone-900 hover:bg-stone-200/50"
            )} 
            onClick={() => setSeason('spring')}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M12 2a4 4 0 0 0-4 4 4 4 0 0 0 4 4 4 4 0 0 0 4-4 4 4 0 0 0-4-4z"></path>
              <path d="M12 14a4 4 0 0 0-4 4 4 4 0 0 0 4 4 4 4 0 0 0 4-4 4 4 0 0 0-4-4z"></path>
              <path d="M2 12a4 4 0 0 0 4 4 4 4 0 0 0 4-4 4 4 0 0 0-4-4z"></path>
              <path d="M14 12a4 4 0 0 0 4 4 4 4 0 0 0 4-4 4 4 0 0 0-4-4z"></path>
            </svg>
            <span>Spring</span>
          </button>
          <button 
            className={cn(
              "flex items-center justify-center gap-1.5 py-2 px-2 text-xs md:text-sm font-medium rounded-xl transition-all duration-200",
              season === 'summer' ? "bg-sandstone text-stone-800 shadow-2xs" : "text-stone-600 hover:text-stone-900 hover:bg-stone-200/50"
            )} 
            onClick={() => setSeason('summer')}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="4"></circle>
              <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41m14.14-14.14l-1.41 1.41" strokeLinecap="round"></path>
            </svg>
            <span>Summer</span>
          </button>
          <button 
            className={cn(
              "flex items-center justify-center gap-1.5 py-2 px-2 text-xs md:text-sm font-medium rounded-xl transition-all duration-200",
              season === 'autumn' ? "bg-sandstone text-stone-800 shadow-2xs" : "text-stone-600 hover:text-stone-900 hover:bg-stone-200/50"
            )} 
            onClick={() => setSeason('autumn')}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M19 14a4 4 0 00-1-7.87 5 5 0 00-9.8 1.62A3.5 3.5 0 005 14h14z" strokeLinecap="round" strokeLinejoin="round"></path>
              <path d="M8 18v2m4-2v3m4-3v2" strokeLinecap="round"></path>
            </svg>
            <span>Autumn</span>
          </button>
        </div>
        
        <button 
          aria-label="Toggle Sound" 
          className={cn(
            "h-11 w-11 flex-shrink-0 flex items-center justify-center rounded-2xl border shadow-2xs transition-colors",
            isMuted ? "bg-stone-300 text-stone-600 border-stone-300" : "bg-sandstone-light hover:bg-stone-200 text-stone-600 border-stone-200/60"
          )}
          onClick={() => setIsMuted(!isMuted)}
        >
          {isMuted ? (
            <svg className="w-4 h-4 stroke-current" fill="none" strokeWidth="2" viewBox="0 0 24 24">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <line x1="23" x2="17" y1="9" y2="15"></line>
              <line x1="17" x2="23" y1="9" y2="15"></line>
            </svg>
          ) : (
            <svg className="w-4 h-4 stroke-current" fill="none" strokeWidth="2" viewBox="0 0 24 24">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <path d="M15.54 8.46a5 5 0 010 7.07"></path>
              <path d="M19.07 4.93a10 10 0 010 14.14"></path>
            </svg>
          )}
        </button>
      </div>

      <div className="flex items-center justify-center gap-2.5 pt-0.5 transition-opacity duration-200">
        {colors.map((c) => (
          <button 
            key={c.main}
            aria-label={`Color ${c.main}`} 
            className={cn(
              "color-dot w-6 h-6 rounded-full transition-transform focus:outline-none hover:scale-110",
              activeColor === c.main && "swatch-ring"
            )}
            style={{ backgroundColor: c.main }}
            onClick={() => setActiveColor(c.main)}
          />
        ))}
      </div>
    </footer>
  );
}
