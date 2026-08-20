import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { User, Camera, Heart, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';

export function GeneralInfoSection({
  formData,
  onChange,
  className = '',
}) {
  const { t } = useLanguage();

  return (
    <Card className={`border-slate-200/80 shadow-xs ${className}`}>
      <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-600">
            <User className="w-4 h-4" />
          </div>
          <div>
            <CardTitle className="text-base sm:text-lg font-bold text-slate-900">
              {t('elderProfile.generalInfoTitle', 'ข้อมูลทั่วไป (General Info)')}
            </CardTitle>
            <p className="text-xs text-slate-500">
              {t('elderProfile.generalInfoSubtitle', 'ข้อมูลประจำตัวและประวัติส่วนตัวเบื้องต้นของผู้สูงอายุ')}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-5 sm:p-6 space-y-6">
        {/* Photo Upload Mockup */}
        <div className="flex flex-col sm:flex-row items-center gap-4 pb-4 border-b border-slate-100">
          <div className="relative group">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl overflow-hidden bg-slate-100 border-2 border-white shadow-md">
              <img
                src={
                  formData.photo ||
                  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=80'
                }
                alt="Elder photo preview"
                className="w-full h-full object-cover"
              />
            </div>
            <button
              type="button"
              className="absolute -bottom-1 -right-1 p-2 bg-sky-500 hover:bg-sky-600 text-white rounded-xl shadow-sm transition-transform group-hover:scale-110 cursor-pointer"
              title={t('elderProfile.changePhotoBtn', 'เปลี่ยนรูปภาพ')}
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="text-center sm:text-left space-y-1">
            <h4 className="font-bold text-slate-900 text-sm sm:text-base">
              {formData.nameTh || 'คุณยายสมพร'}
            </h4>
            <p className="text-xs text-slate-500 max-w-sm">
              {t(
                'elderProfile.photoHint',
                'แนะนำรูปถ่ายหน้าตรงที่มองเห็นใบหน้าชัดเจน เพื่อให้ผู้ดูแลจดจำได้ง่าย'
              )}
            </p>
          </div>
        </div>

        {/* Form Inputs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Full Name */}
          <div className="space-y-1.5 sm:col-span-2">
            <label
              htmlFor="name-input"
              className="text-xs sm:text-sm font-bold text-slate-800 block"
            >
              {t('elderProfile.fullNameLabel', 'ชื่อ-นามสกุล')}
            </label>
            <input
              id="name-input"
              type="text"
              value={formData.nameTh}
              onChange={(e) => {
                onChange('nameTh', e.target.value);
                onChange('nameEn', e.target.value);
              }}
              placeholder={t('elderProfile.fullNamePlaceholder', 'เช่น นางสมพร ใจดี')}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 shadow-2xs"
            />
          </div>

          {/* Nickname */}
          <div className="space-y-1.5">
            <label
              htmlFor="nickname-input"
              className="text-xs sm:text-sm font-bold text-slate-800 block"
            >
              {t('elderProfile.nicknameLabel', 'ชื่อเล่น')}
            </label>
            <input
              id="nickname-input"
              type="text"
              value={formData.nickname}
              onChange={(e) => onChange('nickname', e.target.value)}
              placeholder="เช่น คุณยายสมพร"
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 shadow-2xs"
            />
          </div>

          {/* Age */}
          <div className="space-y-1.5">
            <label
              htmlFor="age-input"
              className="text-xs sm:text-sm font-bold text-slate-800 block"
            >
              {t('elderProfile.ageLabel', 'อายุ (ปี)')}
            </label>
            <input
              id="age-input"
              type="number"
              min="1"
              max="130"
              value={formData.age}
              onChange={(e) => onChange('age', e.target.value)}
              placeholder="เช่น 74"
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 shadow-2xs"
            />
          </div>

          {/* Gender */}
          <div className="space-y-1.5">
            <label
              htmlFor="gender-input"
              className="text-xs sm:text-sm font-bold text-slate-800 block"
            >
              {t('elderProfile.genderLabel', 'เพศ')}
            </label>
            <select
              id="gender-input"
              value={formData.gender}
              onChange={(e) => onChange('gender', e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 shadow-2xs"
            >
              <option value="female">{t('common.female', 'หญิง (Female)')}</option>
              <option value="male">{t('common.male', 'ชาย (Male)')}</option>
              <option value="other">{t('common.other', 'อื่นๆ (Other)')}</option>
            </select>
          </div>

          {/* Blood Type */}
          <div className="space-y-1.5">
            <label
              htmlFor="blood-type-input"
              className="text-xs sm:text-sm font-bold text-slate-800 block"
            >
              {t('elderProfile.bloodTypeLabel', 'กรุ๊ปเลือด')}
            </label>
            <select
              id="blood-type-input"
              value={formData.bloodType}
              onChange={(e) => onChange('bloodType', e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 shadow-2xs"
            >
              <option value="O+">O Rh-positive (O+)</option>
              <option value="A+">A Rh-positive (A+)</option>
              <option value="B+">B Rh-positive (B+)</option>
              <option value="AB+">AB Rh-positive (AB+)</option>
              <option value="O-">O Rh-negative (O-)</option>
              <option value="A-">A Rh-negative (A-)</option>
              <option value="B-">B Rh-negative (B-)</option>
              <option value="AB-">AB Rh-negative (AB-)</option>
            </select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default GeneralInfoSection;
