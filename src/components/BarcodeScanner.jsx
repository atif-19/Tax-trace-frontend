import React, { useEffect, useRef } from 'react';
import { BrowserMultiFormatReader } from '@zxing/browser';

const BarcodeScanner = ({ onScanSuccess }) => {
  const videoRef = useRef(null);
  const controlsRef = useRef(null);
  const scannedRef = useRef(false);

  useEffect(() => {
    let active = true;
    const codeReader = new BrowserMultiFormatReader();

    const startScanner = async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ video: true });

        const devices = await BrowserMultiFormatReader.listVideoInputDevices();
        if (!devices.length) return;

        const deviceId = devices[0].deviceId;

        controlsRef.current = await codeReader.decodeFromVideoDevice(
          deviceId,
          videoRef.current,
          (result, err) => {
            if (result && active && !scannedRef.current) {
              scannedRef.current = true;
              onScanSuccess(result.getText());
              controlsRef.current?.stop();
            }
          }
        );
      } catch (err) {
        console.error("Camera error:", err);
      }
    };

    startScanner();

    return () => {
      active = false;
      scannedRef.current = false;
      if (controlsRef.current) {
        controlsRef.current.stop(); // ✅ correct way
      }
    };
  }, [onScanSuccess]);

  return (
    <div className="relative w-full max-w-sm mx-auto bg-black rounded-lg overflow-hidden shadow-2xl">
      <video
        ref={videoRef}
        className="w-full h-64 object-cover"
      />
      <div className="absolute inset-0 border-2 border-dashed border-yellow-400 opacity-50 m-10 pointer-events-none"></div>
      <p className="absolute bottom-2 w-full text-center text-white text-xs bg-black bg-opacity-50 py-1">
        Align barcode inside the box
      </p>
    </div>
  );
};

export default BarcodeScanner;
