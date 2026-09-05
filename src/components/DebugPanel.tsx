import { AppState, DetectionResult } from '../types/detection';
import { ExperienceConfig } from '../config/experienceConfig';

interface DebugPanelProps {
  state: AppState;
  detection: DetectionResult | null;
  config: ExperienceConfig;
}

export function DebugPanel({ state, detection, config }: DebugPanelProps) {
  if (!config.showDebug) return null;

  return (
    <div className="fixed top-6 left-6 w-64 bg-black/80 backdrop-blur-md border border-stone-700 p-4 rounded-xl text-xs font-mono text-emerald-400 z-50 shadow-2xl">
      <h3 className="text-white font-bold mb-3 border-b border-stone-700 pb-2 flex justify-between">
        <span>DEV MODE</span>
        <span className="text-stone-500">{state}</span>
      </h3>
      
      <div className="space-y-3">
        <div>
          <span className="text-stone-400">Object Detection:</span>
          <div className="text-white">Phone: {detection?.detected ? <span className="text-emerald-400">DETECTED</span> : <span className="text-stone-500">NONE</span>}</div>
        </div>
        
        <div>
          <span className="text-stone-400">Confidence:</span>
          <div className="text-white">{detection?.confidence ? (detection.confidence * 100).toFixed(1) + '%' : '0%'}</div>
          <div className="w-full h-1 bg-stone-800 mt-1 rounded overflow-hidden">
             <div className="h-full bg-emerald-500 transition-all" style={{ width: `${(detection?.confidence || 0) * 100}%`}} />
          </div>
        </div>

        {detection?.bbox && (
          <div>
            <span className="text-stone-400">Bounding Box:</span>
            <div className="grid grid-cols-2 gap-1 text-white opacity-80 mt-1">
              <div>x: {(detection.bbox.x * 100).toFixed(0)}%</div>
              <div>y: {(detection.bbox.y * 100).toFixed(0)}%</div>
              <div>w: {(detection.bbox.width * 100).toFixed(0)}%</div>
              <div>h: {(detection.bbox.height * 100).toFixed(0)}%</div>
            </div>
          </div>
        )}

        <div>
          <span className="text-stone-400">Detection Zone:</span>
          <div className="text-white">{detection?.inZone ? <span className="text-emerald-400">INSIDE</span> : <span className="text-stone-500">OUTSIDE</span>}</div>
        </div>
      </div>
    </div>
  );
}
