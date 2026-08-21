import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import { useToast } from '../components/ui/Toast';
import { Button } from '../components/ui/Button';
import { Camera, CalendarPlus, Save, ChevronDown } from 'lucide-react';
import { ELDER_MOBILITY, MEDICAL_CONDITIONS, elderMobilityOptions, medicalConditionOptions, getEnumLabel } from '../constants/careEnums';

export default function ElderProfilePage() {
  const { t, language } = useLanguage();
  const { elder, updateElderProfile, updateSearchCriteria } = useApp();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nameTh: elder?.name?.th || 'นางสมพร ใจดี',
    photo: elder?.photo || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=80',
    age: elder?.age || 74,
    gender: elder?.gender || 'female',
    bloodType: elder?.bloodType || 'O+',
    mobilityLevel: elder?.mobilityLevel || ELDER_MOBILITY.WHEELCHAIR_ASSISTED,
    conditions: elder?.medicalConditions || [
      MEDICAL_CONDITIONS.HYPERTENSION,
      MEDICAL_CONDITIONS.DIABETES_TYPE_2,
      MEDICAL_CONDITIONS.KNEE_OSTEOARTHRITIS,
    ],
    allergies: elder?.allergies?.th || 'ไม่มีประวัติแพ้ยา',
    address: elder?.address?.th || '128/4 ซอยสุขุมวิท 39 แขวงคลองตันเหนือ เขตวัฒนา กรุงเทพฯ',
    emergencyPhone: elder?.emergencyContact?.phone || '081-987-6543',
  });

  const handleSave = () => {
    updateElderProfile({
      ...elder,
      name: { th: formData.nameTh, en: formData.nameTh },
      photo: formData.photo,
      age: formData.age,
      gender: formData.gender,
      bloodType: formData.bloodType,
      mobilityLevel: formData.mobilityLevel,
      medicalConditions: formData.conditions,
      allergies: { th: formData.allergies, en: formData.allergies },
      address: { th: formData.address, en: formData.address },
      emergencyContact: { ...elder?.emergencyContact, phone: formData.emergencyPhone },
    });
    
    // Sync with search context
    updateSearchCriteria({
      mobility: formData.mobilityLevel,
      conditions: formData.conditions,
      pickupAddress: formData.address,
    });

    toast.success(t('elderProfile.savedToast', 'บันทึกข้อมูลสำเร็จเรียบร้อยแล้ว!'));
  };

  const handleFindCaretaker = () => {
    handleSave(); // Auto-save before booking
    navigate('/find');
  };

  const toggleCondition = (id) => {
    const current = formData.conditions || [];
    if (current.includes(id)) {
      setFormData({ ...formData, conditions: current.filter((c) => c !== id) });
    } else {
      setFormData({ ...formData, conditions: [...current, id] });
    }
  };

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8 space-y-8 pb-32">
      {/* ── 1. Editable Photo & Name ── */}
      <div className="flex flex-col items-center gap-4 pt-2">
        <div className="relative group cursor-pointer">
          <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-lg bg-slate-100">
            <img src={formData.photo} alt="Elder Profile" className="w-full h-full object-cover" />
          </div>
          <button className="absolute bottom-0 right-0 p-2 bg-slate-900 text-white rounded-full shadow-md hover:bg-sky-500 transition-colors">
            <Camera className="w-4 h-4" />
          </button>
        </div>
        
        <input
          type="text"
          value={formData.nameTh}
          onChange={(e) => setFormData({ ...formData, nameTh: e.target.value })}
          className="text-2xl sm:text-3xl font-black text-center text-slate-900 bg-transparent border-b-2 border-transparent hover:border-slate-200 focus:border-sky-500 focus:outline-none px-2 py-1 w-full max-w-xs transition-colors placeholder:text-slate-300"
          placeholder="ชื่อผู้สูงอายุ"
        />
      </div>

      {/* ── 2. Simplified Profile Sections ── */}
      <div className="space-y-6">
        
        {/* Personal Info */}
        <section>
          <h3 className="text-[13px] font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">ข้อมูลส่วนตัว</h3>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden divide-y divide-slate-100">
            <div className="flex items-center justify-between p-4">
              <span className="text-sm font-bold text-slate-700">อายุ</span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  className="w-16 text-right text-sm font-semibold text-slate-900 bg-transparent focus:outline-none"
                />
                <span className="text-sm text-slate-400">ปี</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4">
              <span className="text-sm font-bold text-slate-700">เพศ</span>
              <div className="relative">
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="appearance-none bg-transparent pr-6 text-right text-sm font-semibold text-slate-900 focus:outline-none cursor-pointer"
                >
                  <option value="female">หญิง</option>
                  <option value="male">ชาย</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div className="flex items-center justify-between p-4">
              <span className="text-sm font-bold text-slate-700">กรุ๊ปเลือด</span>
              <div className="relative">
                <select
                  value={formData.bloodType}
                  onChange={(e) => setFormData({ ...formData, bloodType: e.target.value })}
                  className="appearance-none bg-transparent pr-6 text-right text-sm font-semibold text-slate-900 focus:outline-none cursor-pointer"
                >
                  <option value="O+">O+</option>
                  <option value="A+">A+</option>
                  <option value="B+">B+</option>
                  <option value="AB+">AB+</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>
        </section>

        {/* Health & Mobility */}
        <section>
          <h3 className="text-[13px] font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">สุขภาพและการเคลื่อนไหว</h3>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden divide-y divide-slate-100">
            <div className="p-4 space-y-2">
              <span className="text-sm font-bold text-slate-700 block">ระดับการเคลื่อนไหว</span>
              <div className="relative bg-slate-50 rounded-xl border border-slate-200">
                <select
                  value={formData.mobilityLevel}
                  onChange={(e) => setFormData({ ...formData, mobilityLevel: e.target.value })}
                  className="w-full appearance-none bg-transparent p-3 pr-10 text-sm font-semibold text-slate-900 focus:outline-none cursor-pointer"
                >
                  {elderMobilityOptions.map((opt) => (
                    <option key={opt.id} value={opt.id}>{getEnumLabel(opt, language)}</option>
                  ))}
                </select>
                <ChevronDown className="w-5 h-5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div className="p-4 space-y-3">
              <span className="text-sm font-bold text-slate-700 block">โรคประจำตัว</span>
              <div className="flex flex-wrap gap-2">
                {medicalConditionOptions.map((cond) => {
                  const isSelected = formData.conditions.includes(cond.id);
                  return (
                    <button
                      key={cond.id}
                      onClick={() => toggleCondition(cond.id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors border cursor-pointer ${
                        isSelected
                          ? 'bg-rose-50 border-rose-200 text-rose-700'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {getEnumLabel(cond, language)}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-2">
              <span className="text-sm font-bold text-slate-700 shrink-0">ประวัติแพ้ยา</span>
              <input
                type="text"
                value={formData.allergies}
                onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                className="w-full sm:text-right text-sm font-semibold text-rose-600 bg-transparent focus:outline-none placeholder:text-slate-300"
                placeholder="ระบุประวัติแพ้ยา (ถ้ามี)"
              />
            </div>
          </div>
        </section>

        {/* Contact Info */}
        <section>
          <h3 className="text-[13px] font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">ข้อมูลติดต่อ & สถานที่</h3>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden divide-y divide-slate-100">
            <div className="p-4 space-y-2">
              <span className="text-sm font-bold text-slate-700 block">ที่อยู่ (จุดรับส่งประจำ)</span>
              <textarea
                rows={2}
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 resize-none"
              />
            </div>
            
            <div className="flex items-center justify-between p-4">
              <span className="text-sm font-bold text-slate-700">เบอร์โทรฉุกเฉิน</span>
              <input
                type="tel"
                value={formData.emergencyPhone}
                onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
                className="w-32 text-right text-sm font-semibold text-slate-900 bg-transparent focus:outline-none"
              />
            </div>
          </div>
        </section>
      </div>

      {/* ── 3. Bottom Action Bar ── */}
      <div className="fixed inset-x-0 bottom-[3.55rem] md:bottom-0 z-40 border-t border-slate-200 bg-white/95 px-4 py-3.5 shadow-[0_-10px_30px_rgba(15,23,42,0.08)] backdrop-blur-md">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-3">
          <Button
            variant="outline"
            size="lg"
            className="flex-1 border-slate-200 text-slate-700 font-bold hover:bg-slate-50"
            onClick={handleSave}
            leftIcon={<Save className="w-5 h-5" />}
          >
            บันทึก
          </Button>

          <Button
            variant="accent"
            size="lg"
            className="flex-[2] bg-emerald-500 hover:bg-emerald-400 text-white font-black shadow-lg shadow-emerald-500/25 border-0"
            onClick={handleFindCaretaker}
            leftIcon={<CalendarPlus className="w-5 h-5" />}
          >
            ทำการนัดหมาย
          </Button>
        </div>
      </div>
    </div>
  );
}
