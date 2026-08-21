import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { CardTitle } from '../ui/Card';
import { CheckCircle2, FileText, ShieldCheck, UserCheck, Users, X } from 'lucide-react';
import {
  caretakerRequirementOptions,
  getCaretakerRequirementMeta,
  getEnumLabel,
} from '../../constants/careEnums';

const GENDERS = [
  { id: 'any', th: 'เพศใดก็ได้', en: 'Any' },
  { id: 'female', th: 'ผู้หญิง', en: 'Female' },
  { id: 'male', th: 'ผู้ชาย', en: 'Male' },
];

const MAX_REQUIREMENTS = 5;

export default function Step3CaretakerDetails({ formData, setFormData }) {
  const { language } = useLanguage();
  const selectedRequirements = (Array.isArray(formData.caretakerRequirements)
    ? formData.caretakerRequirements
    : []
  ).filter((requirementId) => getCaretakerRequirementMeta(requirementId));
  const selectedRequirementMetas = selectedRequirements
    .map(getCaretakerRequirementMeta)
    .filter(Boolean);
  const isMaxSelected = selectedRequirements.length >= MAX_REQUIREMENTS;

  const toggleRequirement = (requirementId) => {
    const alreadySelected = selectedRequirements.includes(requirementId);
    if (!alreadySelected && isMaxSelected) return;

    const nextRequirements = alreadySelected
      ? selectedRequirements.filter((id) => id !== requirementId)
      : [...selectedRequirements, requirementId];

    setFormData({
      ...formData,
      caretakerRequirements: nextRequirements,
    });
  };

  const removeRequirement = (requirementId) => {
    setFormData({
      ...formData,
      caretakerRequirements: selectedRequirements.filter((id) => id !== requirementId),
    });
  };

  return (
    <div className="h-full min-h-0 space-y-[1.15dvh] sm:h-auto sm:space-y-6">
      <div className="space-y-[0.25dvh] sm:space-y-1">
        <CardTitle as="h2" className="text-[clamp(1.08rem,5vw,1.28rem)] font-black leading-tight text-slate-900 sm:text-2xl">
          {language === 'th' ? 'ต้องการผู้ดูแลแบบไหน' : 'Caretaker Preferences'}
        </CardTitle>
        <p className="hidden text-[clamp(0.7rem,2.95vw,0.82rem)] font-semibold leading-tight text-slate-500 sm:block sm:text-sm">
          {language === 'th'
            ? 'เลือกข้อจำกัดที่สำคัญ เพื่อให้เราแนะนำผู้ดูแลได้ตรงขึ้น'
            : 'Choose important constraints so we can recommend a better match.'}
        </p>
      </div>

      <div className="space-y-[0.75dvh] sm:space-y-2.5">
        <label className="flex items-center gap-1.5 text-[clamp(0.7rem,2.95vw,0.82rem)] font-black text-slate-800 sm:text-sm">
          <Users className="h-[1.8dvh] w-[1.8dvh] text-sky-500 sm:h-4 sm:w-4" />
          {language === 'th' ? 'เพศของผู้ดูแล' : 'Caretaker gender'}
        </label>
        <select
          value={formData.genderPref || 'any'}
          onChange={(event) => setFormData({ ...formData, genderPref: event.target.value })}
          className="h-[5dvh] w-full rounded-[min(3.5vw,0.9rem)] border border-slate-200 bg-white px-[3vw] text-[clamp(0.8rem,3.35vw,0.94rem)] font-black text-slate-900 shadow-xs focus:outline-none focus:ring-2 focus:ring-sky-500 sm:h-auto sm:rounded-2xl sm:p-3 sm:text-sm"
        >
          {GENDERS.map((gender) => (
            <option key={gender.id} value={gender.id}>
              {language === 'th' ? gender.th : gender.en}
            </option>
          ))}
        </select>
      </div>

      <div className="min-h-0 space-y-[0.7dvh] sm:space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          <label className="flex items-center gap-1.5 text-[clamp(0.7rem,2.95vw,0.82rem)] font-black text-slate-800 sm:text-sm">
            <ShieldCheck className="h-[1.8dvh] w-[1.8dvh] text-emerald-500 sm:h-4 sm:w-4" />
            {language === 'th' ? 'ข้อจำกัดเกี่ยวกับผู้ดูแล' : 'Caretaker constraints'}
          </label>
          <span className="rounded-full bg-slate-100 px-[2vw] py-[0.35dvh] text-[clamp(0.58rem,2.4vw,0.68rem)] font-black text-slate-500">
            {selectedRequirements.length}/{MAX_REQUIREMENTS}
          </span>
        </div>

        <div className="min-h-[3.1dvh] rounded-[min(3.2vw,0.8rem)] bg-slate-50 px-[2vw] py-[0.55dvh] ring-1 ring-slate-100 sm:rounded-2xl sm:p-2">
          {selectedRequirementMetas.length > 0 ? (
            <div className="flex flex-wrap gap-[1vw] sm:gap-1.5">
              {selectedRequirementMetas.map((requirement) => (
                <span
                  key={requirement.id}
                  className="inline-flex h-[2.55dvh] items-center gap-[0.8vw] rounded-full bg-white px-[1.8vw] text-[clamp(0.58rem,2.4vw,0.68rem)] font-black text-emerald-800 shadow-sm ring-1 ring-emerald-100 sm:h-7 sm:gap-1 sm:px-2.5 sm:text-xs"
                >
                  {getEnumLabel(requirement, language, 'shortLabel')}
                  <button
                    type="button"
                    aria-label={`${language === 'th' ? 'ลบ' : 'Remove'} ${getEnumLabel(requirement, language, 'shortLabel')}`}
                    onClick={() => removeRequirement(requirement.id)}
                    className="grid h-[1.75dvh] w-[1.75dvh] place-items-center rounded-full bg-emerald-50 text-emerald-700 active:scale-95 sm:h-5 sm:w-5"
                  >
                    <X className="h-[1.05dvh] w-[1.05dvh] sm:h-3 sm:w-3" />
                  </button>
                </span>
              ))}
            </div>
          ) : (
            <span className="block text-[clamp(0.58rem,2.4vw,0.68rem)] font-bold text-slate-400 sm:text-xs">
              {language === 'th' ? 'ยังไม่ได้เลือกข้อจำกัด' : 'No constraints selected'}
            </span>
          )}
        </div>

        <div
          className="grid max-h-[17.4dvh] grid-cols-2 gap-[1.8vw] overflow-y-auto rounded-[min(3.8vw,0.95rem)] bg-white pr-[1vw] ring-1 ring-slate-100 sm:max-h-56 sm:gap-2.5 sm:rounded-2xl sm:p-1"
          aria-label={language === 'th' ? 'รายการข้อจำกัดเกี่ยวกับผู้ดูแล' : 'Caretaker constraint options'}
        >
          {caretakerRequirementOptions.map((requirement) => {
            const isSelected = selectedRequirements.includes(requirement.id);
            const isDisabled = !isSelected && isMaxSelected;
            return (
              <button
                key={requirement.id}
                type="button"
                disabled={isDisabled}
                onClick={() => toggleRequirement(requirement.id)}
                className={`relative flex min-h-[4.75dvh] items-center justify-center rounded-[min(3.3vw,0.82rem)] border px-[1.9vw] text-center text-[clamp(0.64rem,2.72vw,0.76rem)] font-black leading-tight transition-all active:scale-[0.985] sm:min-h-12 sm:rounded-2xl sm:px-3 sm:py-3 sm:text-sm ${
                  isSelected
                    ? 'border-emerald-400 bg-emerald-50 text-emerald-800 shadow-sm ring-2 ring-emerald-500/15'
                    : isDisabled
                    ? 'border-slate-100 bg-slate-50 text-slate-300'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-white'
                }`}
              >
                {isSelected && (
                  <CheckCircle2 className="absolute right-[1.5vw] top-[0.65dvh] h-[1.65dvh] w-[1.65dvh] text-emerald-600 sm:h-4 sm:w-4" />
                )}
                {getEnumLabel(requirement, language, 'label')}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-[0.75dvh] sm:space-y-2.5">
        <label className="flex items-center gap-1.5 text-[clamp(0.7rem,2.95vw,0.82rem)] font-black text-slate-800 sm:text-sm">
          <FileText className="h-[1.8dvh] w-[1.8dvh] text-slate-500 sm:h-4 sm:w-4" />
          {language === 'th' ? 'บอกผู้ดูแลเพิ่มเติม' : 'Caretaker note'}
        </label>
        <textarea
          rows={3}
          value={formData.notes || ''}
          onChange={(event) => setFormData({ ...formData, notes: event.target.value })}
          placeholder={
            language === 'th'
              ? 'เช่น คุณแม่เดินช้า ชอบคุยเบา ๆ และไม่ชอบที่ร้อนมาก'
              : 'e.g. Mom walks slowly and prefers calm conversation.'
          }
          className="h-[7.4dvh] w-full resize-none rounded-[min(3.8vw,0.95rem)] border border-slate-200 bg-white px-[3vw] py-[1.05dvh] text-[clamp(0.72rem,3vw,0.84rem)] font-semibold leading-snug text-slate-900 shadow-xs focus:outline-none focus:ring-2 focus:ring-sky-500 sm:h-auto sm:rounded-2xl sm:p-3.5 sm:text-sm"
        />
      </div>

      <div className="hidden items-center gap-[2vw] rounded-[min(3.8vw,0.95rem)] bg-sky-50 px-[3vw] py-[0.9dvh] text-[clamp(0.56rem,2.45vw,0.68rem)] font-bold leading-tight text-sky-800 ring-1 ring-sky-100 sm:flex sm:rounded-2xl sm:px-4 sm:py-3 sm:text-sm">
        <UserCheck className="h-[1.9dvh] w-[1.9dvh] shrink-0 text-sky-600 sm:h-4 sm:w-4" />
        <span>
          {language === 'th'
            ? 'ข้อมูลนี้ใช้กรองผู้ดูแลก่อนส่งผลลัพธ์'
            : 'These preferences filter caretaker results before matching.'}
        </span>
      </div>
    </div>
  );
}
