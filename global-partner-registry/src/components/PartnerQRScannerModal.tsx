import React, { useState, useEffect, useRef, useCallback } from 'react';
import jsQR from 'jsqr';
import {
  Camera,
  X,
  FlipHorizontal,
  Zap,
  ZapOff,
  Upload,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  QrCode,
  Search,
  FileImage,
  Info
} from 'lucide-react';
import { Partner } from '../types';
import { PARTNERS_DATA } from '../data/partnersData';
import {
  resolvePartnerFromScannedText,
  playScanChime,
  QrResolutionResult,
  generatePartnerQRUrl
} from '../utils/qrPartnerResolver';
import { TrustBadge } from './TrustBadge';

interface PartnerQRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPartner: (partner: Partner) => void;
  onSearchDirectory?: (term: string) => void;
  initialPartnerHint?: Partner;
}

export const PartnerQRScannerModal: React.FC<PartnerQRScannerModalProps> = ({
  isOpen,
  onClose,
  onSelectPartner,
  onSearchDirectory,
  initialPartnerHint,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);

  // Camera settings
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [hasTorch, setHasTorch] = useState<boolean>(false);
  const [isTorchOn, setIsTorchOn] = useState<boolean>(false);
  const [cameraState, setCameraState] = useState<'idle' | 'starting' | 'active' | 'denied' | 'unsupported'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Scanning results
  const [scanResult, setScanResult] = useState<QrResolutionResult | null>(null);
  const [isProcessingFile, setIsProcessingFile] = useState<boolean>(false);
  const [autoRedirectTimer, setAutoRedirectTimer] = useState<number | null>(null);

  // Stop camera media tracks cleanly
  const stopCameraStream = useCallback(() => {
    if (animationFrameIdRef.current) {
      cancelAnimationFrame(animationFrameIdRef.current);
      animationFrameIdRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch {
          // ignore track stop error
        }
      });
      streamRef.current = null;
    }
    setIsTorchOn(false);
    setHasTorch(false);
  }, []);

  // Process a single video frame for QR detection
  const scanVideoFrame = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas || video.readyState < 2) {
      animationFrameIdRef.current = requestAnimationFrame(scanVideoFrame);
      return;
    }

    const width = video.videoWidth;
    const height = video.videoHeight;

    if (width === 0 || height === 0) {
      animationFrameIdRef.current = requestAnimationFrame(scanVideoFrame);
      return;
    }

    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) {
      animationFrameIdRef.current = requestAnimationFrame(scanVideoFrame);
      return;
    }

    ctx.drawImage(video, 0, 0, width, height);

    try {
      const imageData = ctx.getImageData(0, 0, width, height);
      const code = jsQR(imageData.data, width, height, {
        inversionAttempts: 'dontInvert',
      });

      if (code && code.data) {
        handleScannedCode(code.data);
        return; // stop continuous loop once code is detected
      }
    } catch {
      // Continue scanning loop on frame decoding error
    }

    animationFrameIdRef.current = requestAnimationFrame(scanVideoFrame);
  }, []);

  // Start camera with preferred facingMode
  const startCamera = useCallback(async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraState('unsupported');
      setErrorMessage('Your browser environment does not support camera access. You can upload an image file or test with sample badges below.');
      return;
    }

    stopCameraStream();
    setCameraState('starting');
    setErrorMessage('');

    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      // Check torch capability
      const track = stream.getVideoTracks()[0];
      if (track) {
        const capabilities = (track.getCapabilities?.() || {}) as { torch?: boolean };
        setHasTorch(Boolean(capabilities.torch));
      }

      setCameraState('active');
      animationFrameIdRef.current = requestAnimationFrame(scanVideoFrame);
    } catch (err: unknown) {
      const error = err as Error;
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        setCameraState('denied');
        setErrorMessage('Camera access was declined. Please allow camera permissions or upload an image of the physical card.');
      } else {
        setCameraState('unsupported');
        setErrorMessage(error.message || 'Unable to open camera stream. Please use image upload or sample testing.');
      }
    }
  }, [facingMode, scanVideoFrame, stopCameraStream]);

  // Handle scanned QR string
  const handleScannedCode = useCallback((scannedText: string) => {
    stopCameraStream();
    const resolution = resolvePartnerFromScannedText(scannedText, PARTNERS_DATA);
    setScanResult(resolution);

    if (resolution.partner) {
      playScanChime(true);
      // Initiate 2.5s auto-redirect countdown
      setAutoRedirectTimer(3);
    } else {
      playScanChime(false);
    }
  }, [stopCameraStream]);

  // Auto-redirect timer countdown effect
  useEffect(() => {
    if (autoRedirectTimer === null) return;

    if (autoRedirectTimer <= 0) {
      if (scanResult?.partner) {
        onSelectPartner(scanResult.partner);
        onClose();
      }
      return;
    }

    const timer = setTimeout(() => {
      setAutoRedirectTimer(prev => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => clearTimeout(timer);
  }, [autoRedirectTimer, scanResult, onSelectPartner, onClose]);

  // Toggle front/back camera
  const handleToggleFacingMode = () => {
    setFacingMode(prev => (prev === 'environment' ? 'user' : 'environment'));
  };

  // Toggle flashlight / torch
  const handleToggleTorch = async () => {
    if (!streamRef.current) return;
    const track = streamRef.current.getVideoTracks()[0];
    if (!track) return;

    try {
      const nextState = !isTorchOn;
      await (track as unknown as { applyConstraints: (c: unknown) => Promise<void> }).applyConstraints({
        advanced: [{ torch: nextState }],
      });
      setIsTorchOn(nextState);
    } catch {
      // Torch toggle failed
    }
  };

  // Handle file upload / image drop
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessingFile(true);
    setErrorMessage('');

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          setIsProcessingFile(false);
          setErrorMessage('Unable to process the uploaded image.');
          return;
        }

        ctx.drawImage(img, 0, 0);
        const imgData = ctx.getImageData(0, 0, img.width, img.height);
        const code = jsQR(imgData.data, img.width, img.height);

        setIsProcessingFile(false);
        if (code && code.data) {
          handleScannedCode(code.data);
        } else {
          setErrorMessage('No valid QR code was detected in the uploaded image. Please ensure the card/badge QR is clearly visible.');
        }
      };
      img.onerror = () => {
        setIsProcessingFile(false);
        setErrorMessage('Failed to load the image file.');
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Reset scanner to scan another card
  const handleResetScanner = () => {
    setScanResult(null);
    setAutoRedirectTimer(null);
    setErrorMessage('');
    startCamera();
  };

  // Initialize camera when modal opens
  useEffect(() => {
    if (isOpen) {
      setScanResult(null);
      setAutoRedirectTimer(null);
      startCamera();
    } else {
      stopCameraStream();
    }

    return () => {
      stopCameraStream();
    };
  }, [isOpen, startCamera, stopCameraStream]);

  // Handle Escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Sample curated partner badges for testing without physical cards
  const samplePartners = [
    { label: '🇳🇬 MsmeBooks Lagos', partnerId: 'p-01' },
    { label: '🇰🇪 AfriLedger Nairobi', partnerId: 'p-02' },
    { label: '🇿🇦 Veritas Audit SA', partnerId: 'p-03' },
    { label: '🇬🇭 PrimeLedger Accra', partnerId: 'p-04' },
    { label: '🇷🇼 Kigali Cloud Solutions', partnerId: 'p-05' },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="qr-scanner-title"
    >
      <div className="relative w-full max-w-lg bg-white dark:bg-[#0c1e38] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-[#0a1b32]/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-lime-500/15 border border-lime-500/30 flex items-center justify-center text-lime-600 dark:text-lime-400 shadow-sm">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 id="qr-scanner-title" className="text-base font-bold text-slate-900 dark:text-white">
                  Partner QR Badge Scanner
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-lime-500 text-slate-950 shadow-xs">
                  Live
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Scan physical business card or badge to open digital profile
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close scanner modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">

          {/* Hidden Canvas for video frame processing */}
          <canvas ref={canvasRef} className="hidden" />

          {/* Camera Viewfinder & Scanner Frame */}
          {!scanResult ? (
            <div className="relative rounded-2xl overflow-hidden bg-slate-950 aspect-4/3 flex items-center justify-center border-2 border-slate-700 shadow-inner group">
              
              {/* Video Element */}
              <video
                ref={videoRef}
                playsInline
                muted
                autoPlay
                className={`w-full h-full object-cover transition-opacity duration-300 ${
                  cameraState === 'active' ? 'opacity-100' : 'opacity-20'
                }`}
              />

              {/* Viewfinder Target Guides & Neon Animated Laser Line */}
              {cameraState === 'active' && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  {/* Subtle darkened backdrop mask around target */}
                  <div className="relative w-60 h-60 sm:w-68 sm:h-68 border-2 border-lime-400/90 rounded-2xl shadow-[0_0_25px_rgba(132,204,22,0.35)]">
                    
                    {/* Corner Accent Brackets */}
                    <span className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-lime-400 rounded-tl-lg"></span>
                    <span className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-lime-400 rounded-tr-lg"></span>
                    <span className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-lime-400 rounded-bl-lg"></span>
                    <span className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-lime-400 rounded-br-lg"></span>

                    {/* Sweeping Laser Line Animation */}
                    <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-lime-400 to-transparent shadow-[0_0_12px_#a3e635] animate-pulse top-1/2 -translate-y-1/2" />
                    
                    {/* Viewfinder Instructions Label */}
                    <div className="absolute -bottom-9 inset-x-0 flex justify-center">
                      <span className="px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-[11px] font-medium text-lime-300 border border-lime-500/40 shadow-md">
                        Align QR code on badge inside frame
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Camera State Overlays (Starting / Denied / Unsupported) */}
              {cameraState === 'starting' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center bg-slate-950/90 z-10">
                  <RefreshCw className="w-8 h-8 text-lime-400 animate-spin mb-2" />
                  <p className="text-sm font-semibold text-white">Opening camera stream...</p>
                  <p className="text-xs text-slate-400 mt-1">Please approve browser camera permissions if prompted</p>
                </div>
              )}

              {(cameraState === 'denied' || cameraState === 'unsupported') && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-5 text-center bg-slate-950/95 z-10 space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                    <Camera className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white mb-1">
                      {cameraState === 'denied' ? 'Camera Access Required' : 'Camera Unavailable'}
                    </h4>
                    <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                      {errorMessage || 'You can upload an image of the physical card or test with the curated sample badges below.'}
                    </p>
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-lime-500 hover:bg-lime-400 text-slate-950 font-bold text-xs shadow-md transition-all"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload Card / Badge Photo</span>
                  </button>
                </div>
              )}

              {/* Top Controls Overlay on Camera: Switch Camera & Torch */}
              {cameraState === 'active' && (
                <div className="absolute top-3 right-3 flex items-center gap-2 z-20">
                  {hasTorch && (
                    <button
                      type="button"
                      onClick={handleToggleTorch}
                      className={`p-2 rounded-xl backdrop-blur-md transition-all ${
                        isTorchOn
                          ? 'bg-amber-400 text-slate-950 shadow-md'
                          : 'bg-slate-900/80 text-white hover:bg-slate-800 border border-white/20'
                      }`}
                      title={isTorchOn ? 'Turn Flashlight Off' : 'Turn Flashlight On'}
                      aria-label="Toggle flashlight"
                    >
                      {isTorchOn ? <Zap className="w-4 h-4 fill-current" /> : <ZapOff className="w-4 h-4" />}
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={handleToggleFacingMode}
                    className="p-2 rounded-xl bg-slate-900/80 backdrop-blur-md text-white hover:bg-slate-800 border border-white/20 transition-all"
                    title={`Switch Camera (Currently: ${facingMode === 'environment' ? 'Back / Rear' : 'Front / Selfie'})`}
                    aria-label="Switch camera"
                  >
                    <FlipHorizontal className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Successful / Decoded Scan Result Card */
            <div className="space-y-4 animate-in zoom-in-95 duration-200">
              {scanResult.partner ? (
                <div className="bg-lime-500/10 dark:bg-lime-500/10 border-2 border-lime-500/40 rounded-2xl p-5 shadow-lg relative overflow-hidden">
                  <div className="flex items-start gap-4">
                    <img
                      src={scanResult.partner.logo}
                      alt={scanResult.partner.name}
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-lime-400 shadow-md shrink-0 bg-white"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-lime-500 text-slate-950 shadow-xs">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Partner Verified
                        </span>
                        <TrustBadge
                          level={scanResult.partner.level}
                          partnerId={scanResult.partner.id}
                          variant="pill"
                        />
                      </div>
                      
                      <h4 className="text-base font-extrabold text-slate-900 dark:text-white truncate">
                        {scanResult.partner.name}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-1.5 mt-0.5">
                        <span>{scanResult.partner.countryFlag}</span>
                        <span>{scanResult.partner.city}, {scanResult.partner.country}</span>
                        <span className="text-slate-400">•</span>
                        <span className="font-mono text-[11px] text-lime-700 dark:text-lime-300 font-bold">
                          ID: {scanResult.partner.id}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Verification Info Strip */}
                  <div className="mt-4 pt-3 border-t border-lime-500/20 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-200 font-medium">
                      <ShieldCheck className="w-4 h-4 text-lime-600 dark:text-lime-400" />
                      <span>Match Type: <strong className="uppercase font-mono text-[10px]">{scanResult.matchType}</strong></span>
                    </div>

                    {autoRedirectTimer !== null && autoRedirectTimer > 0 && (
                      <span className="text-[11px] font-bold text-lime-700 dark:text-lime-400 animate-pulse">
                        Opening profile in {autoRedirectTimer}s...
                      </span>
                    )}
                  </div>

                  {/* Immediate Action Buttons */}
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <button
                      onClick={handleResetScanner}
                      className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs border border-slate-300 dark:border-slate-700 transition-all flex items-center justify-center gap-1.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Scan Another</span>
                    </button>

                    <button
                      onClick={() => {
                        if (scanResult.partner) {
                          onSelectPartner(scanResult.partner);
                          onClose();
                        }
                      }}
                      className="py-2.5 px-4 rounded-xl bg-lime-500 hover:bg-lime-400 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 transform active:scale-98"
                    >
                      <span>Open Full Profile</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                /* Unrecognized / Non-Registry QR Code */
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        QR Code Decoded (Unregistered Partner)
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                        The scanned QR code does not match an active record in the official MsmeBooks Certified Registry.
                      </p>
                      <div className="mt-2 p-2 rounded-lg bg-slate-900/10 dark:bg-slate-950/60 font-mono text-[11px] text-slate-700 dark:text-slate-300 break-all select-all">
                        {scanResult.rawData}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      onClick={handleResetScanner}
                      className="flex-1 py-2 px-3 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold hover:bg-slate-300 transition-colors"
                    >
                      Scan Again
                    </button>

                    {onSearchDirectory && (
                      <button
                        onClick={() => {
                          onSearchDirectory(scanResult.rawData);
                          onClose();
                        }}
                        className="flex-1 py-2 px-3 rounded-xl bg-lime-500 text-slate-950 text-xs font-bold hover:bg-lime-400 transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Search className="w-3.5 h-3.5" />
                        <span>Search Directory</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Alternative File Upload Strip */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
            <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <FileImage className="w-4 h-4 text-slate-400" />
              <span>Have a photo of the card?</span>
            </span>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessingFile}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs border border-slate-200 dark:border-slate-700 transition-colors"
            >
              <Upload className="w-3.5 h-3.5 text-lime-600 dark:text-lime-400" />
              <span>{isProcessingFile ? 'Analyzing Image...' : 'Upload Image File'}</span>
            </button>
          </div>

          {/* Quick Demo Badges (1-Click Test for Immediate Inspection) */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#07162b] border border-slate-200 dark:border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-lime-500" />
                <span>Test With Sample Partner Badges</span>
              </span>
              <span className="text-[10px] text-slate-400">Click to simulate scan</span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {samplePartners.map((item) => (
                <button
                  key={item.partnerId}
                  type="button"
                  onClick={() => {
                    const match = PARTNERS_DATA.find(p => p.id === item.partnerId);
                    if (match) {
                      const payload = generatePartnerQRUrl(match);
                      handleScannedCode(payload);
                    }
                  }}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-lime-500 dark:hover:border-lime-400 hover:bg-lime-500/10 transition-all text-left shadow-2xs"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Modal Footer info note */}
        <div className="px-5 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-[#09172c]/60 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-lime-600 dark:text-lime-400 shrink-0" />
            <span>Encrypted MsmeBooks Partner Validation & Registry Authentication</span>
          </span>
          <span className="hidden sm:inline font-mono text-[10px] text-slate-400">v2.4.0</span>
        </div>

      </div>
    </div>
  );
};
