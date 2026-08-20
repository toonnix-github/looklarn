import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { PhoneCall, ShieldAlert, Home, User, Mail, HeartHandshake } from 'lucide-react';

export function EmergencyContactsSection({
  guardianName = '',
  guardianRelationship = 'บุตรชาย (Son)',
  guardianPhone = '',
  guardianEmail = '',
  emergencyName = '',
  emergencyRelation = 'บุตรชาย (Son)',
  emergencyPhone = '',
  address = '',
  onChange,
  className = '',
}) {
  const { t } = useLanguage();

  return (
    <Card className={`border-slate-200/80 shadow-xs ${className}`}>
      <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-600">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <CardTitle className="text-base sm:text-lg font-bold text-slate-900">
              {t('elderProfile.emergencyContactTitle', 'ผู้ติดต่อกรณีฉุกเฉิน (Emergency Contact)')}
            </CardTitle>
            <p className="text-xs text-slate-500">
              {t('elderProfile.emergencySubtitle', 'ช่องทางติดต่อผู้ปกครองและเบอร์โทรศัพท์ 24 ชั่วโมง')}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-5 sm:p-6 space-y-6">
        {/* Primary Guardian Details */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-sky-500" />
            <span>{t('elderProfile.guardianSectionTitle', 'ข้อมูลผู้ปกครอง (ผู้ดูแลหลัก)')}</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label
                htmlFor="guardian-name-input"
                className="text-xs sm:text-sm font-bold text-slate-800 block"
              >
                {t('elderProfile.guardianNameLabel', 'ชื่อ-นามสกุลผู้ปกครอง')}
              </label>
              <input
                id="guardian-name-input"
                type="text"
                value={guardianName}
                onChange={(e) => onChange('guardianName', e.target.value)}
                placeholder="เช่น นายธนกร ใจดี"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 shadow-2xs"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="guardian-phone-input"
                className="text-xs sm:text-sm font-bold text-slate-800 block"
              >
                {t('elderProfile.guardianPhoneLabel', 'เบอร์โทรศัพท์ผู้ปกครอง')}
              </label>
              <input
                id="guardian-phone-input"
                type="text"
                value={guardianPhone}
                onChange={(e) => onChange('guardianPhone', e.target.value)}
                placeholder="เช่น 081-987-6543"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 shadow-2xs"
              />
            </div>
          </div>
        </div>

        {/* 24/7 Secondary Contact Details */}
        <div className="space-y-3 pt-3 border-t border-slate-100">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <PhoneCall className="w-3.5 h-3.5 text-rose-500" />
            <span>{t('elderProfile.secondaryContactTitle', 'ผู้ติดต่อสำรอง 24 ชม.')}</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label
                htmlFor="emergency-name-input"
                className="text-xs sm:text-sm font-bold text-slate-800 block"
              >
                {t('elderProfile.emergencyNameLabel', 'ชื่อผู้ติดต่อ (กรณีเร่งด่วน)')}
              </label>
              <input
                id="emergency-name-input"
                type="text"
                value={emergencyName}
                onChange={(e) => onChange('emergencyName', e.target.value)}
                placeholder="เช่น นายธนกร ใจดี"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 shadow-2xs"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="emergency-phone-input"
                className="text-xs sm:text-sm font-bold text-slate-800 block"
              >
                {t('elderProfile.emergencyPhoneLabel', 'เบอร์โทรศัพท์ (24 ชม.)')}
              </label>
              <input
                id="emergency-phone-input"
                type="text"
                value={emergencyPhone}
                onChange={(e) => onChange('emergencyPhone', e.target.value)}
                placeholder="เช่น 081-987-6543"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 shadow-2xs"
              />
            </div>
          </div>
        </div>

        {/* Primary Home Address */}
        <div className="space-y-1.5 pt-3 border-t border-slate-100">
          <label
            htmlFor="home-address-input"
            className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5"
          >
            <Home className="w-4 h-4 text-emerald-500" />
            <span>{t('elderProfile.homeAddressLabel', 'ที่อยู่สำหรับรับ-ส่งประจำ')}</span>
          </label>
          <textarea
            id="home-address-input"
            rows={2}
            value={address}
            onChange={(e) => onChange('address', e.target.value)}
            placeholder="เช่น 128/4 ซอยสุขุมวิท 39 แขวงคลองตันเหนือ เขตวัฒนา กรุงเทพฯ 10110"
            className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 shadow-2xs resize-y"
          />
        </div>
      </CardContent>
    </Card>
  );
}

export default EmergencyContactsSection;
