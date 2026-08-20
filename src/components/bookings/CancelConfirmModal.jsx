import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { AlertTriangle, ShieldCheck } from 'lucide-react';

export function CancelConfirmModal({
  isOpen = false,
  onClose,
  booking,
  onConfirm,
}) {
  const { t } = useLanguage();

  if (!isOpen || !booking) return null;

  const bookingRef = `#LK-${String(booking.id).toUpperCase().replace(/^BK-/, '')}`;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('bookings.cancelConfirmTitle', 'ยืนยันการยกเลิกการจอง?')}
      size="sm"
      footer={
        <div className="flex gap-2 justify-end w-full">
          <Button variant="ghost" onClick={onClose}>
            {t('bookings.cancelConfirmNo', 'ไม่ยกเลิก')}
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            {t('bookings.cancelConfirmYes', 'ยืนยันการยกเลิก')}
          </Button>
        </div>
      }
    >
      <div className="space-y-4 py-2 text-center sm:text-left">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-600 shrink-0 mx-auto sm:mx-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-base">
              {t('bookings.cancelConfirmHeading', 'คุณต้องการยกเลิกการจองนี้ใช่หรือไม่?')}
            </h4>
            <p className="text-xs font-mono font-bold text-slate-500">
              {bookingRef}
            </p>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          {t('bookings.cancelConfirmMessage', { id: bookingRef })}
        </p>

        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500 flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed">
            {t('bookings.cancelPolicyNote', 'นโยบายการคืนเงิน: หากยกเลิกก่อนเวลานัดหมาย 24 ชม. ระบบจะคืนเงินเข้าบัญชีเดิมเต็มจำนวน 100%')}
          </p>
        </div>
      </div>
    </Modal>
  );
}

export default CancelConfirmModal;
