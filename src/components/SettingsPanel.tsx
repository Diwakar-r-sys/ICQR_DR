import { useState } from 'react';
import { Settings, X } from 'lucide-react';
import { ExperienceConfig } from '../config/experienceConfig';

interface SettingsPanelProps {
  config: ExperienceConfig;
  setConfig: React.Dispatch<React.SetStateAction<ExperienceConfig>>;
}

export function SettingsPanel({ config, setConfig }: SettingsPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed top-6 right-6 w-10 h-10 bg-stone-900/50 hover:bg-stone-800 text-stone-400 hover:text-white rounded-full flex items-center justify-center backdrop-blur-md border border-stone-700/50 transition-all z-50"
      >
        <Settings className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div className="fixed top-6 right-6 w-80 bg-stone-900 border border-stone-700 rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col max-h-[80vh]">
      <div className="p-4 border-b border-stone-800 flex justify-between items-center bg-stone-900/80 backdrop-blur-sm">
        <h3 className="text-white font-semibold flex items-center gap-2">
          <Settings className="w-4 h-4 text-emerald-500" />
          Configuration
        </h3>
        <button onClick={() => setIsOpen(false)} className="text-stone-500 hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <div className="p-5 overflow-y-auto space-y-6 text-sm">
        
        {/* QR Settings */}
        <div className="space-y-3">
          <h4 className="text-stone-400 uppercase text-xs font-bold tracking-wider">QR Content</h4>
          
          <div>
            <label className="block text-stone-300 mb-1">URL / Value</label>
            <input 
              type="text" 
              value={config.qrValue}
              onChange={(e) => setConfig({...config, qrValue: e.target.value})}
              className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-stone-300 mb-1">Title</label>
            <input 
              type="text" 
              value={config.title}
              onChange={(e) => setConfig({...config, title: e.target.value})}
              className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Detection Settings */}
        <div className="space-y-3">
          <h4 className="text-stone-400 uppercase text-xs font-bold tracking-wider">Detection</h4>
          
          <div>
            <label className="flex justify-between text-stone-300 mb-1">
              <span>Confidence Threshold</span>
              <span className="text-emerald-400">{(config.confidenceThreshold * 100).toFixed(0)}%</span>
            </label>
            <input 
              type="range" 
              min="0.1" max="0.95" step="0.05"
              value={config.confidenceThreshold}
              onChange={(e) => setConfig({...config, confidenceThreshold: parseFloat(e.target.value)})}
              className="w-full accent-emerald-500"
            />
          </div>
          
          <div>
            <label className="flex justify-between text-stone-300 mb-1">
              <span>Required Frames (Stability)</span>
              <span className="text-emerald-400">{config.requiredFrames}</span>
            </label>
            <input 
              type="range" 
              min="1" max="20" step="1"
              value={config.requiredFrames}
              onChange={(e) => setConfig({...config, requiredFrames: parseInt(e.target.value)})}
              className="w-full accent-emerald-500"
            />
          </div>
        </div>

        {/* Display Settings */}
        <div className="space-y-3">
          <h4 className="text-stone-400 uppercase text-xs font-bold tracking-wider">Display</h4>
          
          <label className="flex items-center justify-between text-stone-300 cursor-pointer">
            <span>Camera Preview</span>
            <input 
              type="checkbox" 
              checked={config.cameraPreview}
              onChange={(e) => setConfig({...config, cameraPreview: e.target.checked})}
              className="accent-emerald-500 w-4 h-4"
            />
          </label>
          
          <label className="flex items-center justify-between text-stone-300 cursor-pointer">
            <span>Developer Debug Mode</span>
            <input 
              type="checkbox" 
              checked={config.showDebug}
              onChange={(e) => setConfig({...config, showDebug: e.target.checked})}
              className="accent-emerald-500 w-4 h-4"
            />
          </label>
        </div>

      </div>
    </div>
  );
}
