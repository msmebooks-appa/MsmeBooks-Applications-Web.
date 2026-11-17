import React, { useEffect, useMemo, useState } from 'react';
import QRCode from 'qrcode';
import {
  X,
  QrCode,
  Download,
  Copy,
  Check,
  ShieldCheck,
  Calendar,
  Clock,
  Building2,
  CheckCircle2,
  MapPin,
} from 'lucide-react';
import { BookingRecord } from '../types/booking';

export const CHECKIN_RECORDS_STORAGE_KEY = 'msmebooks_checkin_records';

export function getStoredCheckInRecords(): Record<string, string> {
  try {
    const raw = localStorage.getItem(CHECKIN_RECORDS_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch (e) {
    console.error('Failed to read check-in records:', e);
    return {};
  }
}

export function buildBookingCheckInCode(booking: BookingRecord): string {
  const cleanRef = (booking.reference || booking.id)
    .replace(/^MSME-/i, '')
    .replace(/[^A-Za-z0-9]/g, '')
    .toUpperCase()
    .slice(0, 6);
  let hash = 0;
  const seed = `${booking.id}:${booking.reference}:${booking.appointmentDate}`;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) % 10000;
  }
  return `CHK-${cleanRef || 'BOOK'}-${String(hash).padStart(4, '0')}`;
}

interface CheckInQrModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: BookingRecord | null;
  checkedInAt?: string | null;
  onMarkCheckedIn?: (booking: BookingRecord, checkedInTimestamp: string) => void;
}

export const CheckInQrModal: React.FC<CheckInQrModalProps> = ({
  isOpen,
  onClose,
  booking,
  checkedInAt,
  onMarkCheckedIn,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [qrError, setQrError] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  const checkInCode = useMemo(() => {
    if (!booking) return '';
    return buildBookingCheckInCode(booking);
  }, [booking]);

  const qrPayload = useMemo(() => {
    if (!booking) return '';
    return JSON.stringify({
      app: 'MsmeBooks',
      action: 'PROVIDER_ATTENDANCE_CHECKIN',
      bookingId: booking.id,
      reference: booking.reference,
      checkInCode,
      serviceTitle: booking.serviceTitle,
      providerName: booking.providerName,
      customerName: booking.customerName,
      businessName: booking.businessName || booking.customerName,
      appointmentDate: booking.appointmentDate,
      timeSlot: booking.timeSlot,
      consultationMode: booking.consultationMode,
    });
  }, [booking, checkInCode]);

  useEffect(() => {
    if (!isOpen || !booking || !qrPayload) {
      setQrDataUrl('');
      setQrError(null);
      return;
    }

    let cancelled = false;
    QRCode.toDataURL(qrPayload, {
      width: 280,
      margin: 2,
      errorCorrectionLevel: 'M',
      color: {
        dark: '#102B4E',
        light: '#FFFFFF',
      },
    })
      .then(url => {
        if (!cancelled) {
          setQrDataUrl(url);
          setQrError(null);
        }
      })
      .catch(err => {
        console.error('Failed to generate check-in QR code:', err);
        if (!cancelled) {
          setQrError('Unable to render QR code for this booking.');
        }
      });

    return () => {
      cancelled = true;
    };
  }, [isOpen, booking, qrPayload]);

  if (!isOpen || !booking) return null;

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(checkInCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2500);
    } catch (err) {
      console.error('Copy check-in code failed:', err);
    }
  };

  const handleDownloadQr = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = `MsmeBooks-CheckIn-QR-${booking.reference}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleVerifyArrival = () => {
    const timestamp = new Date().toISOString();
    onMarkCheckedIn?.(booking, timestamp);
  };

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white dark:bg-[#0A1727] rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100">
        {/* Header */}
        <div className="bg-[#102B4E] dark:bg-[#060F1A] px-6 py-4 text-white flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#1464C8] text-[#B7E532] flex items-center justify-center shrink-0">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base text-white leading-tight">
                Attendance Check-in QR Pass
              </h3>
              <p className="text-xs text-slate-300">
                Present to provider upon arrival to verify session
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close check-in QR modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Appointment Summary */}
          <div className="bg-slate-50 dark:bg-[#0D1D31] rounded-2xl p-4 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono font-black text-[#1464C8] dark:text-[#B7E532]">
                {booking.reference}
              </span>
              <span className="px-2.5 py-0.5 rounded-full font-extrabold text-[10px] bg-blue-100 dark:bg-blue-950 text-[#1464C8] dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                {booking.status}
              </span>
            </div>

            <div className="font-extrabold text-sm text-[#102B4E] dark:text-white">
              {booking.serviceTitle}
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-600 dark:text-slate-300">
              <span className="flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-[#1464C8] dark:text-[#B7E532]" />
                <span>{booking.providerName}</span>
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>{booking.appointmentDate}</span>
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{booking.timeSlot}</span>
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{booking.consultationMode}</span>
              </span>
            </div>
          </div>

          {/* Scannable QR Display Area */}
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="bg-white p-4 rounded-2xl border-2 border-slate-200 shadow-inner flex items-center justify-center min-h-[240px] min-w-[240px]">
              {qrError ? (
                <div className="text-xs text-red-600 font-bold text-center max-w-[200px]">
                  {qrError}
                </div>
              ) : qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt={`Attendance check-in QR code for booking ${booking.reference}`}
                  className="w-56 h-56 object-contain"
                />
              ) : (
                <div className="text-xs text-slate-400 font-semibold animate-pulse">
                  Generating Check-in QR...
                </div>
              )}
            </div>

            {/* Verification Code Chip */}
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-[#0D1D31] px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
              <span className="text-slate-500 dark:text-slate-400 font-semibold">
                Check-in Code:
              </span>
              <span className="font-mono font-black text-[#102B4E] dark:text-[#B7E532] tracking-wide">
                {checkInCode}
              </span>
              <button
                type="button"
                onClick={handleCopyCode}
                className="ml-1 p-1 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 cursor-pointer transition-colors"
                title="Copy manual check-in code"
              >
                {copiedCode ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-[#B7E532]" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

          {/* Attendance Verification Status Banner */}
          {checkedInAt ? (
            <div className="bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 rounded-2xl p-3.5 flex items-center gap-3 text-xs text-emerald-900 dark:text-emerald-200">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-[#B7E532] shrink-0" />
              <div>
                <div className="font-black">Attendance Verified on Arrival</div>
                <div className="text-[11px] text-emerald-700 dark:text-emerald-300">
                  Checked in on{' '}
                  {new Date(checkedInAt).toLocaleString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 rounded-2xl p-3.5 flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
              <ShieldCheck className="w-4 h-4 text-[#1464C8] dark:text-[#B7E532] shrink-0 mt-0.5" />
              <span>
                Ask your assigned expert from <strong>{booking.providerName}</strong> to scan this QR code (or enter code <strong className="font-mono">{checkInCode}</strong>) upon arrival to confirm session attendance.
              </span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <button
              type="button"
              onClick={handleDownloadQr}
              disabled={!qrDataUrl}
              className="flex-1 px-4 py-2.5 rounded-xl bg-[#102B4E] hover:bg-[#1464C8] disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-xs"
            >
              <Download className="w-3.5 h-3.5 text-[#B7E532]" />
              <span>Download QR Pass</span>
            </button>

            {!checkedInAt && onMarkCheckedIn && (
              <button
                type="button"
                onClick={handleVerifyArrival}
                className="flex-1 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-xs"
                title="Confirm attendance verification upon provider arrival"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-[#B7E532]" />
                <span>Verify Arrival</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
