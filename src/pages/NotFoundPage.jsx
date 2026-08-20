import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Button } from '../components/ui/Button';
import { Home } from 'lucide-react';

export default function NotFoundPage() {
  const { t } = useLanguage();

  return (
    <div data-testid="page-404" className="max-w-md mx-auto px-4 py-20 text-center space-y-6">
      <div className="text-6xl font-black text-sky-500">404</div>
      <h2 className="text-2xl font-bold text-slate-900">
        {t('common.notFoundTitle', 'ไม่พบหน้านี้ / Page Not Found (404)')}
      </h2>
      <p className="text-sm text-slate-500">
        {t('common.notFoundDesc', 'หน้าที่คุณกำลังเข้าถึงอาจถูกย้าย ลบ หรือไม่มีอยู่ในระบบ')}
      </p>
      <Link to="/">
        <Button variant="primary" leftIcon={<Home className="w-4 h-4" />}>
          {t('common.backToHome', 'กลับสู่หน้าหลัก (Back to Home)')}
        </Button>
      </Link>
    </div>
  );
}
