import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Utensils, Globe2, BookOpen, MessageCircleHeart } from 'lucide-react';

export function PreferencesSection({
  languages = ['Thai'],
  religion = 'Buddhism',
  dietary = 'low_sodium',
  specialNotes = '',
  onChange,
  className = '',
}) {
  const { t } = useLanguage();

  const availableLanguages = [
    { id: 'Thai', labelTh: 'ภาษาไทย (กลาง)', labelEn: 'Central Thai' },
    { id: 'Isan', labelTh: 'ภาษาอีสาน', labelEn: 'Isan Dialect' },
    { id: 'Northern', labelTh: 'ภาษาเหนือ (คำเมือง)', labelEn: 'Northern Thai' },
    { id: 'Southern', labelTh: 'ภาษาใต้', labelEn: 'Southern Thai' },
    { id: 'English', labelTh: 'ภาษาอังกฤษ', labelEn: 'English' },
    { id: 'Teochew', labelTh: 'ภาษาแต้จิ๋ว / จีน', labelEn: 'Teochew / Chinese' },
  ];

  const handleLanguageToggle = (langId) => {
    const current = Array.isArray(languages) ? languages : ['Thai'];
    if (current.includes(langId)) {
      if (current.length > 1) {
        onChange('preferredLanguages', current.filter((l) => l !== langId));
      }
    } else {
      onChange('preferredLanguages', [...current, langId]);
    }
  };

  return (
    <Card className={`border-slate-200/80 shadow-xs ${className}`}>
      <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600">
            <Utensils className="w-4 h-4" />
          </div>
          <div>
            <CardTitle className="text-base sm:text-lg font-bold text-slate-900">
              {t('elderProfile.dietSectionTitle', 'ความชอบด้านอาหารและไลฟ์สไตล์ (Preferences & Lifestyle)')}
            </CardTitle>
            <p className="text-xs text-slate-500">
              {t('elderProfile.preferencesSubtitle', 'ภาษา ศาสนา ข้อจำกัดด้านอาหาร และความต้องการส่วนบุคคล')}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-5 sm:p-6 space-y-6">
        {/* Preferred Languages */}
        <div className="space-y-2">
          <label className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5">
            <Globe2 className="w-4 h-4 text-sky-500" />
            <span>{t('elderProfile.preferredLanguagesLabel', 'ภาษาและสำเนียงที่ชอบสื่อสาร')}</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {availableLanguages.map((lang) => {
              const isSelected = (languages || []).includes(lang.id);
              return (
                <button
                  key={lang.id}
                  type="button"
                  onClick={() => handleLanguageToggle(lang.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-sky-500 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {lang.labelTh}
                </button>
              );
            })}
          </div>
        </div>

        {/* Religion & Dietary Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
          <div className="space-y-1.5">
            <label
              htmlFor="religion-input"
              className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5"
            >
              <BookOpen className="w-4 h-4 text-indigo-500" />
              <span>{t('elderProfile.religionLabel', 'ศาสนาและความชอบทางวัฒนธรรม')}</span>
            </label>
            <select
              id="religion-input"
              value={religion}
              onChange={(e) => onChange('religion', e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 shadow-2xs"
            >
              <option value="Buddhism">{t('common.buddhism', 'พุทธ (Buddhism)')}</option>
              <option value="Christianity">{t('common.christianity', 'คริสต์ (Christianity)')}</option>
              <option value="Islam">{t('common.islam', 'อิสลาม (Islam)')}</option>
              <option value="None">{t('common.none', 'ไม่ระบุ / อื่นๆ (Other)')}</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="dietary-input"
              className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5"
            >
              <Utensils className="w-4 h-4 text-emerald-500" />
              <span>{t('elderProfile.dietaryPreferencesLabel', 'ข้อจำกัดและความชอบด้านอาหาร')}</span>
            </label>
            <select
              id="dietary-input"
              value={dietary}
              onChange={(e) => onChange('dietary', e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 shadow-2xs"
            >
              <option value="low_sodium">อาหารรสอ่อน / โซเดียมต่ำ (Low Sodium)</option>
              <option value="diabetic">อาหารควบคุมน้ำตาล (Diabetic Diet)</option>
              <option value="soft_food">อาหารอ่อน / เคี้ยวง่าย (Soft Food)</option>
              <option value="no_beef">ไม่ทานเนื้อวัว (No Beef)</option>
              <option value="vegetarian">มังสวิรัติ / เจ (Vegetarian)</option>
              <option value="halal">ฮาลาล (Halal)</option>
              <option value="regular">ทานได้ทั่วไป (Regular)</option>
            </select>
          </div>
        </div>

        {/* Special Notes */}
        <div className="space-y-1.5 pt-2 border-t border-slate-100">
          <label
            htmlFor="special-notes-input"
            className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5"
          >
            <MessageCircleHeart className="w-4 h-4 text-rose-500" />
            <span>{t('elderProfile.specialNotesLabel', 'ข้อควรระวังหรือสิ่งที่ผู้สูงอายุชอบเป็นพิเศษ')}</span>
          </label>
          <textarea
            id="special-notes-input"
            rows={3}
            value={specialNotes}
            onChange={(e) => onChange('specialNotes', e.target.value)}
            placeholder={t(
              'elderProfile.specialNotesPlaceholder',
              'เช่น ไม่ชอบอากาศร้อนจัด, เดินได้ช้าต้องคอยพัก, ชอบชวนคุยเรื่องต้นไม้...'
            )}
            className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 shadow-2xs resize-y"
          />
        </div>
      </CardContent>
    </Card>
  );
}

export default PreferencesSection;
