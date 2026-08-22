import React from 'react';
import { Link } from 'react-router-dom';
import { HeartHandshake, PhoneCall, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="hidden border-t border-slate-200 bg-white/80 px-4 py-4 text-slate-600 sm:block sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 text-xs lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 flex-wrap items-center gap-x-4 gap-y-2">
          <div className="flex items-center gap-2 font-black text-slate-900">
            <HeartHandshake className="h-4 w-4 text-sky-500" />
            <span>CareMate</span>
          </div>
          <div className="flex items-center gap-1.5 font-semibold text-blue-800">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>{t('footer.safetyCertified', 'ผู้ดูแลทุกคนผ่านการตรวจสอบประวัติอาชญากรรมและการฝึกปฐมพยาบาล 100%')}</span>
          </div>
          <div className="flex items-center gap-1.5 font-bold text-rose-600">
            <PhoneCall className="h-3.5 w-3.5" />
            <span>{t('footer.emergencyCall', 'ฉุกเฉินทางการแพทย์โทร: 1669 (EMS 24 ชม.)')}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-semibold text-slate-500">
          <span>{t('footer.services', 'บริการยอดนิยม')}</span>
          <span>{t('footer.serviceHospital', 'พาไปพบแพทย์ & รับยา')}</span>
          <span>{t('footer.serviceTemple', 'พาไปทำบุญ & ไหว้พระ')}</span>
          <Link to="/find" className="text-sky-600 hover:text-sky-700">
            {t('nav.findCaretaker', 'ค้นหาผู้ดูแล')}
          </Link>
          <span>02-123-4567</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
