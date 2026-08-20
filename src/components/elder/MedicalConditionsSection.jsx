import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { HeartPulse, AlertCircle, Pill, Building2, FileCheck } from 'lucide-react';
import { getEnumLabel, medicalConditionOptions } from '../../constants/careEnums';

export function MedicalConditionsSection({
  conditions = [],
  allergies = '',
  medications = '',
  preferredHospital = '',
  hospitalHn = '',
  onChange,
  className = '',
}) {
  const { t, language } = useLanguage();

  const handleToggleCondition = (condId) => {
    const current = Array.isArray(conditions) ? conditions : [];
    if (current.includes(condId)) {
      onChange('conditions', current.filter((c) => c !== condId));
    } else {
      onChange('conditions', [...current, condId]);
    }
  };

  return (
    <Card className={`border-slate-200/80 shadow-xs ${className}`}>
      <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-600">
            <HeartPulse className="w-4 h-4" />
          </div>
          <div>
            <CardTitle className="text-base sm:text-lg font-bold text-slate-900">
              {t('elderProfile.medicalSectionTitle', 'โรคประจำตัว & ข้อมูลสุขภาพ (Medical Conditions & Health)')}
            </CardTitle>
            <p className="text-xs text-slate-500">
              {t('elderProfile.medicalSectionSubtitle', 'บันทึกประวัติการรักษาและยาที่ต้องรับประทาน เพื่อความปลอดภัย')}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-5 sm:p-6 space-y-6">
        {/* Chronic Conditions Pills */}
        <div className="space-y-2">
          <label className="text-xs sm:text-sm font-bold text-slate-800 block">
            {t('elderProfile.chronicConditionsLabel', 'รายการภาวะสุขภาพเรื้อรัง:')}
          </label>
          <div className="flex flex-wrap gap-2">
            {medicalConditionOptions.map((cond) => {
              const isSelected = (conditions || []).includes(cond.id);
              return (
                <button
                  key={cond.id}
                  type="button"
                  onClick={() => handleToggleCondition(cond.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-rose-500 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {getEnumLabel(cond, language)}
                </button>
              );
            })}
          </div>
        </div>

        {/* Medications & Schedule */}
        <div className="space-y-1.5">
          <label
            htmlFor="medications-input"
            className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5"
          >
            <Pill className="w-4 h-4 text-sky-500" />
            <span>{t('elderProfile.medicationsLabel', 'ยาประจำตัวและตารางเวลาทานยา')}</span>
          </label>
          <textarea
            id="medications-input"
            rows={2}
            value={medications}
            onChange={(e) => onChange('medications', e.target.value)}
            placeholder={t(
              'elderProfile.medicationsPlaceholder',
              'เช่น ทานยาความดัน 1 เม็ดหลังอาหารเช้า, พกยาพ่นหอบหืดติดตัว...'
            )}
            className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 shadow-2xs resize-y"
          />
        </div>

        {/* Allergies */}
        <div className="space-y-1.5">
          <label
            htmlFor="allergies-input"
            className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5"
          >
            <AlertCircle className="w-4 h-4 text-rose-500" />
            <span>{t('elderProfile.allergiesLabel', 'ประวัติการแพ้ยา / แพ้อาหาร')}</span>
          </label>
          <input
            id="allergies-input"
            type="text"
            value={allergies}
            onChange={(e) => onChange('allergies', e.target.value)}
            placeholder={t('elderProfile.allergiesPlaceholder', 'เช่น แพ้ยาเพนิซิลลิน, แพ้อาหารทะเล...')}
            className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 shadow-2xs"
          />
        </div>

        {/* Primary Hospital & HN */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
          <div className="space-y-1.5">
            <label
              htmlFor="hospital-input"
              className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5"
            >
              <Building2 className="w-4 h-4 text-emerald-500" />
              <span>{t('elderProfile.preferredHospitalLabel', 'โรงพยาบาลประจำตัว')}</span>
            </label>
            <input
              id="hospital-input"
              type="text"
              value={preferredHospital}
              onChange={(e) => onChange('preferredHospital', e.target.value)}
              placeholder="เช่น โรงพยาบาลศิริราช อาคารนวมินทรบพิตร"
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 shadow-2xs"
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="hn-input"
              className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5"
            >
              <FileCheck className="w-4 h-4 text-indigo-500" />
              <span>{t('elderProfile.hospitalHnLabel', 'หมายเลขประจำตัวผู้ป่วย (HN)')}</span>
            </label>
            <input
              id="hn-input"
              type="text"
              value={hospitalHn}
              onChange={(e) => onChange('hospitalHn', e.target.value)}
              placeholder="เช่น 123456/65"
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 shadow-2xs"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default MedicalConditionsSection;
