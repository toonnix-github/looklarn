import React from 'react';
import { Link } from 'react-router-dom';
import { HeartHandshake, PhoneCall, ShieldCheck, Heart } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-slate-900 text-slate-300 font-sans border-t border-slate-800">
      {/* Top Banner: Emergency & Trust */}
      <div className="border-b border-slate-800/80 bg-slate-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm">
          <div className="flex items-center gap-2 text-emerald-400 font-medium">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>{t('footer.safetyCertified', 'ผู้ดูแลทุกคนผ่านการตรวจสอบประวัติอาชญากรรมและการฝึกปฐมพยาบาล 100%')}</span>
          </div>
          <div className="flex items-center gap-2 text-rose-400 font-bold bg-rose-500/10 border border-rose-500/20 px-3 py-1 rounded-full">
            <PhoneCall className="w-3.5 h-3.5" />
            <span>{t('footer.emergencyCall', 'ฉุกเฉินทางการแพทย์โทร: 1669 (EMS 24 ชม.)')}</span>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Col 1: Brand & Mission */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-emerald-400 flex items-center justify-center text-white">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">Looklarn (ลูกหลาน)</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              {t('footer.missionDesc', 'แพลตฟอร์ม AI แมตช์ผู้ดูแลมืออาชีพเพื่อพาผู้สูงอายุไปโรงพยาบาล วัด และกิจกรรมต่างๆ ให้คุณอุ่นใจเหมือนมีลูกหลานคอยดูแลเคียงข้าง')}
            </p>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">
              {t('footer.quickLinks', 'เมนูด่วน')}
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link to="/" className="hover:text-sky-400 transition-colors">
                  {t('nav.home', 'หน้าแรก')}
                </Link>
              </li>
              <li>
                <Link to="/find" className="hover:text-sky-400 transition-colors">
                  {t('nav.findCaretaker', 'ค้นหาผู้ดูแล')}
                </Link>
              </li>
              <li>
                <Link to="/bookings" className="hover:text-sky-400 transition-colors">
                  {t('footer.linkBookings', 'ดูรายการจองทั้งหมด')}
                </Link>
              </li>
              <li>
                <Link to="/elder" className="hover:text-sky-400 transition-colors">
                  {t('nav.elderProfile', 'ข้อมูลผู้สูงอายุ')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Services */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">
              {t('footer.services', 'บริการยอดนิยม')}
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>{t('footer.serviceHospital', 'พาไปพบแพทย์ & รับยา')}</li>
              <li>{t('footer.serviceTemple', 'พาไปทำบุญ & ไหว้พระ')}</li>
              <li>{t('footer.servicePark', 'พาเดินออกกำลังกายในสวน')}</li>
              <li>{t('footer.serviceShopping', 'พาซื้อของ & ทานข้าวนอกบ้าน')}</li>
            </ul>
          </div>

          {/* Col 4: Contact & Help */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">
              {t('footer.contactSupport', 'ติดต่อเรา')}
            </h4>
            <p className="text-sm text-slate-400">
              {t('footer.supportHours', 'ฝ่ายบริการลูกค้าเปิดทุกวัน 07:00 - 22:00 น.')}
            </p>
            <div className="text-sm text-sky-400 font-semibold space-y-1">
              <p>Line Official: @looklarn</p>
              <p>Tel: 02-123-4567</p>
              <p>Email: care@looklarn.co.th</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 Looklarn (ลูกหลาน). All rights reserved.</p>
          <p className="flex items-center gap-1">
            <span>Made with care for Thai elders</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
