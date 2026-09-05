import { useState, useEffect, useRef } from 'react';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import { DetectionResult } from '../types/detection';
import { ExperienceConfig } from '../config/experienceConfig';

export function usePhoneDetection(
  videoRef: React.RefObject<HTMLVideoElement | null>,
  config: ExperienceConfig,
  isActive: boolean,
  onDetected: () => void,
  onLost: () => void,
  onStateChange?: (result: DetectionResult) => void
) {
  const [isModelReady, setIsModelReady] = useState(false);
  const modelRef = useRef<cocoSsd.ObjectDetection | null>(null);
  const requestRef = useRef<number>(0);
  
  const detectionCountRef = useRef(0);
  const lostCountRef = useRef(0);
  const lastStateRef = useRef<boolean>(false);

  // Use refs for callbacks to avoid stale closures in requestAnimationFrame
  const callbacksRef = useRef({ onDetected, onLost, onStateChange });
  useEffect(() => {
    callbacksRef.current = { onDetected, onLost, onStateChange };
  }, [onDetected, onLost, onStateChange]);

  useEffect(() => {
    let isMounted = true;
    const loadModel = async () => {
      try {
        await tf.ready();
        const model = await cocoSsd.load({ base: 'lite_mobilenet_v2' });
        if (isMounted) {
          modelRef.current = model;
          setIsModelReady(true);
        }
      } catch (err) {
        console.error("Failed to load coco-ssd model", err);
      }
    };
    loadModel();
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    let isCancelled = false;

    const detectFrame = async () => {
      if (isCancelled || !isActive || !modelRef.current || !videoRef.current) {
        if (!isCancelled) requestRef.current = requestAnimationFrame(detectFrame);
        return;
      }

      const video = videoRef.current;
      if (video.readyState !== 4 || video.videoWidth === 0) {
        if (!isCancelled) requestRef.current = requestAnimationFrame(detectFrame);
        return;
      }

      try {
        const predictions = await modelRef.current.detect(video);
        if (isCancelled) return;

        const phonePred = predictions.find(p => p.class === 'cell phone' || p.class === 'remote'); 

        let currentDetected = false;
        let currentResult: DetectionResult = { detected: false, confidence: 0, inZone: false };

        if (phonePred && phonePred.score >= config.confidenceThreshold) {
          const [x, y, width, height] = phonePred.bbox;
          const normBBox = {
            x: x / video.videoWidth,
            y: y / video.videoHeight,
            width: width / video.videoWidth,
            height: height / video.videoHeight
          };

          const z = config.zone;
          const centerX = normBBox.x + normBBox.width / 2;
          const centerY = normBBox.y + normBBox.height / 2;
          const inZone = centerX >= z.x && centerX <= (z.x + z.width) && centerY >= z.y && centerY <= (z.y + z.height);

          currentResult = {
            detected: true,
            confidence: phonePred.score,
            bbox: normBBox,
            inZone
          };

          if (inZone) {
            currentDetected = true;
          }
        }

        callbacksRef.current.onStateChange?.(currentResult);

        if (currentDetected) {
          lostCountRef.current = 0;
          detectionCountRef.current += 1;
          if (detectionCountRef.current >= config.requiredFrames && !lastStateRef.current) {
            lastStateRef.current = true;
            callbacksRef.current.onDetected();
          }
        } else {
          detectionCountRef.current = 0;
          lostCountRef.current += 1;
          if (lostCountRef.current >= config.lostFrames && lastStateRef.current) {
            lastStateRef.current = false;
            callbacksRef.current.onLost();
          }
        }
      } catch (e) {
        // Ignored
      }

      if (!isCancelled) {
        requestRef.current = requestAnimationFrame(detectFrame);
      }
    };

    if (isModelReady && isActive) {
      requestRef.current = requestAnimationFrame(detectFrame);
    }
    
    return () => {
      isCancelled = true;
      cancelAnimationFrame(requestRef.current);
    };
  }, [isModelReady, isActive, config.confidenceThreshold, config.requiredFrames, config.lostFrames, config.zone]);

  return { isModelReady };
}
