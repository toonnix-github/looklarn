import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import { useToast } from '../components/ui/Toast';
import { Button } from '../components/ui/Button';
import { Camera, CalendarPlus, Save } from 'lucide-react';
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
    ],
    allergies: elder?.allergies?.th || 'ไม่มี',
    address: elder?.address?.th || '128/4 ซอยสุขุมวิท 39 เขตวัฒนา กรุงเทพฯ',
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
    
    updateSearchCriteria({
      mobility: formData.mobilityLevel,
      conditions: formData.conditions,
      pickupAddress: formData.address,
    });

    toast.success(t('elderProfile.savedToast', 'บันทึกข้อมูลเรียบร้อย'));
  };

  const handleFindCaretaker = () => {
    handleSave();
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
    <div className="mx-auto w-full max-w-lg px-4 py-8 pb-32 min-h-screen bg-slate-50">
      
      {/* ── Photo & Name ── */}
      <div className="flex flex-col items-center gap-3 mb-8">
        <div className="relative cursor-pointer group">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-slate-200">
            <img src={formData.photo} alt="Profile" className="w-full h-full object-cover" />
          </div>
          <div className="absolute inset-0 bg-black/20 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera className="w-6 h-6 text-white" />
          </div>
        </div>
        
        <input
          type="text"
          value={formData.nameTh}
          onChange={(e) => setFormData({ ...formData, nameTh: e.target.value })}
          className="text-2xl font-bold text-center text-slate-900 bg-transparent focus:outline-none w-full placeholder:text-slate-300"
          placeholder="ชื่อผู้สูงอายุ"
        />
      </div>

      <div className="space-y-6">
        {/* Personal Info */}
        <div>
          <div className="text-[13px] text-slate-500 font-medium px-4 pb-1.5">ข้อมูลส่วนตัว</div>
          <div className="bg-white rounded-2xl overflow-hidden divide-y divide-slate-100 shadow-xs border border-slate-100">
            
            <div className="flex items-center justify-between px-4 py-3.5">
              <span className="text-[15px] text-slate-700">อายุ</span>
              <div className="flex items-center">
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  className="w-12 text-right text-[15px] text-slate-500 bg-transparent focus:outline-none"
                />
                <span className="text-[15px] text-slate-500 ml-1">ปี</span>
              </div>
            </div>

            <div className="flex items-center justify-between px-4 py-3.5">
              <span className="text-[15px] text-slate-700">เพศ</span>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="text-right text-[15px] text-slate-500 bg-transparent focus:outline-none appearance-none cursor-pointer outline-none"
              >
                <option value="female">หญิง</option>
                <option value="male">ชาย</option>
              </select>
            </div>

            <div className="flex items-center justify-between px-4 py-3.5">
              <span className="text-[15px] text-slate-700">กรุ๊ปเลือด</span>
              <select
                value={formData.bloodType}
                onChange={(e) => setFormData({ ...formData, bloodType: e.target.value })}
                className="text-right text-[15px] text-slate-500 bg-transparent focus:outline-none appearance-none cursor-pointer outline-none"
              >
                <option value="O+">O+</option>
                <option value="A+">A+</option>
                <option value="B+">B+</option>
                <option value="AB+">AB+</option>
              </select>
            </div>
          </div>
        </div>

        {/* Health */}
        <div>
          <div className="text-[13px] text-slate-500 font-medium px-4 pb-1.5">สุขภาพและการเคลื่อนไหว</div>
          <div className="bg-white rounded-2xl overflow-hidden divide-y divide-slate-100 shadow-xs border border-slate-100">
            
            <div className="flex items-center justify-between px-4 py-3.5">
              <span className="text-[15px] text-slate-700 shrink-0">การเคลื่อนไหว</span>
              <select
                value={formData.mobilityLevel}
                onChange={(e) => setFormData({ ...formData, mobilityLevel: e.target.value })}
                className="text-right text-[15px] text-slate-500 bg-transparent focus:outline-none appearance-none cursor-pointer max-w-[60%] truncate outline-none"
              >
                {elderMobilityOptions.map((opt) => (
                  <option key={opt.id} value={opt.id}>{getEnumLabel(opt, language)}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-between px-4 py-3.5">
              <span className="text-[15px] text-slate-700 shrink-0">ประวัติแพ้ยา</span>
              <input
                type="text"
                value={formData.allergies}
                onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                className="w-full text-right text-[15px] text-slate-500 bg-transparent focus:outline-none placeholder:text-slate-300 ml-4 truncate"
                placeholder="ระบุ (ถ้ามี)"
              />
            </div>

            <div className="px-4 py-3.5">
              <span className="text-[15px] text-slate-700 block mb-2.5">โรคประจำตัว</span>
              <div className="flex flex-wrap gap-1.5">
                {medicalConditionOptions.map((cond) => {
                  const isSelected = formData.conditions.includes(cond.id);
                  return (
                    <button
                      key={cond.id}
                      onClick={() => toggleCondition(cond.id)}
                      className={`px-2.5 py-1 rounded-md text-[13px] transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-sky-50 text-sky-600 font-medium'
                          : 'bg-slate-50 text-slate-500'
                      }`}
                    >
                      {getEnumLabel(cond, language)}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div>
          <div className="text-[13px] text-slate-500 font-medium px-4 pb-1.5">การติดต่อ</div>
          <div className="bg-white rounded-2xl overflow-hidden divide-y divide-slate-100 shadow-xs border border-slate-100">
            
            <div className="flex items-center justify-between px-4 py-3.5">
              <span className="text-[15px] text-slate-700 shrink-0">เบอร์ฉุกเฉิน</span>
              <input
                type="tel"
                value={formData.emergencyPhone}
                onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
                className="w-32 text-right text-[15px] text-slate-500 bg-transparent focus:outline-none"
              />
            </div>

            <div className="px-4 py-3.5">
              <span className="text-[15px] text-slate-700 block mb-1">ที่อยู่ (จุดรับส่งประจำ)</span>
              <textarea
                rows={2}
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full text-[15px] text-slate-500 bg-transparent resize-none focus:outline-none leading-relaxed"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom Action Bar ── */}
      <div className="fixed inset-x-0 bottom-[3.55rem] md:bottom-0 z-40 border-t border-slate-200 bg-white/95 px-4 py-3 shadow-[0_-10px_30px_rgba(15,23,42,0.08)] backdrop-blur-md">
        <div className="mx-auto flex max-w-lg items-center justify-between gap-3">
          <Button
            variant="outline"
            size="lg"
            className="flex-1 border-slate-200 text-slate-700 font-bold hover:bg-slate-50 bg-white"
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
