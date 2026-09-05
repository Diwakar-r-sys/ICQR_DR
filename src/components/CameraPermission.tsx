import { useState } from 'react';
import { Camera, ShieldAlert } from 'lucide-react';

interface CameraPermissionProps {
  onPermissionGranted: (stream: MediaStream) => void;
  onManualFallback: () => void;
}

export function CameraPermission({ onPermissionGranted, onManualFallback }: CameraPermissionProps) {
  const [error, setError] = useState<string>('');

  const requestCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false
      });
      onPermissionGranted(stream);
    } catch (err: any) {
      setError(err.message || "Camera access denied");
    }
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#F6F3EB]/95 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl overflow-hidden w-full max-w-md shadow-2xl border border-stone-200/50 p-8 flex flex-col items-center text-center">
        <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mb-6 ring-1 ring-stone-200">
          <Camera className="w-10 h-10 text-stone-600" />
        </div>
        
        <h2 className="text-2xl font-bold text-stone-900 mb-3 tracking-tight">Turn Your Camera Into an Interaction</h2>
        
        <p className="text-stone-600 text-sm mb-6 leading-relaxed">
          Allow camera access so we can detect when you hold a phone in front of your screen. 
        </p>
        
        <div className="flex items-center justify-center text-xs text-stone-500 mb-8 bg-stone-50 px-4 py-2 rounded-lg border border-stone-100">
          <ShieldAlert className="w-4 h-4 mr-2 text-stone-400" />
          Camera processing happens locally in your browser.
        </div>
        
        <div className="flex flex-col w-full gap-3">
          <button 
            onClick={requestCamera}
            className="bg-[#BA6D38] hover:bg-[#A85F2E] text-white font-semibold py-3.5 px-6 rounded-xl transition-all shadow-sm transform active:scale-95"
          >
            Enable Camera
          </button>
          <button 
            onClick={onManualFallback}
            className="bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium py-3.5 px-6 rounded-xl transition-all"
          >
            Continue Without Camera
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-xs w-full">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
