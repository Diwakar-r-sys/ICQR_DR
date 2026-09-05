export type AppState =
  | 'IDLE'
  | 'CAMERA_INITIALIZING'
  | 'CAMERA_READY'
  | 'SEARCHING_FOR_PHONE'
  | 'PHONE_DETECTED'
  | 'TREE_ACTIVATING'
  | 'TREE_ANIMATION'
  | 'QR_REVEALED'
  | 'WAITING_FOR_PHONE_REMOVAL';

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface DetectionResult {
  detected: boolean;
  confidence: number;
  bbox?: BoundingBox;
  inZone: boolean;
}
