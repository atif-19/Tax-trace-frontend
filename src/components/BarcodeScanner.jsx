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
    const devices = await BrowserMultiFormatReader.listVideoInputDevices();
    if (!devices.length) return;

    // Prefer environment cameras only
    const backCameras = devices.filter(device =>
      device.label.toLowerCase().includes("back") ||
      device.label.toLowerCase().includes("rear") ||
      device.label.toLowerCase().includes("environment")
    );

    const targetCamera = backCameras.length
      ? backCameras[0]   // pick first rear camera (usually main wide)
      : devices[0];

    controlsRef.current = await codeReader.decodeFromVideoDevice(
      targetCamera.deviceId,
      videoRef.current,
      async (result, err) => {
        const videoTrack = videoRef.current?.srcObject?.getVideoTracks()[0];

        if (videoTrack?.getCapabilities) {
          const capabilities = videoTrack.getCapabilities();

          // Apply continuous focus if available
          if (capabilities.focusMode?.includes("continuous")) {
            await videoTrack.applyConstraints({
              advanced: [{ focusMode: "continuous" }]
            });
          }

          // Apply slight zoom to avoid ultra-wide distortion
          if (capabilities.zoom) {
            await videoTrack.applyConstraints({
              advanced: [{ zoom: 1.5 }]
            });
          }
        }

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
