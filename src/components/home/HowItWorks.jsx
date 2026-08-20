import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Card, CardTitle } from '../ui/Card';
import { ClipboardList, Sparkles, ShieldCheck } from 'lucide-react';

export default function HowItWorks({ className = '' }) {
  const { t } = useLanguage();

  const steps = [
    {
      num: t('home.howItWorks.step1Num', '01'),
      icon: <ClipboardList className="w-6 h-6 text-sky-600" />,
      iconBg: 'bg-sky-50 border-sky-200',
      numColor: 'text-sky-200',
      title: t('home.howItWorks.step1Title', 'ระบุความต้องการและสุขภาพ'),
      desc: t('home.howItWorks.step1Desc', 'กรอกข้อมูลความต้องการด้านร่างกาย การเคลื่อนไหว โรคประจำตัว และกิจกรรมที่ต้องการให้พาไป'),
    },
    {
      num: t('home.howItWorks.step2Num', '02'),
      icon: <Sparkles className="w-6 h-6 text-emerald-600" />,
      iconBg: 'bg-emerald-50 border-emerald-200',
      numColor: 'text-emerald-200',
      title: t('home.howItWorks.step2Title', 'AI คัดเลือกผู้ดูแลที่เหมาะสมที่สุด'),
      desc: t('home.howItWorks.step2Desc', 'ระบบประมวลผลทักษะ ภาษา และความชำนาญ คัดเลือกผู้ดูแลคะแนนความเข้ากันได้สูงสุด 3 ท่าน'),
    },
    {
      num: t('home.howItWorks.step3Num', '03'),
      icon: <ShieldCheck className="w-6 h-6 text-sky-600" />,
      iconBg: 'bg-sky-50 border-sky-200',
      numColor: 'text-sky-200',
      title: t('home.howItWorks.step3Title', 'ยืนยันการจองและติดตามแบบเรียลไทม์'),
      desc: t('home.howItWorks.step3Desc', 'จองและชำระเงินอย่างปลอดภัย พร้อมรับรายงานการดูแลและภาพถ่ายกิจกรรมตลอดทริป'),
    },
  ];

  return (
    <section className={`space-y-8 ${className}`}>
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200/50">
          {t('home.howItWorks.tag', '3 ขั้นตอนง่ายๆ')}
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
          {t('home.howItWorks.title', 'เริ่มต้นใช้งาน Looklarn ได้อย่างมั่นใจ')}
        </h2>
        <p className="text-sm text-slate-500">
          {t('home.howItWorks.subtitle', 'ระบบอัจฉริยะช่วยดูแลทุกขั้นตอนตั้งแต่การจับคู่จนถึงเสร็จสิ้นการเดินทาง')}
        </p>
      </div>

      {/* 3 Step Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {steps.map((step, idx) => (
          <Card key={idx} className="relative p-6 sm:p-8 space-y-4 hover:shadow-md transition-shadow overflow-hidden rounded-2xl bg-white border border-slate-200/80">
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-2xl border ${step.iconBg}`}>
                {step.icon}
              </div>
              <span className={`text-4xl sm:text-5xl font-black ${step.numColor} select-none`}>
                {step.num}
              </span>
            </div>

            <div className="space-y-2">
              <CardTitle as="h3" className="text-lg font-bold text-slate-900">
                {step.title}
              </CardTitle>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                {step.desc}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
