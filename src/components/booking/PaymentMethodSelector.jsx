import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { QrCode, CreditCard, Smartphone, CheckCircle2, ShieldCheck, Banknote } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export function PaymentMethodSelector({
  selectedMethod = 'promptpay',
  onSelectMethod,
  totalAmount = 0,
  className = '',
}) {
  const { t, language } = useLanguage();

  const methods = [
    {
      id: 'promptpay',
      title: t('book.payPromptPay', 'พร้อมเพย์ QR Code (ไม่มีค่าธรรมเนียม - แนะนำ)'),
      subtitle: t('book.payPromptPayDesc', 'สแกนจ่ายได้ทุกแอปพลิเคชันธนาคาร สะดวก รวดเร็ว'),
      icon: <QrCode className="w-5 h-5 text-sky-600" />,
      tag: t('common.recommended', 'แนะนำ'),
      badgeVariant: 'success',
    },
    {
      id: 'credit_card',
      title: t('book.payCreditCard', 'บัตรเครดิต / เดบิต (Visa, Mastercard, JCB)'),
      subtitle: t('book.payCreditCardDesc', 'ตัดบัตรปลอดภัยด้วยระบบ 3D Secure 256-bit'),
      icon: <CreditCard className="w-5 h-5 text-indigo-600" />,
      tag: '0% fee',
      badgeVariant: 'neutral',
    },
    {
      id: 'mobile_banking',
      title: t('book.payMobileBanking', 'โมบายแบงก์กิ้ง (K PLUS, SCB EASY, Krungthai NEXT)'),
      subtitle: t('book.payMobileBankingDesc', 'เชื่อมต่อและชำระเงินผ่านแอปธนาคารโดยตรง'),
      icon: <Smartphone className="w-5 h-5 text-emerald-600" />,
      tag: 'Direct App',
      badgeVariant: 'neutral',
    },
  ];

  return (
    <Card className={`border-slate-200/80 shadow-xs ${className}`}>
      <CardHeader className="pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-600">
            <CreditCard className="w-4 h-4" />
          </div>
          <div>
            <CardTitle className="text-base sm:text-lg font-bold text-slate-900">
              {t('book.paymentTitle', 'เลือกวิธีการชำระเงิน (Select Payment Method)')}
            </CardTitle>
            <p className="text-xs text-slate-500">
              {t('book.paymentSubtitle', 'การชำระเงินปลอดภัย 100% พร้อมระบบคุ้มครองเงินประกัน')}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-5 sm:p-6 space-y-4">
        <div className="space-y-3">
          {methods.map((m) => {
            const isSelected = selectedMethod === m.id;
            return (
              <div
                key={m.id}
                onClick={() => onSelectMethod?.(m.id)}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isSelected
                    ? 'border-sky-500 bg-sky-50/40 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-sky-500 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {m.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-xs sm:text-sm">
                        {m.title}
                      </span>
                      {m.tag && (
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                            isSelected
                              ? 'bg-sky-100 text-sky-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {m.tag}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">{m.subtitle}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      isSelected
                        ? 'border-sky-500 bg-sky-500 text-white'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {isSelected && <CheckCircle2 className="w-4 h-4 fill-white text-sky-500" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* PromptPay QR Simulated Box when PromptPay is selected */}
        {selectedMethod === 'promptpay' && (
          <div className="p-4 rounded-2xl bg-gradient-to-b from-sky-50/80 to-white border border-sky-200/80 text-center space-y-3 mt-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-sky-100 text-sky-800 text-xs font-bold rounded-full">
              <QrCode className="w-3.5 h-3.5" />
              <span>PromptPay Cross-Bank QR Code</span>
            </div>

            <div className="w-44 h-44 mx-auto bg-white p-3 rounded-2xl border-2 border-dashed border-sky-300 shadow-sm flex flex-col items-center justify-center relative">
              {/* Simulated QR Pattern Visual */}
              <div className="w-full h-full bg-slate-900 p-2 rounded-lg flex flex-col justify-between">
                <div className="flex justify-between">
                  <div className="w-9 h-9 border-4 border-white bg-slate-900 rounded-sm flex items-center justify-center">
                    <div className="w-4 h-4 bg-white rounded-xs"></div>
                  </div>
                  <div className="w-9 h-9 border-4 border-white bg-slate-900 rounded-sm flex items-center justify-center">
                    <div className="w-4 h-4 bg-white rounded-xs"></div>
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  <div className="px-2 py-1 bg-sky-500 text-white text-[9px] font-black rounded-md tracking-wider">
                    CAREMATE
                  </div>
                </div>
                <div className="flex justify-between">
                  <div className="w-9 h-9 border-4 border-white bg-slate-900 rounded-sm flex items-center justify-center">
                    <div className="w-4 h-4 bg-white rounded-xs"></div>
                  </div>
                  <div className="w-9 h-9 flex flex-wrap gap-1 p-1">
                    <div className="w-2 h-2 bg-white rounded-xs"></div>
                    <div className="w-2 h-2 bg-white rounded-xs"></div>
                    <div className="w-2 h-2 bg-white rounded-xs"></div>
                    <div className="w-2 h-2 bg-white rounded-xs"></div>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-xs font-semibold text-slate-700">
              {t('book.qrScanInstruction', 'ยอดชำระ:')}{' '}
              <span className="text-emerald-600 font-bold text-sm">
                ฿{totalAmount}
              </span>
            </p>
            <p className="text-[11px] text-slate-400">
              {t('book.qrExpiryNotice', 'QR Code จะหมดอายุภายใน 15 นาทีหลังสร้างรายการ')}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default PaymentMethodSelector;
