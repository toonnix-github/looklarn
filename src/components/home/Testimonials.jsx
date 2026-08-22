import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Card } from '../ui/Card';
import { Star, Quote } from 'lucide-react';

export default function Testimonials({ className = '' }) {
  const { t } = useLanguage();

  const reviews = [
    {
      id: 't1',
      rating: 5,
      text: t('home.testimonials.t1Text', 'ประทับใจคุณสมชายมากครับ พาคุณแม่ไปโรงพยาบาลแทนผมในวันที่ติดประชุมสำคัญ คอยรายงานอัปเดตตลอดเวลา คุณแม่ชมไม่หยุดเลยครับ'),
      author: t('home.testimonials.t1Author', 'คุณธนกร ใจดี'),
      role: t('home.testimonials.t1Role', 'บุตรชาย (ผู้บริหารบริษัทเอกชน)'),
      initials: 'ธก',
      avatarBg: 'bg-sky-500 text-white',
    },
    {
      id: 't2',
      rating: 5,
      text: t('home.testimonials.t2Text', 'หาคนพาคุณยายไปสักการะสิ่งศักดิ์สิทธิ์ที่วัดอรุณยากมากจนมาเจอ CareMate น้องนิภาพรใจเย็น ช่วยพยุงดูแลเรื่องแดดและน้ำดื่มดีมาก แนะนำทุกคนเลยค่ะ'),
      author: t('home.testimonials.t2Author', 'พญ. วรรณภา สิทธิพงศ์'),
      role: t('home.testimonials.t2Role', 'บุตรสาว (แพทย์หญิง)'),
      initials: 'วส',
      avatarBg: 'bg-emerald-500 text-white',
    },
    {
      id: 't3',
      rating: 5,
      text: t('home.testimonials.t3Text', 'น้องพลอยน่ารักมาก พาคุณพ่อไปผ่อนคลายที่สวนสาธารณะอย่างทะนุถนอม คอยชวนคุยจนคุณพ่ออารมณ์ดีขึ้นมาก ขอบคุณทีมงาน CareMate จริงๆ ครับ'),
      author: t('home.testimonials.t3Author', 'คุณกิตติศักดิ์ วรเดช'),
      role: t('home.testimonials.t3Role', 'บุตรชาย (ข้าราชการ)'),
      initials: 'กว',
      avatarBg: 'bg-purple-500 text-white',
    },
  ];

  return (
    <section className={`space-y-8 ${className}`}>
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-sky-600 bg-sky-50 px-2.5 py-1 rounded-md border border-sky-200/50">
          {t('home.testimonials.tag', 'เสียงตอบรับจากครอบครัว')}
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
          {t('home.testimonials.title', 'ความไว้วางใจจากครอบครัวผู้ใช้บริการจริง')}
        </h2>
        <p className="text-sm text-slate-500">
          {t('home.testimonials.subtitle', 'ฟังเรื่องราวความประทับใจจากบุตรหลานที่มอบความไว้วางใจให้ทีมงานของเรา')}
        </p>
      </div>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviews.map((rev) => (
          <Card key={rev.id} className="p-6 sm:p-7 flex flex-col justify-between space-y-4 rounded-2xl bg-white border border-slate-200/80 hover:shadow-md transition-shadow">
            <div className="space-y-3">
              {/* Star Rating */}
              <div className="flex items-center justify-between">
                <div className="flex gap-1 text-amber-400">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <Quote className="w-6 h-6 text-slate-200" />
              </div>

              {/* Quote Text */}
              <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed">
                "{rev.text}"
              </p>
            </div>

            {/* Author Footer */}
            <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 shadow-xs ${rev.avatarBg}`}>
                {rev.initials}
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-bold text-slate-900 truncate">{rev.author}</p>
                <p className="text-[11px] text-slate-500 truncate">{rev.role}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
