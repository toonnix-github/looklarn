import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { CheckCircle2, GraduationCap, Car, MapPin, Languages, BookOpen } from 'lucide-react';

export function CaretakerBio({ caretaker, className = '' }) {
  const { t, getLocalized, language } = useLanguage();

  if (!caretaker) return null;

  return (
    <Card className={`space-y-6 ${className}`}>
      {/* 1. Bio / About Section */}
      <div>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-sky-500" />
            <CardTitle>{t('caretaker.bioTitle', 'เกี่ยวกับผู้ดูแล')}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            {getLocalized(caretaker, 'bio')}
          </p>

          {/* Languages Spoken */}
          {caretaker.languages && caretaker.languages.length > 0 && (
            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mr-1">
                <Languages className="w-4 h-4 text-sky-500" />
                {t('caretaker.languagesTitle', 'ภาษาที่สื่อสารได้')}:
              </span>
              {caretaker.languages.map((lang, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 text-xs font-semibold bg-sky-50 text-sky-700 rounded-lg border border-sky-100"
                >
                  {getLocalized(lang)}
                </span>
              ))}
            </div>
          )}
        </CardContent>
      </div>

      {/* 2. Specialties Grid */}
      {caretaker.specialties && caretaker.specialties.length > 0 && (
        <div className="px-5 sm:px-6 pt-0">
          <h4 className="font-bold text-slate-900 text-sm sm:text-base mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            {t('caretaker.specialtiesTitle', 'ทักษะและความเชี่ยวชาญเฉพาะด้าน')}
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {caretaker.specialties.map((sp, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 p-3 bg-slate-50 rounded-xl border border-slate-100"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                <span className="text-xs sm:text-sm text-slate-800 font-medium">
                  {getLocalized(sp)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Credentials & Equipment Section */}
      <div className="px-5 sm:px-6 pb-6 space-y-4 pt-2 border-t border-slate-100">
        {/* Education & Certs */}
        {caretaker.education && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0 mt-0.5">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-slate-800">
                {t('caretaker.educationTitle', 'การศึกษาและใบรับรองวิชาชีพ')}
              </h5>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                {typeof caretaker.education === 'string'
                  ? caretaker.education
                  : getLocalized(caretaker.education)}
              </p>
            </div>
          </div>
        )}

        {/* Vehicle & Mobility Equipment */}
        {caretaker.vehicle && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0 mt-0.5">
              <Car className="w-4 h-4" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-slate-800">
                {t('caretaker.vehicleTitle', 'ยานพาหนะและอุปกรณ์อำนวยความสะดวก')}
              </h5>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                {typeof caretaker.vehicle === 'string'
                  ? caretaker.vehicle
                  : getLocalized(caretaker.vehicle)}
              </p>
            </div>
          </div>
        )}

        {/* Service Areas */}
        {caretaker.serviceAreas && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600 shrink-0 mt-0.5">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-slate-800">
                {t('caretaker.serviceAreasTitle', 'พื้นที่ที่พร้อมให้บริการ')}
              </h5>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                {Array.isArray(caretaker.serviceAreas)
                  ? caretaker.serviceAreas.map((area) => getLocalized(area)).join(', ')
                  : getLocalized(caretaker.serviceAreas)}
              </p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

export default CaretakerBio;
