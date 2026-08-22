import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { CardTitle } from '../ui/Card';

export default function Step2Location({ formData, setFormData, elder }) {
  const { language, getLocalized } = useLanguage();
  const elderAddress = elder ? getLocalized(elder, 'address') : '';
  const elderHospital = elder ? getLocalized(elder, 'preferredHospital') : '';

  const updateField = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const useProfileAddress = () => {
    if (!elderAddress) return;
    updateField('pickupAddress', elderAddress);
  };

  const usePreferredHospital = () => {
    if (!elderHospital) return;
    updateField('destination', elderHospital);
  };

  return (
    <div className="grid h-full min-h-0 grid-rows-[auto_1fr_1fr] gap-[1.45dvh] sm:block sm:space-y-6">
      <div>
        <CardTitle as="h2" className="text-[clamp(1.08rem,5vw,1.28rem)] font-black leading-tight text-slate-900 sm:text-2xl">
          {language === 'th' ? 'สถานที่รับและไปส่ง' : 'Pickup & Drop-off'}
        </CardTitle>
      </div>

      <section className="flex min-h-0 flex-col justify-center gap-[0.85dvh] border-t border-slate-100 pt-[1.2dvh] sm:gap-3 sm:border sm:border-slate-100 sm:p-4">
        <div className="flex items-center justify-between gap-3">
          <label htmlFor="pickup-address" className="text-[clamp(0.78rem,3.3vw,0.94rem)] font-black text-slate-900 sm:text-sm">
            {language === 'th' ? 'จุดรับ' : 'Pickup'}
          </label>
          {elderAddress && (
            <button
              type="button"
              onClick={useProfileAddress}
              className="h-[3.2dvh] rounded-full bg-sub1-50 px-[2.5vw] text-[clamp(0.6rem,2.5vw,0.72rem)] font-black text-primary-700 ring-1 ring-sub1-200 active:scale-[0.985] sm:h-auto sm:px-3 sm:py-1.5 sm:text-xs"
            >
              {language === 'th' ? 'ใช้โปรไฟล์' : 'Use profile'}
            </button>
          )}
        </div>
        <textarea
          id="pickup-address"
          rows={2}
          value={formData.pickupAddress || ''}
          onChange={(event) => updateField('pickupAddress', event.target.value)}
          placeholder={language === 'th' ? 'เช่น บ้านคุณแม่ ซอยสุขุมวิท 39' : 'e.g. Mom home, Sukhumvit 39'}
          className="h-[9dvh] w-full resize-none rounded-[min(3.8vw,0.95rem)] border border-slate-200 bg-white px-[3.2vw] py-[1.1dvh] text-[clamp(0.8rem,3.35vw,0.96rem)] font-bold leading-snug text-slate-900 shadow-xs placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500 sm:h-auto sm:rounded-2xl sm:p-3 sm:text-sm"
        />
      </section>

      <section className="flex min-h-0 flex-col justify-center gap-[0.85dvh] border-t border-slate-100 pt-[1.2dvh] sm:gap-3 sm:border sm:border-slate-100 sm:p-4">
        <div className="flex items-center justify-between gap-3">
          <label htmlFor="dropoff-address" className="text-[clamp(0.78rem,3.3vw,0.94rem)] font-black text-slate-900 sm:text-sm">
            {language === 'th' ? 'จุดไปส่ง' : 'Drop-off'}
          </label>
          {elderHospital && (
            <button
              type="button"
              onClick={usePreferredHospital}
              className="h-[3.2dvh] rounded-full bg-sub2-50 px-[2.5vw] text-[clamp(0.6rem,2.5vw,0.72rem)] font-black text-sub2-700 ring-1 ring-sub2-200 active:scale-[0.985] sm:h-auto sm:px-3 sm:py-1.5 sm:text-xs"
            >
              {language === 'th' ? 'ใช้รพ.เดิม' : 'Use hospital'}
            </button>
          )}
        </div>
        <textarea
          id="dropoff-address"
          rows={2}
          value={formData.destination || ''}
          onChange={(event) => updateField('destination', event.target.value)}
          placeholder={language === 'th' ? 'เช่น โรงพยาบาลศิริราช อาคารนวมินทร์' : 'e.g. Siriraj Hospital, Navamindrapobitr Building'}
          className="h-[9dvh] w-full resize-none rounded-[min(3.8vw,0.95rem)] border border-slate-200 bg-white px-[3.2vw] py-[1.1dvh] text-[clamp(0.8rem,3.35vw,0.96rem)] font-bold leading-snug text-slate-900 shadow-xs placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500 sm:h-auto sm:rounded-2xl sm:p-3 sm:text-sm"
        />
      </section>
    </div>
  );
}
