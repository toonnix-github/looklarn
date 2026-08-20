import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { CardTitle } from '../ui/Card';
import { Stethoscope, Sun, Trees, ShoppingBag, Coffee, Languages, HeartHandshake, Utensils, Users } from 'lucide-react';

export default function Step2Preferences({ formData, setFormData }) {
  const { t } = useLanguage();

  const activities = [
    {
      id: 'hospital',
      title: t('find.step2.actHospital', 'พาไปโรงพยาบาล / พบแพทย์ & รับยา'),
      icon: <Stethoscope className="w-5 h-5 text-sky-500" />,
    },
    {
      id: 'temple',
      title: t('find.step2.actTemple', 'ไหว้พระทำบุญ & วันพระ'),
      icon: <Sun className="w-5 h-5 text-amber-500" />,
    },
    {
      id: 'park',
      title: t('find.step2.actPark', 'เดินเล่นสวนสาธารณะ & ออกกำลังกายเบาๆ'),
      icon: <Trees className="w-5 h-5 text-emerald-500" />,
    },
    {
      id: 'shopping',
      title: t('find.step2.actShopping', 'ซื้อของใช้ & ช็อปปิ้งในห้าง'),
      icon: <ShoppingBag className="w-5 h-5 text-teal-500" />,
    },
    {
      id: 'social',
      title: t('find.step2.actSocial', 'ร้านอาหาร คาเฟ่ & ร่วมงานสังคม'),
      icon: <Coffee className="w-5 h-5 text-purple-500" />,
    },
  ];

  const languages = [
    { id: 'Thai', label: t('find.step2.langThaiCentral', 'ภาษาไทย (กลาง)') },
    { id: 'Isan', label: t('find.step2.langIsan', 'ภาษาอีสาน') },
    { id: 'Northern', label: t('find.step2.langNorthern', 'ภาษาเหนือ (คำเมือง)') },
    { id: 'Southern', label: t('find.step2.langSouthern', 'ภาษาใต้') },
    { id: 'English', label: t('find.step2.langEnglish', 'English (ภาษาอังกฤษ)') },
    { id: 'Chinese', label: t('find.step2.langChinese', 'ภาษาจีน / แต้จิ๋ว') },
  ];

  const religions = [
    { id: 'Buddhism', label: t('find.step2.relBuddhism', 'ศาสนาพุทธ (ชอบไหว้พระ/ทำบุญ)') },
    { id: 'Christianity', label: t('find.step2.relChristianity', 'ศาสนาคริสต์') },
    { id: 'Islam', label: t('find.step2.relIslam', 'ศาสนาอิสลาม (ฮาลาล)') },
    { id: 'Any', label: t('find.step2.relAny', 'ศาสนาใดก็ได้') },
  ];

  const diets = [
    { id: 'normal', label: t('find.step2.dietNormal', 'ทานอาหารทั่วไปได้') },
    { id: 'low_sodium', label: t('find.step2.dietLowSodium', 'อาหารรสอ่อน / โซเดียมต่ำ / หวานน้อย') },
    { id: 'halal', label: t('find.step2.dietHalal', 'อาหารฮาลาล') },
    { id: 'vegetarian', label: t('find.step2.dietVegetarian', 'มังสวิรัติ / เจ') },
    { id: 'no_beef', label: t('find.step2.dietNoBeef', 'ไม่ทานเนื้อวัว') },
  ];

  const genders = [
    { id: 'any', label: t('find.step2.genderAny', 'เพศใดก็ได้') },
    { id: 'female', label: t('find.step2.genderFemale', 'ผู้หญิงเท่านั้น') },
    { id: 'male', label: t('find.step2.genderMale', 'ผู้ชายเท่านั้น') },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <CardTitle as="h2" className="text-xl sm:text-2xl font-bold text-slate-900">
          {t('find.step2.title', 'ความต้องการเฉพาะ & ภาษา')}
        </CardTitle>
        <p className="text-xs sm:text-sm text-slate-500">
          {t('find.step2.desc', 'เลือกประเภทกิจกรรม ภาษา และความชอบส่วนบุคคลเพื่อให้เข้ากันได้อย่างดีเยี่ยม')}
        </p>
      </div>

      {/* 1. Primary Activity Selection */}
      <div className="space-y-3">
        <label className="text-xs sm:text-sm font-bold text-slate-900 block">
          {t('find.step2.activityLabel', 'ประเภทกิจกรรมหลักที่ต้องการรับบริการ')}
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {activities.map((act) => {
            const isSelected = formData.activityType === act.id;
            return (
              <label
                key={act.id}
                className={`flex items-center gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'border-sky-500 bg-sky-50/60 text-sky-950 ring-2 ring-sky-500/20 shadow-xs'
                    : 'border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="activityType"
                  value={act.id}
                  checked={isSelected}
                  onChange={() => setFormData({ ...formData, activityType: act.id })}
                  className="text-sky-600 focus:ring-sky-500 shrink-0"
                />
                <div className="p-1 rounded-lg bg-white border border-slate-100 shadow-2xs shrink-0">
                  {act.icon}
                </div>
                <span className="text-xs sm:text-sm font-bold truncate">{act.title}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 2. Language & Religion Preferences */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        <div className="space-y-2">
          <label className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <Languages className="w-4 h-4 text-sky-500" />
            {t('find.step2.langPrefLabel', 'การสื่อสารและสำเนียง')}
          </label>
          <select
            value={formData.language}
            onChange={(e) => setFormData({ ...formData, language: e.target.value })}
            className="w-full p-3 border border-slate-200 rounded-2xl text-xs sm:text-sm font-medium bg-white focus:outline-hidden focus:ring-2 focus:ring-sky-500 shadow-xs"
          >
            {languages.map((l) => (
              <option key={l.id} value={l.id}>
                {l.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <HeartHandshake className="w-4 h-4 text-amber-500" />
            {t('find.step2.religionLabel', 'ความเชื่อและประเพณี')}
          </label>
          <select
            value={formData.religion}
            onChange={(e) => setFormData({ ...formData, religion: e.target.value })}
            className="w-full p-3 border border-slate-200 rounded-2xl text-xs sm:text-sm font-medium bg-white focus:outline-hidden focus:ring-2 focus:ring-sky-500 shadow-xs"
          >
            {religions.map((r) => (
              <option key={r.id} value={r.id}>
                {r.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 3. Dietary Restrictions */}
      <div className="space-y-3 pt-2">
        <label className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
          <Utensils className="w-4 h-4 text-emerald-500" />
          {t('find.step2.dietLabel', 'ข้อจำกัดและความชอบด้านอาหาร')}
        </label>
        <div className="flex flex-wrap gap-2">
          {diets.map((d) => {
            const isSelected = formData.dietary === d.id;
            return (
              <button
                key={d.id}
                type="button"
                onClick={() => setFormData({ ...formData, dietary: d.id })}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-sky-500 text-white border-sky-500 shadow-xs ring-2 ring-sky-500/20'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {d.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Caretaker Gender Preference */}
      <div className="space-y-3 pt-2">
        <label className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
          <Users className="w-4 h-4 text-purple-500" />
          {t('find.step2.genderPrefLabel', 'เพศของผู้ดูแลที่ต้องการ')}
        </label>
        <div className="grid grid-cols-3 gap-3">
          {genders.map((g) => {
            const isSelected = formData.genderPref === g.id;
            return (
              <button
                key={g.id}
                type="button"
                onClick={() => setFormData({ ...formData, genderPref: g.id })}
                className={`p-3 rounded-2xl border text-xs sm:text-sm font-bold transition-all cursor-pointer text-center ${
                  isSelected
                    ? 'bg-sky-500 text-white border-sky-500 shadow-xs ring-2 ring-sky-500/20'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {g.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
