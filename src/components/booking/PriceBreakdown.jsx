import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Receipt, Tag, ShieldCheck, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { calculateCarePrice, formatServicePrice } from '../../utils/pricing';

export function PriceBreakdown({
  durationHours = 4,
  priceQuote = null,
  discount = 0,
  promoCode = '',
  promoStatus = 'idle', // 'idle' | 'applied' | 'invalid'
  onPromoCodeChange,
  onApplyPromo,
  onConfirm,
  isSubmitting = false,
  className = '',
}) {
  const { t } = useLanguage();
  const quote = priceQuote || calculateCarePrice({ durationHours });

  const basePrice = quote.basePrice;
  const activitySurcharge = quote.activitySurcharge || 0;
  const mobilitySurcharge = quote.mobilitySurcharge || 0;
  const requirementSurcharge = quote.requirementSurcharge || 0;
  const weekendHolidayDiscount = quote.weekendHolidayDiscount || 0;
  const effectiveServiceFee = quote.serviceFee || 0;
  const totalBeforeDiscount = quote.totalPrice;
  const totalPrice = Math.max(0, totalBeforeDiscount - discount);

  const handleApplyClick = (e) => {
    e.preventDefault();
    onApplyPromo?.(promoCode);
  };

  return (
    <Card className={`border-slate-200/80 shadow-xs overflow-hidden ${className}`}>
      <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
            <Receipt className="w-4 h-4" />
          </div>
          <div>
            <CardTitle className="text-base sm:text-lg font-bold text-slate-900">
              {t('book.priceBreakdownTitle', 'รายละเอียดราคา (Price Breakdown)')}
            </CardTitle>
            <p className="text-xs text-slate-500">
              {t('book.priceBreakdownDesc', 'อัตราค่าบริการโปร่งใส ไม่มีค่าใช้จ่ายแอบแฝง')}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-5 sm:p-6 space-y-5">
        {/* Itemized Line Items */}
        <div className="space-y-3 text-xs sm:text-sm text-slate-600 border-b border-slate-100 pb-4">
          <div className="flex justify-between items-center">
            <span>
              {t('book.baseRateLabel', quote.durationType === 'full_day' ? 'ราคามาตรฐานเต็มวัน' : 'ราคามาตรฐานครึ่งวัน')}
            </span>
            <span className="font-semibold text-slate-900">{formatServicePrice(basePrice)}</span>
          </div>

          {activitySurcharge > 0 && (
            <div className="flex justify-between items-center">
              <span>{t('book.activitySurchargeLabel', 'ความยากของกิจกรรม')}</span>
              <span className="font-semibold text-slate-900">+{formatServicePrice(activitySurcharge)}</span>
            </div>
          )}

          {mobilitySurcharge > 0 && (
            <div className="flex justify-between items-center">
              <span>{t('book.mobilitySurchargeLabel', 'ระดับการช่วยพยุง/การเคลื่อนไหว')}</span>
              <span className="font-semibold text-slate-900">+{formatServicePrice(mobilitySurcharge)}</span>
            </div>
          )}

          {requirementSurcharge > 0 && (
            <div className="flex justify-between items-center">
              <span>{t('book.requirementSurchargeLabel', 'ข้อจำกัดผู้ดูแลเพิ่มเติม')}</span>
              <span className="font-semibold text-slate-900">+{formatServicePrice(requirementSurcharge)}</span>
            </div>
          )}

          {weekendHolidayDiscount > 0 && (
            <div className="flex justify-between items-center text-emerald-700">
              <span>{t('book.weekendHolidayDiscountLabel', 'ส่วนลดวันเสาร์/อาทิตย์/วันหยุด')}</span>
              <span className="font-semibold">-{formatServicePrice(weekendHolidayDiscount)}</span>
            </div>
          )}

          <div className="flex justify-between items-center">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-sky-500" />
              <span>{t('book.insuranceFeeLabel', 'ประกันอุบัติเหตุและความปลอดภัยผู้สูงอายุ')}</span>
            </span>
            <span className="font-semibold text-slate-900">{effectiveServiceFee > 0 ? formatServicePrice(effectiveServiceFee) : t('common.included', 'รวมแล้ว')}</span>
          </div>

          {discount > 0 && (
            <div className="flex justify-between items-center text-emerald-600 font-semibold bg-emerald-50/80 p-2 rounded-lg">
              <span className="flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-emerald-500" />
              <span>{t('book.promoDiscountLabel', 'ส่วนลดโปรโมชั่น')}</span>
              </span>
              <span>-{formatServicePrice(discount)}</span>
            </div>
          )}
        </div>

        {/* Promo Code Input */}
        <div className="space-y-2">
          <form onSubmit={handleApplyClick} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => onPromoCodeChange?.(e.target.value)}
                placeholder={t('book.promoInputPlaceholder', 'กรอกโค้ดส่วนลด (เช่น CAREMATE)')}
                className="w-full pl-3.5 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm uppercase placeholder:normal-case placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
              />
            </div>
            <Button
              type="submit"
              variant="outline"
              size="sm"
              className="shrink-0"
              onClick={handleApplyClick}
            >
              {t('book.applyPromoBtn', 'ใช้โค้ด')}
            </Button>
          </form>

          {promoStatus === 'applied' && (
            <p className="text-xs text-emerald-600 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{t('book.promoSuccessText', { discount })}</span>
            </p>
          )}

          {promoStatus === 'invalid' && (
            <p className="text-xs text-rose-500 font-medium flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{t('book.promoInvalidText', 'โค้ดส่วนลดไม่ถูกต้องหรือไม่สามารถใช้ได้')}</span>
            </p>
          )}
        </div>

        {/* Total Price Display */}
        <div className="pt-2 border-t border-slate-100 flex justify-between items-center">
          <div>
            <p className="text-xs text-slate-500 font-medium">
              {t('book.totalAmountLabel', 'ยอดรวมสุทธิ (Total Price)')}
            </p>
            <p className="text-[11px] text-slate-400">
              {t('book.taxIncludedNote', 'รวมภาษีมูลค่าเพิ่มแล้ว')}
            </p>
          </div>
          <div className="text-right">
            <span className="text-2xl sm:text-3xl font-black text-emerald-600 tracking-tight">
              {formatServicePrice(totalPrice)}
            </span>
          </div>
        </div>

        {/* Confirm Action Button */}
        <div className="pt-2 space-y-3">
          <Button
            variant="secondary"
            size="lg"
            className="w-full text-base font-bold shadow-md shadow-secondary-700/20 cursor-pointer"
            onClick={onConfirm}
            disabled={isSubmitting}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            {isSubmitting
              ? t('common.processing', 'กำลังดำเนินการ...')
              : t('book.confirmBookingBtn', 'ยืนยันการจองและชำระเงิน')}
          </Button>

          <p className="text-[11px] text-center text-slate-400 leading-relaxed px-2">
            {t('book.agreeTermsText', 'การกดยืนยันแสดงว่าท่านยอมรับข้อกำหนดการให้บริการและนโยบายความเป็นส่วนตัวของ CareMate')}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default PriceBreakdown;
