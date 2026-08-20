import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Accessibility, CheckCircle2 } from 'lucide-react';
import { elderMobilityOptions, getEnumLabel, mobilityAidOptions } from '../../constants/careEnums';

export function MobilitySection({
  mobilityLevel = 'wheelchair_assisted',
  mobilityAids = [],
  onChange,
  className = '',
}) {
  const { t, language } = useLanguage();

  const handleAidToggle = (aidId) => {
    const current = Array.isArray(mobilityAids) ? mobilityAids : [];
    if (current.includes(aidId)) {
      onChange('mobilityAids', current.filter((a) => a !== aidId));
    } else {
      onChange('mobilityAids', [...current, aidId]);
    }
  };

  return (
    <Card className={`border-slate-200/80 shadow-xs ${className}`}>
      <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
            <Accessibility className="w-4 h-4" />
          </div>
          <div>
            <CardTitle className="text-base sm:text-lg font-bold text-slate-900">
              {t('elderProfile.mobilitySectionTitle', 'ระดับการเคลื่อนไหว & อุปกรณ์ช่วยเหลือ (Mobility & Assistance Aids)')}
            </CardTitle>
            <p className="text-xs text-slate-500">
              {t('elderProfile.mobilitySectionSubtitle', 'ระบุความสามารถทางกายภาพเพื่อจัดเตรียมผู้ดูแลและพาหนะที่เหมาะสม')}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-5 sm:p-6 space-y-6">
        {/* Mobility Level Selector */}
        <div className="space-y-2">
          <label
            htmlFor="mobility-input"
            className="text-xs sm:text-sm font-bold text-slate-800 block"
          >
            {t('elderProfile.mobilityLevelLabel', 'ระดับการเคลื่อนไหว (Mobility Level)')}
          </label>

          {/* Standard Select for easy DOM access & test match */}
          <select
            id="mobility-input"
            value={mobilityLevel}
            onChange={(e) => onChange('mobilityLevel', e.target.value)}
            className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 shadow-2xs mb-3"
          >
            {elderMobilityOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {getEnumLabel(option, language)}
              </option>
            ))}
          </select>

          {/* Interactive Card Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {elderMobilityOptions.map((opt) => {
              const isSelected = mobilityLevel === opt.id;
              return (
                <div
                  key={opt.id}
                  onClick={() => onChange('mobilityLevel', opt.id)}
                  className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                    isSelected
                      ? 'border-sky-500 bg-sky-50/50 shadow-2xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-bold text-xs sm:text-sm text-slate-900">
                      {getEnumLabel(opt, language)}
                    </span>
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                        isSelected
                          ? 'border-sky-500 bg-sky-500 text-white'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5 fill-white text-sky-500" />}
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    {getEnumLabel(opt, language, 'description')}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobility Aids Checkboxes */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <label className="text-xs sm:text-sm font-bold text-slate-800 block">
            {t('elderProfile.mobilityAidsLabel', 'อุปกรณ์ช่วยเหลือที่นำติดตัวไป:')}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {mobilityAidOptions.map((aid) => {
              const isChecked = (mobilityAids || []).includes(aid.id);
              return (
                <label
                  key={aid.id}
                  className={`flex items-center gap-2 p-2.5 rounded-xl border transition-all cursor-pointer ${
                    isChecked
                      ? 'border-sky-500 bg-sky-50 text-sky-900 font-semibold'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleAidToggle(aid.id)}
                    className="w-4 h-4 rounded-md text-sky-600 focus:ring-sky-500"
                  />
                  <span className="text-xs">{getEnumLabel(aid, language)}</span>
                </label>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default MobilitySection;
