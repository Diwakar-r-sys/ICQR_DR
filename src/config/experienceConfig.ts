export interface ExperienceConfig {
  qrValue: string;
  title: string;
  subtitle: string;
  confidenceThreshold: number;
  requiredFrames: number;
  lostFrames: number;
  treeAnimationDuration: number;
  showDebug: boolean;
  cameraPreview: boolean;
  zone: { x: number; y: number; width: number; height: number };
}

export const defaultConfig: ExperienceConfig = {
  qrValue: "https://icqr.com",
  title: "Experience the Magic",
  subtitle: "Open the experience on your phone",
  confidenceThreshold: 0.55,
  requiredFrames: 4,
  lostFrames: 15,
  treeAnimationDuration: 2500,
  showDebug: false,
  cameraPreview: true,
  zone: { x: 0.2, y: 0.15, width: 0.6, height: 0.7 },
};
