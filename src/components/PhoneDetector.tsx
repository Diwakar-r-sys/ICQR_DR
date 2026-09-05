import { useEffect, useRef } from 'react';
import { usePhoneDetection } from '../hooks/usePhoneDetection';
import { ExperienceConfig } from '../config/experienceConfig';
import { DetectionResult } from '../types/detection';
import { cn } from '../lib/utils';
import { ScanFace } from 'lucide-react';

interface PhoneDetectorProps {
  stream: MediaStream | null;
  config: ExperienceConfig;
  isActive: boolean;
  onDetected: () => void;
  onLost: () => void;
  onDebugUpdate: (result: DetectionResult) => void;
  onModelReady: () => void;
}

export function PhoneDetector({
  stream, config, isActive, onDetected, onLost, onDebugUpdate, onModelReady
}: PhoneDetectorProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const { isModelReady } = usePhoneDetection(
    videoRef,
    config,
    isActive,
    onDetected,
    onLost,
    onDebugUpdate
  );

  useEffect(() => {
    if (isModelReady) {
      onModelReady();
    }
  }, [isModelReady, onModelReady]);

  if (!config.cameraPreview) return (
     <video ref={videoRef} autoPlay playsInline muted className="hidden" />
  );

  return (
    <div className="fixed bottom-6 right-6 w-48 h-36 bg-stone-100 rounded-2xl overflow-hidden shadow-xl border border-stone-200 z-40 flex items-center justify-center">
      <video 
        ref={videoRef} 
        autoPlay 
        playsInline 
        muted 
        className={cn("absolute inset-0 w-full h-full object-cover transform -scale-x-100", !isModelReady && "opacity-0")} 
      />
      
      {!isModelReady && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-stone-500 bg-stone-100">
          <ScanFace className="w-6 h-6 mb-2 animate-pulse text-[#E5AA28]" />
          <span className="text-[10px] font-mono tracking-wider">LOADING VISION</span>
        </div>
      )}

      {isModelReady && (
        <div className="absolute inset-0 pointer-events-none border border-[#E8A3B6]/50 bg-[#E8A3B6]/5"
             style={{
               left: `${config.zone.x * 100}%`,
               top: `${config.zone.y * 100}%`,
               width: `${config.zone.width * 100}%`,
               height: `${config.zone.height * 100}%`
             }}
        />
      )}
      <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-white/80 backdrop-blur-md rounded border border-stone-200 text-[9px] text-stone-700 font-mono font-bold flex items-center gap-1.5 shadow-sm">
        <span className={cn("w-1.5 h-1.5 rounded-full", isModelReady ? "bg-[#74BF52]" : "bg-[#DF9F18]")}></span>
        WEBCAM
      </div>
    </div>
  );
}
