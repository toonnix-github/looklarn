import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { ShieldCheck, Award, CheckCircle2, UserCheck, HeartPulse } from 'lucide-react';

export function TrustBadges({ className = '' }) {
  const { t, language } = useLanguage();

  const badges = [
    {
      id: 'background_check',
      icon: ShieldCheck,
      iconColor: 'text-emerald-500 bg-emerald-50 border-emerald-200',
      title: t('caretaker.badgeBackground', 'ผ่านการตรวจสอบประวัติอาชญากรรม (สำนักงานตำรวจแห่งชาติ)'),
      authority: language === 'th' ? 'สำนักงานตำรวจแห่งชาติ' : 'Royal Thai Police Checked',
    },
    {
      id: 'cpr_first_aid',
      icon: HeartPulse,
      iconColor: 'text-rose-500 bg-rose-50 border-rose-200',
      title: t('caretaker.badgeCpr', 'ผ่านการอบรมปฐมพยาบาล CPR & First Aid (สภากาชาดไทย)'),
      authority: language === 'th' ? 'สภากาชาดไทย (Thai Red Cross)' : 'Thai Red Cross Certified',
    },
    {
      id: 'certified_caregiver',
      icon: Award,
      iconColor: 'text-sky-500 bg-sky-50 border-sky-200',
      title: t('caretaker.badgeCaregiver', 'ผ่านการรับรองมาตรฐานผู้ดูแลผู้สูงอายุ (กระทรวงสาธารณสุข)'),
      authority: language === 'th' ? 'มาตรฐานกระทรวงสาธารณสุข' : 'MOPH Standard Accredited',
    },
    {
      id: 'id_biometric',
      icon: UserCheck,
      iconColor: 'text-indigo-500 bg-indigo-50 border-indigo-200',
      title: t('caretaker.badgeIdVerified', 'ยืนยันตัวตนด้วยบัตรประชาชนและใบหน้า 100%'),
      authority: language === 'th' ? 'ฐานข้อมูลทะเบียนราษฎร์ DOPA' : 'National DOPA Verified',
    },
  ];

  return (
    <div className={`space-y-3 ${className}`}>
      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
        {t('caretaker.verifiedTitle', 'เครื่องหมายยืนยันความปลอดภัยและมาตรฐาน')}
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {badges.map((badge) => {
          const Icon = badge.icon;
          return (
            <div
              key={badge.id}
              className="p-4 bg-white rounded-2xl border border-slate-100 shadow-xs hover:shadow-md transition-all flex items-start gap-3.5"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${badge.iconColor}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                  {badge.title}
                </h4>
                <p className="text-[11px] text-slate-400 font-medium">
                  {badge.authority}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TrustBadges;
