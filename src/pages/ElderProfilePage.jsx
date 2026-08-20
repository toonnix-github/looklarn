import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import { useToast } from '../components/ui/Toast';
import { ElderProfileForm } from '../components/elder/ElderProfileForm';
import { Button } from '../components/ui/Button';
import { Save, Search, Sparkles, UserCheck } from 'lucide-react';

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
    mobilityLevel: elder?.mobilityLevel || 'wheelchair_assisted',
    mobilityAids: elder?.mobilityAids || ['wheelchair'],
    conditions: elder?.medicalConditions || ['hypertension', 'diabetes_type_2', 'knee_osteoarthritis'],
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
    <div data-testid="page-elder" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Top Header & CTAs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div className="flex items-center gap-2 text-sky-600 text-xs font-bold uppercase tracking-wider mb-1">
            <UserCheck className="w-4 h-4" />
            <span>{t('elderProfile.headerBadge', 'โปรไฟล์การดูแล')}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {t('elderProfile.title', 'ข้อมูลผู้สูงอายุ')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {t(
              'elderProfile.subtitle',
              'บันทึกประวัติการดูแล ความต้องการ และข้อควรระวัง เพื่อให้ AI จับคู่ผู้ดูแลได้แม่นยำและปลอดภัยที่สุด'
            )}
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Button
            variant="outline"
            size="md"
            onClick={handleFindCaretaker}
            leftIcon={<Search className="w-4 h-4 text-sky-600" />}
            className="cursor-pointer font-bold text-xs sm:text-sm"
          >
            {t('elderProfile.findCaretakerBtn', 'ค้นหาผู้ดูแลสำหรับผู้สูงอายุท่านนี้')}
          </Button>
        </div>
      </div>

      {/* Main Profile Form */}
      <ElderProfileForm
        formData={formData}
        onChange={setFormData}
        onSubmit={handleSave}
      />

      {/* Bottom Save Bar */}
      <div className="pt-4 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-slate-500 text-center sm:text-left">
          {t('elderProfile.privacyNote', 'ประวัติการดูแลของผู้สูงอายุจะถูกเก็บรักษาอย่างปลอดภัยและแชร์เฉพาะผู้ดูแลที่ได้รับการยืนยันเท่านั้น')}
        </p>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button
            variant="accent"
            size="lg"
            className="w-full sm:w-auto shadow-lg shadow-emerald-500/25"
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
