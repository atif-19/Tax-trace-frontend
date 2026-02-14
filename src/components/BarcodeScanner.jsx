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
        // 1. Request the back camera specifically using constraints
        const constraints = {
          video: {
            facingMode: { exact: "environment" } // Forces back camera
          }
        };

        // Fallback: If 'exact' fails (some older browsers), try without 'exact'
        let stream;
        try {
          stream = await navigator.mediaDevices.getUserMedia(constraints);
        } catch (e) {
          console.warn("Exact environment camera not found, trying generic video");
          stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        }

        const devices = await BrowserMultiFormatReader.listVideoInputDevices();
        if (!devices.length) return;

        // 2. Filter for back camera if multiple cameras exist
        // Usually, the last device in the list is the high-quality back camera
        const backCamera = devices.find(device => 
          device.label.toLowerCase().includes('back') || 
          device.label.toLowerCase().includes('rear')
        ) || devices[devices.length - 1];

        controlsRef.current = await codeReader.decodeFromVideoDevice(
          backCamera.deviceId,
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
