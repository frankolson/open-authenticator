import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { setupScanner, frameProcessor, teardownScanner } from 'src/lib/qr';
import { OTPDataType } from 'src/types';

interface Props {
  onDetected: (data: OTPDataType) => void;
}

export default function QRScanner({ onDetected }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCameraAllowed, setIsCameraAllowed] = useState<boolean | null>(null);
  const scannerRef = useRef<Generator | null>(null);

  const startScanning = useCallback(() => {
    if (!videoRef.current) return;
    
    try {
      setupScanner(videoRef.current);
      setIsCameraAllowed(true);

      scannerRef.current = frameProcessor(videoRef.current, onDetected);

      const runScanner = () => {
        if (scannerRef.current) {
          scannerRef.current.next();
          requestAnimationFrame(runScanner);
        }
      }

      requestAnimationFrame(runScanner);
    } catch (error) {
      
    }
  }, [onDetected]);

  useEffect(() => {
    startScanning();

    return () => {
      if (scannerRef.current) {
        scannerRef.current.return(undefined);
        scannerRef.current = null;
      }

      if (videoRef.current) {
        teardownScanner(videoRef.current);
      }
    };
  }, [startScanning]);

  const cameraStatus = useMemo(() => {
    if (isCameraAllowed == null) return 'Connnecting to camera...';
    if (isCameraAllowed == false) return 'Camera access is required to scan QR codes.';
    return null;
  }, [isCameraAllowed]);

  const TargetBox = ({ hidden }: { hidden: boolean}) => {
    return (
      <div className='qr-scanner-target'>
        <svg viewBox='0 0 24 24'>
          <rect
            x='1'
            y='1'
            rx='1'
            ry='1'
            width='22'
            height='22'
            fill='none'
            stroke='#1bfc06'
            strokeWidth='0.25'
            fillOpacity='0'
            strokeOpacity='0.75'
          />
        </svg>
      </div> 
    )
  }

  return (
    <div className='qr-scanner'>
      {cameraStatus && <p>{cameraStatus}</p>}

      <video ref={videoRef} hidden={!isCameraAllowed} />
      <TargetBox hidden={!isCameraAllowed} />
    </div>
  );
}