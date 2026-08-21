import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import { useToast } from '../components/ui/Toast';
import { ElderProfileForm } from '../components/elder/ElderProfileForm';
import { Button } from '../components/ui/Button';
import { Save, Search, Sparkles, UserCheck } from 'lucide-react';
import { ELDER_MOBILITY, MEDICAL_CONDITIONS, MOBILITY_AIDS } from '../constants/careEnums';

export default function ElderProfilePage() {
  const { t, language } = useLanguage();
  const { elder, updateElderProfile, updateSearchCriteria } = useApp();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nameTh: elder?.name?.th || 'นางสมพร ใจดี',
    nameEn: elder?.name?.en || 'Grandma Somporn Jaidee',
    nickname: elder?.nickname?.th || elder?.nickname?.en || 'พร',
    photo:
      elder?.photo ||
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=80',
    age: elder?.age || 74,
    gender: elder?.gender || 'female',
    bloodType: elder?.bloodType || 'O+',
    mobilityLevel: elder?.mobilityLevel || ELDER_MOBILITY.WHEELCHAIR_ASSISTED,
    mobilityAids: elder?.mobilityAids || [MOBILITY_AIDS.WHEELCHAIR],
    conditions: elder?.medicalConditions || [
      MEDICAL_CONDITIONS.HYPERTENSION,
      MEDICAL_CONDITIONS.DIABETES_TYPE_2,
      MEDICAL_CONDITIONS.KNEE_OSTEOARTHRITIS,
    ],
    allergies: elder?.allergies?.th || elder?.allergies?.en || 'ไม่มีประวัติแพ้ยา',
    medications: elder?.medications?.th || elder?.medications?.en || 'Amlodipine 5mg (หลังอาหารเช้า 1 เม็ด)',
    preferredHospital: elder?.preferredHospital?.th || 'โรงพยาบาลศิริราช',
    hospitalHn: elder?.hospitalHn || 'HN-89234/62',
    preferredLanguages: elder?.preferredLanguages || ['Thai'],
    religion: elder?.religion || 'Buddhism',
    dietaryPreferences: elder?.dietaryPreferences || 'low_sodium',
    specialNotes: elder?.specialNotes?.th || elder?.specialNotes?.en || 'คุณยายเดินช้าและใช้วีลแชร์ ต้องการคนช่วยถือของและคอยดูแลเรื่องคิวพบแพทย์',
    guardianName: elder?.guardian?.name?.th || 'นายธนกร ใจดี',
    guardianPhone: elder?.guardian?.phone || '081-987-6543',
    guardianEmail: elder?.guardian?.email || 'thanakorn.j@gmail.com',
    emergencyName: elder?.emergencyContact?.name?.th || 'นายธนกร ใจดี',
    emergencyPhone: elder?.emergencyContact?.phone || '081-987-6543',
    address: elder?.address?.th || '128/4 ซอยสุขุมวิท 39 แขวงคลองตันเหนือ เขตวัฒนา กรุงเทพฯ 10110',
  });

  const handleSave = (e) => {
    if (e && e.preventDefault) e.preventDefault();

    const updated = {
      name: {
        th: formData.nameTh,
        en: formData.nameEn || formData.nameTh,
      },
      nickname: {
        th: formData.nickname,
        en: formData.nickname,
      },
      photo: formData.photo,
      age: Number(formData.age) || formData.age,
      gender: formData.gender,
      bloodType: formData.bloodType,
      mobilityLevel: formData.mobilityLevel,
      mobilityAids: formData.mobilityAids,
      medicalConditions: formData.conditions,
      allergies: {
        th: formData.allergies,
        en: formData.allergies,
      },
      medications: {
        th: formData.medications,
        en: formData.medications,
      },
      preferredHospital: {
        th: formData.preferredHospital,
        en: formData.preferredHospital,
      },
      hospitalHn: formData.hospitalHn,
      preferredLanguages: formData.preferredLanguages,
      religion: formData.religion,
      dietaryPreferences: formData.dietaryPreferences,
      specialNotes: {
        th: formData.specialNotes,
        en: formData.specialNotes,
      },
      guardian: {
        ...(elder?.guardian || {}),
        name: { th: formData.guardianName, en: formData.guardianName },
        phone: formData.guardianPhone,
        email: formData.guardianEmail,
      },
      emergencyContact: {
        ...(elder?.emergencyContact || {}),
        name: { th: formData.emergencyName, en: formData.emergencyName },
        phone: formData.emergencyPhone,
      },
      address: {
        th: formData.address,
        en: formData.address,
      },
    };

    updateElderProfile(updated);

    // Sync directly with search criteria for Find Caretaker wizard auto-fill
    updateSearchCriteria({
      mobility: formData.mobilityLevel,
      conditions: formData.conditions,
      pickupAddress: formData.address,
      specialNotes: formData.specialNotes,
    });

    toast.success(t('elderProfile.savedToast', 'บันทึกข้อมูลสำเร็จเรียบร้อยแล้ว!'));
  };

  const handleFindCaretaker = () => {
    // Ensure searchCriteria has latest elder attributes
    updateSearchCriteria({
      mobility: formData.mobilityLevel,
      conditions: formData.conditions,
      pickupAddress: formData.address,
      specialNotes: formData.specialNotes,
    });
    navigate('/find');
  };

  return (
    <div data-testid="page-elder" className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 lg:py-10 space-y-6">
      
      {/* ── Top Hero Banner ── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-500 to-sky-700 p-6 sm:p-8 shadow-md">
        {/* Decorative background shapes */}
        <div className="absolute -right-6 -top-12 opacity-20">
          <Sparkles className="h-40 w-40 text-white" />
        </div>
        
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-sm mb-3">
            <UserCheck className="w-3.5 h-3.5" />
            <span>{t('elderProfile.headerBadge', 'Elder Profile')}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
            {t('elderProfile.title', 'ข้อมูลผู้สูงอายุ')}
          </h1>
          <p className="text-sky-100 text-sm mt-2 max-w-md leading-relaxed">
            {t(
              'elderProfile.subtitle',
              'บันทึกประวัติการดูแล ความต้องการ และข้อควรระวัง เพื่อให้ AI จับคู่ผู้ดูแลได้แม่นยำและปลอดภัยที่สุด'
            )}
          </p>

          <div className="mt-6">
            <Button
              variant="outline"
              size="sm"
              onClick={handleFindCaretaker}
              leftIcon={<Search className="w-4 h-4 text-sky-900" />}
              className="bg-white/90 border-0 text-sky-900 hover:bg-white shadow-sm hover:shadow-md cursor-pointer font-bold px-4 transition-all"
            >
              {t('elderProfile.findCaretakerBtn', 'ค้นหาผู้ดูแลสำหรับผู้สูงอายุท่านนี้')}
            </Button>
          </div>
        </div>
      </div>

      {/* ── Main Profile Form ── */}
      <div className="pb-24">
        <ElderProfileForm
          formData={formData}
          onChange={setFormData}
          onSubmit={handleSave}
        />
      </div>

      {/* ── Bottom Save Bar ── */}
      <div className="fixed inset-x-0 bottom-[3.55rem] md:bottom-0 z-40 border-t border-slate-200 bg-white/95 px-4 py-3 shadow-[0_-10px_30px_rgba(15,23,42,0.08)] backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4">
          <p className="hidden sm:block text-xs text-slate-500 font-medium">
            <span className="text-emerald-600 font-bold">🔒 Secure </span>
            {t('elderProfile.privacyNote', 'ประวัติการดูแลจะแชร์เฉพาะผู้ดูแลที่ได้รับการยืนยันเท่านั้น')}
          </p>

          <Button
            variant="accent"
            size="lg"
            className="w-full sm:w-auto shadow-lg shadow-emerald-500/25 bg-emerald-500 hover:bg-emerald-400 text-white font-black"
            onClick={handleSave}
            leftIcon={<Save className="w-5 h-5" />}
          >
            {t('elderProfile.saveBtn', 'บันทึกข้อมูล')}
          </Button>
        </div>
      </div>
    </div>
  );
}
