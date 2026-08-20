import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { CardTitle } from '../ui/Card';
import { DollarSign, FileText, Users, Sparkles } from 'lucide-react';

const GENDERS = [
  { id: 'any',    th: 'เพศใดก็ได้',      en: 'Any Gender' },
  { id: 'female', th: 'ผู้หญิงเท่านั้น', en: 'Female Only' },
  { id: 'male',   th: 'ผู้ชายเท่านั้น',  en: 'Male Only' },
];

export default function Step3Budget({ formData, setFormData }) {
  const { language } = useLanguage();
  const totalEst = (formData.budgetMax || 500) * (formData.durationHours || 4);

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <CardTitle as="h2" className="text-xl sm:text-2xl font-black text-slate-900">
          {language === 'th' ? 'งบประมาณและรายละเอียดเพิ่มเติม' : 'Budget & Final Details'}
        </CardTitle>
        <p className="text-sm text-slate-500">
          {language === 'th'
            ? 'กำหนดอัตราที่ต้องการ และเพิ่มข้อความถึงผู้ดูแลโดยตรง'
            : 'Set your rate and add a personal message to the caretaker.'}
        </p>
      </div>

      {/* Budget Slider */}
      <div className="rounded-2xl bg-gradient-to-br from-slate-50 to-sky-50/40 border border-slate-200/80 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-1.5 text-sm font-bold text-slate-800">
            <DollarSign className="w-4 h-4 text-emerald-600" />
            {language === 'th' ? 'ค่าตอบแทนสูงสุด (บาท/ชั่วโมง)' : 'Max Rate (THB/hr)'}
          </label>
          <span className="text-xl font-black text-emerald-600">
            ฿{formData.budgetMax || 500}
            <span className="text-xs font-bold text-slate-400 ml-1">
              / {language === 'th' ? 'ชม.' : 'hr'}
            </span>
          </span>
        </div>

        <input
          type="range"
          min={300}
          max={1000}
          step={25}
          value={formData.budgetMax || 500}
          onChange={(e) => setFormData({ ...formData, budgetMax: Number(e.target.value) })}
          className="w-full h-2.5 rounded-full accent-emerald-500 cursor-pointer"
        />

        <div className="flex justify-between text-[11px] text-slate-400 font-medium">
          <span>฿300</span>
          <span className="text-slate-500">{language === 'th' ? 'เฉลี่ย ฿350–500/ชม.' : 'Avg ฿350–500/hr'}</span>
          <span>฿1,000</span>
        </div>

        {/* Estimated total */}
        <div className="flex items-center justify-between rounded-xl bg-white border border-emerald-100 px-4 py-3 shadow-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            <span className="text-sm font-bold text-slate-700">
              {language === 'th' ? `ค่าใช้จ่ายรวมประมาณ (${formData.durationHours || 4} ชม.)` : `Estimated Total (${formData.durationHours || 4} hrs)`}
            </span>
          </div>
          <span className="text-base font-black text-emerald-600">
            ฿{totalEst.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Gender Preference */}
      <div className="space-y-2.5">
        <label className="flex items-center gap-1.5 text-sm font-bold text-slate-800">
          <Users className="w-4 h-4 text-purple-500" />
          {language === 'th' ? 'เพศของผู้ดูแลที่ต้องการ' : 'Caretaker Gender Preference'}
        </label>
        <div className="grid grid-cols-3 gap-2.5">
          {GENDERS.map((g) => {
            const isSelected = formData.genderPref === g.id;
            return (
              <button
                key={g.id}
                type="button"
                onClick={() => setFormData({ ...formData, genderPref: g.id })}
                className={`rounded-2xl border py-3 text-sm font-bold transition-all cursor-pointer text-center ${
                  isSelected
                    ? 'bg-sky-500 text-white border-sky-500 shadow-sm ring-2 ring-sky-500/20'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {language === 'th' ? g.th : g.en}
              </button>
            );
          })}
        </div>
      </div>

      {/* Notes for caretaker */}
      <div className="space-y-2.5">
        <label className="flex items-center gap-1.5 text-sm font-bold text-slate-800">
          <FileText className="w-4 h-4 text-slate-500" />
          {language === 'th' ? 'ข้อความถึงผู้ดูแล (ถ้ามี)' : 'Message to Caretaker (optional)'}
        </label>
        <textarea
          rows={4}
          value={formData.notes || ''}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder={
            language === 'th'
              ? 'เช่น "คุณแม่เดินช้า กรุณาอดทนรอ ชอบคุยเรื่องบุญและวัด ไม่ชอบอากาศร้อน..." '
              : 'e.g. "Mom walks slowly, please be patient. She enjoys talking about Buddhism and dislikes heat..."'
          }
          className="w-full rounded-2xl border border-slate-200 bg-white p-3.5 text-sm font-medium shadow-xs focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none leading-relaxed"
        />
        <p className="text-[11px] text-slate-400">
          {language === 'th'
            ? 'ข้อความนี้จะส่งให้ผู้ดูแลอ่านก่อนรับงาน'
            : 'This message will be shared with the caretaker before they accept.'}
        </p>
      </div>
    </div>
  );
}
