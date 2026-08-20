import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { CardTitle } from '../ui/Card';
import { Sparkles, Activity, ShieldAlert, Pill, Award } from 'lucide-react';

export default function Step1Physical({ formData, setFormData, elder }) {
  const { t, getLocalized } = useLanguage();

  const elderName = elder ? (getLocalized(elder, 'name') || getLocalized(elder, 'nickname')) : '';

  const mobilityOptions = [
    {
      id: 'independent',
      title: t('find.step1.mobilityIndependent', 'เดินได้ด้วยตนเอง (คล่องแคล่ว)'),
      desc: t('find.step1.mobilityIndependentDesc', 'เคลื่อนไหวได้ด้วยตนเอง ไม่ต้องใช้อุปกรณ์พยุง'),
    },
    {
      id: 'cane',
      title: t('find.step1.mobilityWalkingCane', 'เดินช้าๆ / ต้องการคนช่วยพยุง'),
      desc: t('find.step1.mobilityWalkingCaneDesc', 'เดินได้แต่ต้องการคนคอยพยุงแขนหรือใช้ไม้เท้า'),
    },
    {
      id: 'wheelchair_assisted',
      title: t('find.step1.mobilityWheelchair', 'ใช้วีลแชร์เมื่อเดินทางไกลหรือต้องเข็นตลอดเวลา'),
      desc: t('find.step1.mobilityWheelchairDesc', 'มีรถเข็นวีลแชร์ ต้องการคนช่วยเข็นและยกขึ้นลง'),
    },
    {
      id: 'full_assistance',
      title: t('find.step1.mobilityFullAssistance', 'ต้องการการดูแลเป็นพิเศษ / ลุกนั่งลำบาก'),
      desc: t('find.step1.mobilityFullAssistanceDesc', 'ลุกนั่งลำบาก ต้องการการดูแลอย่างใกล้ชิด'),
    },
  ];

  const conditionOptions = [
    { id: 'hypertension', label: t('find.step1.condHypertension', 'ความดันโลหิตสูง') },
    { id: 'diabetes', label: t('find.step1.condDiabetes', 'เบาหวาน') },
    { id: 'heart', label: t('find.step1.condHeart', 'โรคหัวใจ / หลอดเลือด') },
    { id: 'knee', label: t('find.step1.condKnee', 'ข้อเข่าเสื่อม / ปวดข้อ') },
    { id: 'dementia', label: t('find.step1.condDementia', 'ภาวะความจำเสื่อม / อัลไซเมอร์') },
    { id: 'none', label: t('find.step1.condNone', 'ไม่มีโรคประจำตัวร้ายแรง') },
  ];

  const handleToggleCondition = (condId) => {
    const currentConditions = Array.isArray(formData.conditions) ? formData.conditions : [];
    if (condId === 'none') {
      setFormData({ ...formData, conditions: ['none'] });
      return;
    }

    const filtered = currentConditions.filter((c) => c !== 'none');
    const isSelected = filtered.includes(condId);
    const updated = isSelected ? filtered.filter((c) => c !== condId) : [...filtered, condId];
    setFormData({ ...formData, conditions: updated });
  };

  return (
    <div className="space-y-6">
      {/* Auto-fill notification if elder profile is present */}
      {elder && elderName && (
        <div className="flex items-center gap-2.5 p-3.5 sm:p-4 bg-sky-50/90 border border-sky-200/80 rounded-2xl text-xs sm:text-sm text-sky-800 shadow-xs">
          <Sparkles className="w-5 h-5 text-sky-600 shrink-0 animate-pulse" />
          <span>{t('find.elderAutoFillNotice', { name: elderName })}</span>
        </div>
      )}

      {/* Header */}
      <div className="space-y-1">
        <CardTitle as="h2" className="text-xl sm:text-2xl font-bold text-slate-900">
          {t('find.step1.title', 'ความต้องการด้านร่างกาย & การเคลื่อนไหว')}
        </CardTitle>
        <p className="text-xs sm:text-sm text-slate-500">
          {t('find.step1.desc', 'ระบุระดับความสามารถในการเดินเหินและโรคประจำตัวของผู้สูงอายุ')}
        </p>
      </div>

      {/* 1. Mobility Level Selector */}
      <div className="space-y-3">
        <label className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
          <Activity className="w-4 h-4 text-sky-500" />
          {t('find.step1.mobilityLabel', 'ระดับความคล่องตัวของผู้สูงอายุ')}
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {mobilityOptions.map((opt) => {
            const isSelected = formData.mobility === opt.id;
            return (
              <label
                key={opt.id}
                className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'border-sky-500 bg-sky-50/60 text-sky-950 ring-2 ring-sky-500/20 shadow-xs'
                    : 'border-slate-200 hover:bg-slate-50/80 hover:border-slate-300 text-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="mobility"
                  value={opt.id}
                  checked={isSelected}
                  onChange={() => setFormData({ ...formData, mobility: opt.id })}
                  className="mt-1 text-sky-600 focus:ring-sky-500 shrink-0"
                />
                <div className="space-y-1 min-w-0">
                  <span className="text-xs sm:text-sm font-bold block">{opt.title}</span>
                  <span className="text-[11px] text-slate-500 block leading-tight">{opt.desc}</span>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* 2. Medical Conditions Multi-Select Chips */}
      <div className="space-y-3">
        <label className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
          <ShieldAlert className="w-4 h-4 text-rose-500" />
          {t('find.step1.conditionsLabel', 'โรคประจำตัวหรือข้อจำกัดด้านสุขภาพ (เลือกได้หลายข้อ)')}
        </label>
        <div className="flex flex-wrap gap-2">
          {conditionOptions.map((cond) => {
            const isSelected = (formData.conditions || []).includes(cond.id);
            return (
              <button
                key={cond.id}
                type="button"
                onClick={() => handleToggleCondition(cond.id)}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-sky-500 text-white border-sky-500 shadow-xs ring-2 ring-sky-500/20'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                {cond.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Medication Assistance Toggle */}
      <div className="space-y-3 pt-2">
        <label className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
          <Pill className="w-4 h-4 text-emerald-500" />
          {t('find.step1.medsLabel', 'ต้องการให้ผู้ดูแลช่วยเตือนหรือจัดการทานยาหรือไม่?')}
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label
            className={`flex items-center gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
              formData.needsMedicationReminder === true
                ? 'border-emerald-500 bg-emerald-50/60 text-emerald-950 ring-2 ring-emerald-500/20 shadow-xs'
                : 'border-slate-200 hover:bg-slate-50 text-slate-700'
            }`}
          >
            <input
              type="radio"
              name="medicationReminder"
              checked={formData.needsMedicationReminder === true}
              onChange={() => setFormData({ ...formData, needsMedicationReminder: true })}
              className="text-emerald-600 focus:ring-emerald-500"
            />
            <span className="text-xs sm:text-sm font-semibold">{t('find.step1.medsYes', 'ต้องการ (ช่วยเตือนและเตรียมยาตามเวลา)')}</span>
          </label>

          <label
            className={`flex items-center gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
              formData.needsMedicationReminder === false
                ? 'border-slate-400 bg-slate-100/70 text-slate-900 ring-2 ring-slate-400/20 shadow-xs'
                : 'border-slate-200 hover:bg-slate-50 text-slate-700'
            }`}
          >
            <input
              type="radio"
              name="medicationReminder"
              checked={formData.needsMedicationReminder === false}
              onChange={() => setFormData({ ...formData, needsMedicationReminder: false })}
              className="text-slate-600 focus:ring-slate-500"
            />
            <span className="text-xs sm:text-sm font-semibold">{t('find.step1.medsNo', 'ไม่ต้องการ (ทานยาเองได้หรือไม่มีมื้อยา)')}</span>
          </label>
        </div>
      </div>

      {/* 4. Specialized Care Qualification Tier */}
      <div className="space-y-3 pt-2">
        <label className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
          <Award className="w-4 h-4 text-amber-500" />
          {t('find.step1.specialCareLabel', 'ทักษะการดูแลพิเศษที่ต้องการ')}
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { id: 'none', label: t('find.step1.specialCareNone', 'ผู้ดูแลทั่วไปที่ผ่านการอบรม') },
            { id: 'nurse', label: t('find.step1.specialCareNurse', 'ต้องการพยาบาลวิชาชีพ / ผู้ช่วยพยาบาล') },
            { id: 'physical', label: t('find.step1.specialCarePhysical', 'ต้องการนักกายภาพบำบัดฝึกหัด / ช่วยฟื้นฟู') },
          ].map((care) => {
            const isSelected = formData.specialCareType === care.id;
            return (
              <label
                key={care.id}
                className={`flex items-center gap-2.5 p-3 rounded-2xl border cursor-pointer text-xs font-semibold transition-all ${
                  isSelected
                    ? 'border-sky-500 bg-sky-50/60 text-sky-950 ring-2 ring-sky-500/20'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="specialCareType"
                  value={care.id}
                  checked={isSelected}
                  onChange={() => setFormData({ ...formData, specialCareType: care.id })}
                  className="text-sky-600 focus:ring-sky-500 shrink-0"
                />
                <span>{care.label}</span>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
}
