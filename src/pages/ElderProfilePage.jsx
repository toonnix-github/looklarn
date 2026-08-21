import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import { useToast } from '../components/ui/Toast';
import { Button } from '../components/ui/Button';
import { Camera, CalendarPlus, Save, ChevronDown, X, Plus } from 'lucide-react';
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
    allergies: elder?.allergies?.th || '',
    address: elder?.address?.th || '128/4 ซอยสุขุมวิท 39 เขตวัฒนา กรุงเทพฯ',
    emergencyPhone: elder?.emergencyContact?.phone || '081-987-6543',
  });

  const [conditionSearch, setConditionSearch] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearching(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  const addCondition = (id) => {
    if (!formData.conditions.includes(id)) {
      setFormData({ ...formData, conditions: [...formData.conditions, id] });
    }
    setConditionSearch('');
    setIsSearching(false);
  };

  const removeCondition = (id) => {
    setFormData({ ...formData, conditions: formData.conditions.filter((c) => c !== id) });
  };

  const availableConditions = medicalConditionOptions.filter(
    (c) => !formData.conditions.includes(c.id) && 
           getEnumLabel(c, language).toLowerCase().includes(conditionSearch.toLowerCase())
  );

  return (
    <div className="mx-auto w-full max-w-lg px-4 py-8 pb-48 min-h-screen bg-slate-50">
      
      {/* ── Photo & Name ── */}
      <div className="flex flex-col items-center gap-4 mb-8">
        <div className="relative cursor-pointer group">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-slate-200 border-2 border-white shadow-sm">
            <img src={formData.photo} alt="Profile" className="w-full h-full object-cover" />
          </div>
          {/* Explicit Camera Badge */}
          <div className="absolute bottom-0 right-0 bg-slate-800 p-1.5 rounded-full border-2 border-white shadow-md group-hover:bg-sky-500 transition-colors">
            <Camera className="w-4 h-4 text-white" />
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
            
            {/* Mobility (New Line layout & Single Language) */}
            <div className="flex flex-col px-4 py-3.5 gap-2">
              <span className="text-[15px] text-slate-700">การเคลื่อนไหว</span>
              <div className="relative">
                <select
                  value={formData.mobilityLevel}
                  onChange={(e) => setFormData({ ...formData, mobilityLevel: e.target.value })}
                  className="w-full text-left text-[15px] text-slate-600 bg-transparent focus:outline-none appearance-none cursor-pointer outline-none py-1"
                >
                  {elderMobilityOptions.map((opt) => {
                    // Extract only the Thai part before the parenthesis to avoid "เดินได้ปกติ (Independent)"
                    let label = getEnumLabel(opt, language);
                    if (language === 'th') label = label.split(' (')[0];
                    return (
                      <option key={opt.id} value={opt.id}>{label}</option>
                    );
                  })}
                </select>
                <ChevronDown className="w-5 h-5 text-slate-300 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Medical Conditions (Pills & Searchable Enum) */}
            <div className="px-4 py-3.5" ref={searchRef}>
              <span className="text-[15px] text-slate-700 block mb-2.5">โรคประจำตัว</span>
              
              {/* Selected Pills */}
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.conditions.map((condId) => {
                  const meta = medicalConditionOptions.find(c => c.id === condId);
                  return (
                    <div key={condId} className="flex items-center gap-1 px-2.5 py-1 bg-sky-50 text-sky-700 rounded-md text-[13px] font-medium border border-sky-100">
                      <span>{meta ? getEnumLabel(meta, language) : condId}</span>
                      <button onClick={() => removeCondition(condId)} className="p-0.5 hover:bg-sky-200 rounded-sm text-sky-900 transition-colors">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Searchable Input */}
              <div className="relative">
                <input
                  type="text"
                  value={conditionSearch}
                  onChange={(e) => {
                    setConditionSearch(e.target.value);
                    setIsSearching(true);
                  }}
                  onFocus={() => setIsSearching(true)}
                  className="w-full text-[14px] px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500 focus:bg-white transition-colors"
                  placeholder="ค้นหาและเพิ่มโรคประจำตัว..."
                />
                
                {/* Search Dropdown */}
                {isSearching && availableConditions.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {availableConditions.map((cond) => (
                      <button
                        key={cond.id}
                        onClick={() => addCondition(cond.id)}
                        className="w-full text-left px-3 py-2 text-[14px] text-slate-700 hover:bg-sky-50 flex items-center justify-between"
                      >
                        <span>{getEnumLabel(cond, language)}</span>
                        <Plus className="w-4 h-4 text-sky-500" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Allergies (Textarea) */}
            <div className="px-4 py-3.5 flex flex-col gap-1.5">
              <span className="text-[15px] text-slate-700">ประวัติแพ้ยา / แพ้อาหาร</span>
              <textarea
                rows={2}
                value={formData.allergies}
                onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                className="w-full text-[15px] text-slate-500 bg-transparent resize-none focus:outline-none placeholder:text-slate-300"
                placeholder="ระบุ (ถ้ามี)"
              />
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

      {/* ── Bottom Action Bar (Stacked) ── */}
      <div className="fixed inset-x-0 bottom-[3.55rem] md:bottom-0 z-40 border-t border-slate-200 bg-white/95 px-4 py-4 shadow-[0_-10px_30px_rgba(15,23,42,0.08)] backdrop-blur-md">
        <div className="mx-auto flex flex-col max-w-lg gap-2.5">
          <Button
            variant="accent"
            size="lg"
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-black shadow-lg shadow-emerald-500/25 border-0"
            onClick={handleFindCaretaker}
            leftIcon={<CalendarPlus className="w-5 h-5" />}
          >
            ทำการนัดหมาย
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            className="w-full border-slate-200 text-slate-700 font-bold hover:bg-slate-50 bg-white"
            onClick={handleSave}
          >
            บันทึกข้อมูล
          </Button>
        </div>
      </div>
    </div>
  );
}
