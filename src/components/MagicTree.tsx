import { QRCodeSVG } from 'qrcode.react';
import { AppState } from '../types/detection';
import { ExperienceConfig } from '../config/experienceConfig';
import { cn } from '../lib/utils';
import { ThemeColor } from '../App';

interface MagicTreeProps {
  state: AppState;
  config: ExperienceConfig;
  activeTheme: ThemeColor;
  season: 'spring' | 'summer' | 'autumn';
  isManualQR: boolean;
  onToggleQR: () => void;
}

const SEASON_IMAGES = {
  spring: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBsK_8TkmYfzMNfRqHKLIUhm8-8o9WsbTTz9uC7yumaAZrIgQBgSCg0nmBX8_LwLT-hN9Qi6nsMBeGRKJ0WQXtQM1--5oIGSpta8XHl3duJIh-UV6gqvTxBLkH1p1lNWJscIDWBVD8zXJUo6I0R8ORkmXHJUz2iu39YlExt59Y2MajhAPsPQvqbkMxdEblwbgN57wbYvR7BJ_LvdBwInzgkyn2lF99mS7T6tcs_S0VA1yixFR9DGGQFGhYTSxUFNxJo0g',
  summer: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCmzC92_GzvCS7wh0zhWoUL7mny66fDYae1BNUMwWPSUxsfKRPyG9g4PTwgm8neey4BTg-lqk-VtCGhdwB5ybTxvVVfuJu7tYLMo8tXBj0luV7GSyKFBqB3i4SWF5RMTB3KApUepRKeGEsULaNDQ0XcHRr6hAEq1Gx28wJ6iWbr0DQSac6CCN8qPzkqr4MqIm1DutB7pAOH-xpAq5Zb8IpYuyz-4RAKvQuOP_WNCJQPHVIN4E687_8PlK_WXRpVUJjxhw',
  autumn: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBjutalJu9fx6d-xBHiunjHeJml4qDdDa_fi59hlvBCnICbGqn6eQEEQvwVKIzmouq29HVV9f2u4uGR7Qm9T2x0i7bSe35HlN_PV1GmcKkMOdKTVagSZLOYYq80k6WI1Oo5watpINoGch49915sbsN-floxb_EVW3PO92FSYJLAn16T4XVBEEdmUAUtRG0Rr-pqNNahRYMkxt_KAZ_p0S5MuU02iUXJnJe1MDzqnT2NNhEKYUzDNKI64d4kMLp_z55f2g'
};

const SEASON_FILTERS = {
  spring: 'none',
  summer: 'none',
  autumn: 'hue-rotate(-55deg) saturate(1.85) brightness(1.12) contrast(1.04)'
};

export function MagicTree({ state, config, activeTheme, season, isManualQR, onToggleQR }: MagicTreeProps) {
  const qrMode = isManualQR || state === 'QR_REVEALED' || state === 'WAITING_FOR_PHONE_REMOVAL';
  const isGlowing = state === 'PHONE_DETECTED' || state === 'TREE_ACTIVATING';

  let treeImage = SEASON_IMAGES.spring;
  let treeFilter = activeTheme.filter;
  let petalColor = activeTheme.petalColor;
  let petalOpacity = 0.8;

  if (season === 'summer') {
    treeImage = SEASON_IMAGES.summer;
    treeFilter = SEASON_FILTERS.summer;
    petalColor = '#86efac';
    petalOpacity = 0.5;
  } else if (season === 'autumn') {
    treeImage = SEASON_IMAGES.autumn;
    treeFilter = SEASON_FILTERS.autumn;
    petalColor = '#F59E0B';
    petalOpacity = 0.85;
  }

  return (
    <>
      <div aria-hidden="true" className={cn("pointer-events-none fixed inset-0 z-0 overflow-hidden transition-opacity duration-500", qrMode ? "opacity-0" : "opacity-100")} id="petals-layer">
        <div className="petal" style={{ left: '12%', width: '13px', height: '9px', animationDuration: '9s', animationDelay: '0s', backgroundColor: petalColor, opacity: petalOpacity }}></div>
        <div className="petal" style={{ left: '26%', width: '10px', height: '7px', animationDuration: '11.5s', animationDelay: '2.2s', backgroundColor: petalColor, opacity: petalOpacity }}></div>
        <div className="petal" style={{ left: '42%', width: '15px', height: '11px', animationDuration: '8.5s', animationDelay: '4.1s', backgroundColor: petalColor, opacity: petalOpacity }}></div>
        <div className="petal" style={{ left: '65%', width: '11px', height: '8px', animationDuration: '10.5s', animationDelay: '1.2s', backgroundColor: petalColor, opacity: petalOpacity }}></div>
        <div className="petal" style={{ left: '80%', width: '14px', height: '10px', animationDuration: '9.2s', animationDelay: '3.6s', backgroundColor: petalColor, opacity: petalOpacity }}></div>
        <div className="petal" style={{ left: '92%', width: '9px', height: '7px', animationDuration: '12.8s', animationDelay: '5.3s', backgroundColor: petalColor, opacity: petalOpacity }}></div>
      </div>

      {season === 'autumn' && (
        <div aria-hidden="true" className={cn("pointer-events-none fixed inset-0 z-0 overflow-hidden transition-opacity duration-500", qrMode ? "opacity-0" : "opacity-100")} id="rain-layer">
          <div className="raindrop" style={{ left: '18%', animationDuration: '1.1s', animationDelay: '0s' }}></div>
          <div className="raindrop" style={{ left: '28%', animationDuration: '0.9s', animationDelay: '0.3s' }}></div>
          <div className="raindrop" style={{ left: '39%', animationDuration: '1.2s', animationDelay: '0.7s' }}></div>
          <div className="raindrop" style={{ left: '52%', animationDuration: '0.95s', animationDelay: '0.1s' }}></div>
          <div className="raindrop" style={{ left: '63%', animationDuration: '1.15s', animationDelay: '0.5s' }}></div>
          <div className="raindrop" style={{ left: '74%', animationDuration: '1.05s', animationDelay: '0.2s' }}></div>
          <div className="raindrop" style={{ left: '86%', animationDuration: '1.25s', animationDelay: '0.6s' }}></div>
        </div>
      )}

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-2">
        <div className="relative flex flex-col items-center justify-center cursor-pointer group" onClick={onToggleQR}>
          <div className="relative w-[340px] sm:w-[440px] md:w-[500px] h-[340px] sm:h-[440px] md:h-[500px] flex items-center justify-center">
            
            <div
              className={cn(
                "absolute inset-0 flex items-center justify-center transition-all duration-300 group-hover:scale-[1.02]",
                qrMode ? "opacity-0 scale-95 pointer-events-none blur-sm" : "opacity-100 scale-100 blur-0",
                isGlowing && "drop-shadow-[0_0_20px_rgba(244,167,185,0.7)] scale-105"
              )}
            >
              <img 
                alt="Tree Base" 
                className="view-fade absolute max-w-full max-h-full object-contain select-none" 
                src={treeImage} 
                style={{ filter: treeFilter }} 
              />
              <img 
                alt="Tree Canopy" 
                className="view-fade absolute max-w-full max-h-full object-contain select-none canopy-animated" 
                src={treeImage} 
                style={{ filter: treeFilter }} 
              />
            </div>

            <div 
              className={cn(
                "absolute inset-0 flex items-center justify-center transition-all duration-700",
                qrMode ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
              )}
            >
              <div className="bg-white/95 backdrop-blur-md p-6 rounded-3xl shadow-xl flex flex-col items-center border border-stone-200">
                <QRCodeSVG 
                  value={config.qrValue || 'https://icqr.com'} 
                  size={200} 
                  fgColor={activeTheme.petalColor} 
                  bgColor="transparent" 
                  level="H" 
                />
                <div className="mt-4 text-center">
                  <h3 className="text-stone-800 font-bold text-lg leading-tight">{config.title}</h3>
                  <p className="text-stone-500 text-xs font-medium mt-1">{config.subtitle}</p>
                </div>
              </div>
            </div>
          </div>

          <button 
            className="mt-2 inline-flex items-center justify-center px-5 py-1.5 rounded-full bg-[#EAE5DA]/70 hover:bg-[#E2DDD1] border border-stone-300/80 text-xs font-normal text-stone-600 shadow-2xs transition-all duration-200" 
            type="button"
          >
            {qrMode ? 'Tap to see the tree' : 'Tap the tree to see QR code'}
          </button>
        </div>
      </main>
    </>
  );
}
