import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import StepIndicator from '../components/find/StepIndicator';
import Step1Physical from '../components/find/Step1Physical';
import Step2Preferences from '../components/find/Step2Preferences';
import Step3Schedule from '../components/find/Step3Schedule';
import AiMatchingLoader from '../components/find/AiMatchingLoader';
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';

export default function FindCaretakerPage() {
  const { t } = useLanguage();
  const { elder, searchCriteria, updateSearchCriteria } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const [currentStep, setCurrentStep] = useState(1);
  const [isMatching, setIsMatching] = useState(false);

  // Initialize form data from searchCriteria or elder profile
  const [formData, setFormData] = useState({
    mobility: searchCriteria?.mobility || elder?.mobilityLevel || 'wheelchair_assisted',
    conditions: searchCriteria?.conditions || elder?.medicalConditions || ['hypertension', 'diabetes_type_2'],
    needsMedicationReminder: searchCriteria?.needsMedicationReminder ?? true,
    specialCareType: searchCriteria?.specialCareType || 'none',
    activityType: searchCriteria?.activityType || 'hospital',
    language: searchCriteria?.language || (elder?.preferredLanguages?.[0]) || 'Thai',
    religion: searchCriteria?.religion || (elder?.religion?.th?.includes('พุทธ') ? 'Buddhism' : 'Buddhism'),
    dietary: searchCriteria?.dietary || (elder?.dietaryPreferences?.th?.includes('โซเดียม') ? 'low_sodium' : 'normal'),
    genderPref: searchCriteria?.genderPref || 'any',
    date: searchCriteria?.date || '2026-08-28',
    timeSlot: searchCriteria?.timeSlot || 'morning',
    durationHours: searchCriteria?.durationHours || 4,
    budgetMax: searchCriteria?.budgetMax || 500,
    pickupAddress: searchCriteria?.pickupAddress || (typeof elder?.address === 'object' ? elder.address?.th : elder?.address) || '128/4 ซอยสุขุมวิท 39 แขวงคลองตันเหนือ เขตวัฒนา กรุงเทพฯ 10110',
    destination: searchCriteria?.destination || (typeof elder?.preferredHospital === 'object' ? elder.preferredHospital?.th : elder?.preferredHospital) || 'โรงพยาบาลศิริราช อาคารนวมินทรบพิตร ๘๔ พรรษา',
    notes: searchCriteria?.specialNotes || (typeof elder?.specialNotes === 'object' ? elder.specialNotes?.th : elder?.specialNotes) || '',
  });

  // Handle query params from Home activity card clicks
  useEffect(() => {
    const activityParam = searchParams.get('activity') || location.state?.activityType;
    if (activityParam) {
      setFormData((prev) => ({ ...prev, activityType: activityParam }));
      updateSearchCriteria({ activityType: activityParam });
    }
  }, [searchParams, location.state]);

  const handleNext = () => {
    updateSearchCriteria(formData);
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleStepClick = (stepNum) => {
    updateSearchCriteria(formData);
    setCurrentStep(stepNum);
  };

  const handleSubmit = (e) => {
    e?.preventDefault?.();
    updateSearchCriteria(formData);
    setIsMatching(true);
  };

  const handleMatchingComplete = () => {
    setIsMatching(false);
    navigate('/matches');
  };

  if (isMatching) {
    return (
      <div data-testid="page-find" className="min-h-[70vh] flex items-center justify-center">
        <AiMatchingLoader onComplete={handleMatchingComplete} />
      </div>
    );
  }

  return (
    <div data-testid="page-find" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Page Title & Subtitle */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
          {t('find.title', 'ค้นหาผู้ดูแลที่ตรงใจ (AI Matching)')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          {t('find.subtitle', 'ตอบคำถามเพียง 3 ขั้นตอน เพื่อให้ระบบ AI จับคู่ผู้ดูแลที่มีทักษะและบุคลิกตรงกับความต้องการของคุณมากที่สุด')}
        </p>
      </div>

      {/* 3-Step Indicator */}
      <StepIndicator currentStep={currentStep} onStepClick={handleStepClick} />

      {/* Form Container Card */}
      <Card className="rounded-3xl border-slate-200/80 shadow-md bg-white overflow-hidden">
        <CardContent className="p-6 sm:p-10 space-y-8">
          {/* Step 1: Physical & Health */}
          {currentStep === 1 && (
            <Step1Physical formData={formData} setFormData={setFormData} elder={elder} />
          )}

          {/* Step 2: Preferences & Lifestyle */}
          {currentStep === 2 && (
            <Step2Preferences formData={formData} setFormData={setFormData} />
          )}

          {/* Step 3: Schedule & Budget */}
          {currentStep === 3 && (
            <Step3Schedule formData={formData} setFormData={setFormData} />
          )}

          {/* Wizard Navigation Footer */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-100">
            {currentStep > 1 ? (
              <Button
                type="button"
                variant="ghost"
                onClick={handleBack}
                leftIcon={<ArrowLeft className="w-4 h-4" />}
                className="cursor-pointer"
              >
                {t('common.back', 'ย้อนกลับ')}
              </Button>
            ) : (
              <div />
            )}

            {currentStep < 3 ? (
              <Button
                type="button"
                variant="primary"
                onClick={handleNext}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="cursor-pointer font-bold px-6"
              >
                {t('common.next', 'ถัดไป')}
              </Button>
            ) : (
              <Button
                type="button"
                variant="accent"
                size="lg"
                onClick={handleSubmit}
                rightIcon={<Sparkles className="w-5 h-5 text-slate-950" />}
                className="bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black shadow-lg shadow-emerald-950/20 cursor-pointer px-8"
              >
                {t('find.submitToMatches', 'ค้นหาผู้ดูแลที่เหมาะสม')}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
