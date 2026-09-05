import { useState, useRef, useEffect } from 'react';
import { CameraPermission } from './components/CameraPermission';
import { PhoneDetector } from './components/PhoneDetector';
import { MagicTree } from './components/MagicTree';
import { DebugPanel } from './components/DebugPanel';
import { SettingsPanel } from './components/SettingsPanel';
import { Header } from './components/Header';
import { Controls } from './components/Controls';
import { defaultConfig, ExperienceConfig } from './config/experienceConfig';
import { AppState, DetectionResult } from './types/detection';
import { audioEngine } from './services/audioEngine';

export interface ThemeColor {
  main: string;
  petalColor: string;
  filter: string;
}

export const THEME_COLORS: ThemeColor[] = [
  { main: '#E59EA9', petalColor: '#F4A7B9', filter: 'none' },
  { main: '#9B72CF', petalColor: '#C4A8E8', filter: 'hue-rotate(-60deg) saturate(1.4) brightness(1.05)' },
  { main: '#EB4444', petalColor: '#FCA5A5', filter: 'hue-rotate(340deg) saturate(1.7) brightness(1.02) contrast(1.1)' },
  { main: '#E5A93C', petalColor: '#FCD34D', filter: 'hue-rotate(70deg) saturate(1.5) brightness(1.12)' },
  { main: '#3B82F6', petalColor: '#93C5FD', filter: 'hue-rotate(200deg) saturate(1.5) brightness(1.1)' },
  { main: '#DFE7ED', petalColor: '#E2E8F0', filter: 'saturate(0.2) brightness(1.2) contrast(0.95)' },
];

export default function App() {
  const [config, setConfig] = useState<ExperienceConfig>(defaultConfig);
  const [state, setState] = useState<AppState>('IDLE');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [detection, setDetection] = useState<DetectionResult | null>(null);
  
  // UI State
  const [url, setUrl] = useState("https://instagram.com/diwakar_r.1");
  const [season, setSeason] = useState<'spring' | 'summer' | 'autumn'>('spring');
  const [isMuted, setIsMuted] = useState(true);
  const [activeColor, setActiveColor] = useState(THEME_COLORS[0].main);
  const [isManualQR, setIsManualQR] = useState(false);
  
  const treeTimeoutRef = useRef<number>(0);

  // Handle mobile devices
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  const handlePhoneDetected = () => {
    setState((prevState) => {
      if (prevState !== 'SEARCHING_FOR_PHONE') return prevState;
      
      treeTimeoutRef.current = window.setTimeout(() => {
        setState((s) => s === 'PHONE_DETECTED' ? 'TREE_ACTIVATING' : s);
        
        treeTimeoutRef.current = window.setTimeout(() => {
          setState((s) => s === 'TREE_ACTIVATING' ? 'TREE_ANIMATION' : s);
          
          treeTimeoutRef.current = window.setTimeout(() => {
            setState((s) => s === 'TREE_ANIMATION' ? 'QR_REVEALED' : s);
          }, config.treeAnimationDuration);
        }, 500);
      }, 300);
      
      return 'PHONE_DETECTED';
    });
  };

  const handlePhoneLost = () => {
    setState((prevState) => {
      if (prevState === 'IDLE' || prevState === 'CAMERA_INITIALIZING' || prevState === 'SEARCHING_FOR_PHONE') {
        return prevState;
      }
      if (treeTimeoutRef.current) {
        clearTimeout(treeTimeoutRef.current);
      }
      return 'SEARCHING_FOR_PHONE';
    });
  };

  const handleManualFallback = () => {
    setState('SEARCHING_FOR_PHONE');
  };

  useEffect(() => {
    return () => {
      if (treeTimeoutRef.current) clearTimeout(treeTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    audioEngine.setSeason(season);
  }, [season]);

  useEffect(() => {
    audioEngine.setMuted(isMuted);
  }, [isMuted]);

  useEffect(() => {
    if (state === 'QR_REVEALED') {
      audioEngine.playMagicReveal();
    }
  }, [state]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'ICQR',
        text: 'Check out this beautiful Tree QR Code!',
        url: url
      }).catch(console.error);
    }
  };

  const activeTheme = THEME_COLORS.find(c => c.main === activeColor) || THEME_COLORS[0];

  return (
    <div className="fixed inset-0 w-full h-full bg-[#FAF7F2] text-stone-700 font-sans flex flex-col justify-between overflow-x-hidden overflow-y-auto">
      
      <Header />

      {isMobile ? (
        <div className="flex-1 flex flex-col items-center justify-center h-full px-6 text-center">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-stone-200">
             <span className="text-2xl">💻</span>
          </div>
          <h2 className="text-2xl font-bold mb-4 text-stone-800">Desktop Required</h2>
          <p className="text-stone-600">This experience works best on a laptop or desktop with a webcam. Please visit this link on your computer.</p>
        </div>
      ) : (
        <>
          {state === 'IDLE' && (
            <CameraPermission 
              onPermissionGranted={(s) => {
                audioEngine.init();
                setStream(s);
                setState('CAMERA_INITIALIZING');
              }}
              onManualFallback={() => {
                audioEngine.init();
                handleManualFallback();
              }}
            />
          )}

          {state !== 'IDLE' && (
             <MagicTree 
               state={state} 
               config={{ ...config, qrValue: url }} 
               activeTheme={activeTheme}
               season={season}
               isManualQR={isManualQR}
               onToggleQR={() => setIsManualQR(!isManualQR)}
             />
          )}

          {stream && (
            <PhoneDetector 
              stream={stream}
              config={config}
              isActive={state !== 'IDLE' && state !== 'CAMERA_INITIALIZING'}
              onModelReady={() => {
                if (state === 'CAMERA_INITIALIZING') setState('SEARCHING_FOR_PHONE');
              }}
              onDetected={handlePhoneDetected}
              onLost={handlePhoneLost}
              onDebugUpdate={setDetection}
            />
          )}

          <DebugPanel state={state} detection={detection} config={config} />
          <SettingsPanel config={config} setConfig={setConfig} />

        </>
      )}

      <Controls 
        url={url}
        setUrl={setUrl}
        onShare={handleShare}
        season={season}
        setSeason={setSeason}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
        activeColor={activeColor}
        setActiveColor={setActiveColor}
        colors={THEME_COLORS}
      />
    </div>
  );
}
