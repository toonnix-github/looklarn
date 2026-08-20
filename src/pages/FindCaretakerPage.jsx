import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import StepIndicator from '../components/find/StepIndicator';
import Step1Activity from '../components/find/Step1Physical';
import Step2Schedule from '../components/find/Step2Preferences';
import Step3Budget from '../components/find/Step3Schedule';
import AiMatchingLoader from '../components/find/AiMatchingLoader';
import {
  ArrowLeft, ArrowRight, Sparkles,
  Accessibility, Footprints, HelpingHand, Bed,
  HeartPulse, Pill, Dumbbell, Brain, Edit3,
  User,
} from 'lucide-react';
import {
  APPOINTMENT_EVENTS,
  ELDER_MOBILITY,
  getElderMobilityMeta,
  getEnumLabel,
  getMedicalConditionMeta,
  MEDICAL_CONDITIONS,
} from '../constants/careEnums';

const MOBILITY_ICONS = {
  independent: Footprints,
  cane: HelpingHand,
  assisted_walking: HelpingHand,
  walker: Accessibility,
  wheelchair_assisted: Accessibility,
  bed_bound: Bed,
  full_assistance: Bed,
};

export default function FindCaretakerPage() {
  const { t, language, getLocalized } = useLanguage();
  const { elder, searchCriteria, updateSearchCriteria } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const [currentStep, setCurrentStep] = useState(1);
  const [isMatching, setIsMatching] = useState(false);

  const elderName = elder ? (getLocalized(elder, 'name') || getLocalized(elder, 'nickname')) : (language === 'th' ? 'นางสมพร ใจดี' : 'Grandma Somporn');
  const elderNickname = elder ? getLocalized(elder, 'nickname') : (language === 'th' ? 'ยายพร' : 'Grandma Porn');
  const elderAge = elder?.age || 74;
  const elderPhoto = elder?.photo || null;
  const elderMobility = elder?.mobilityLevel || ELDER_MOBILITY.WHEELCHAIR_ASSISTED;
  const elderConditions = elder?.medicalConditions || [
    MEDICAL_CONDITIONS.HYPERTENSION,
    MEDICAL_CONDITIONS.DIABETES_TYPE_2,
  ];
  const elderAddress = elder ? getLocalized(elder, 'address') : '';
  const elderHospital = elder ? getLocalized(elder, 'preferredHospital') : '';
  const elderNotes = elder ? getLocalized(elder, 'specialNotes') : '';

  const MobilityIcon = MOBILITY_ICONS[elderMobility] || Accessibility;
  const mobilityLabel = getEnumLabel(getElderMobilityMeta(elderMobility), language, 'shortLabel');

  const [formData, setFormData] = useState({
    activityType: searchCriteria?.activityType || APPOINTMENT_EVENTS.HOSPITAL,
    date: searchCriteria?.date || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    timeSlot: searchCriteria?.timeSlot || 'morning',
    durationHours: searchCriteria?.durationHours || 4,
    pickupAddress: searchCriteria?.pickupAddress || elderAddress || '',
    destination: searchCriteria?.destination || elderHospital || '',
    budgetMax: searchCriteria?.budgetMax || 500,
    notes: searchCriteria?.specialNotes || elderNotes || '',
    // pass-through from elder profile for AI matching
    mobility: elderMobility,
    conditions: elderConditions,
    needsMedicationReminder: searchCriteria?.needsMedicationReminder ?? true,
    language: elder?.preferredLanguages?.[0] || 'Thai',
    religion: 'Buddhism',
    dietary: 'low_sodium',
    genderPref: searchCriteria?.genderPref || 'any',
  });

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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  if (isMatching) {
    return (
      <div data-testid="page-find" className="min-h-[70vh] flex items-center justify-center">
        <AiMatchingLoader onComplete={() => { setIsMatching(false); navigate('/matches'); }} />
      </div>
    );
  }

  return (
    <div data-testid="page-find" className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 lg:py-10">

      {/* ── Page Header ── */}
      <div className="mb-6 space-y-1">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-600">
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI Matching</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
          {language === 'th' ? 'ค้นหาผู้ดูแลให้ใคร?' : 'Who are we finding a caretaker for?'}
        </h1>
        <p className="text-sm text-slate-500">
          {language === 'th'
            ? 'ข้อมูลสุขภาพของผู้สูงอายุถูกโหลดจากโปรไฟล์แล้ว บอกแค่รายละเอียดการออกไปข้างนอก'
            : "Elder's health info is loaded from their profile. Just tell us about the outing."}
        </p>
      </div>

      {/* ── Elder Profile Card ── */}
      <div className="mb-6 rounded-2xl bg-white ring-1 ring-slate-200/80 shadow-sm overflow-hidden">
        <div className="flex items-center gap-4 p-4 sm:p-5">
          {/* Avatar */}
          <div className="shrink-0">
            {elderPhoto ? (
              <img
                src={elderPhoto}
                alt={elderName}
                onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = ''; e.currentTarget.style.display = 'none'; e.currentTarget.nextSibling.style.display = 'flex'; }}
                className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl object-cover ring-2 ring-sky-100 shadow-sm"
              />
            ) : null}
            <div
              className={`h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-gradient-to-br from-sky-100 to-teal-100 items-center justify-center ring-2 ring-sky-100 shadow-sm ${elderPhoto ? 'hidden' : 'flex'}`}
            >
              <User className="w-8 h-8 text-sky-400" />
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-base sm:text-lg font-black text-slate-900 truncate">{elderName}</p>
                <p className="text-sm text-slate-500">
                  {elderNickname && `"${elderNickname}" · `}
                  {elderAge} {language === 'th' ? 'ปี' : 'years old'}
                </p>
              </div>
              <Link
                to="/elder-profile"
                className="shrink-0 flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5" />
                {language === 'th' ? 'แก้ไข' : 'Edit'}
              </Link>
            </div>

            {/* Mobility + Conditions */}
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              <span className="inline-flex items-center gap-1 rounded-lg bg-sky-50 border border-sky-200 px-2 py-0.5 text-xs font-bold text-sky-700">
                <MobilityIcon className="w-3.5 h-3.5" />
                {mobilityLabel}
              </span>
              {elderConditions.filter(c => c !== 'none').map((cond) => {
                const conditionMeta = getMedicalConditionMeta(cond);
                return (
                  <span key={cond} className="inline-flex items-center gap-1 rounded-lg bg-rose-50 border border-rose-200 px-2 py-0.5 text-xs font-bold text-rose-700">
                    <HeartPulse className="w-3 h-3" />
                    {getEnumLabel(conditionMeta, language, 'shortLabel') || cond}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        {/* Subtle divider + note */}
        <div className="border-t border-slate-100 bg-slate-50/60 px-4 py-2.5 sm:px-5">
          <p className="text-[11px] text-slate-400 font-medium">
            <span className="text-emerald-600 font-bold">✓ </span>
            {language === 'th'
              ? 'ข้อมูลสุขภาพและความต้องการพิเศษถูกส่งให้ AI แล้ว — แก้ไขได้ที่ "แก้ไขโปรไฟล์"'
              : 'Health data & special needs sent to AI — edit via "Edit Profile"'}
          </p>
        </div>
      </div>

      {/* ── Step Indicator ── */}
      <div className="mb-5">
        <StepIndicator currentStep={currentStep} onStepClick={handleStepClick} />
      </div>

      {/* ── Step Content ── */}
      <Card className="rounded-2xl border-0 bg-white shadow-sm ring-1 ring-slate-200/80">
        <CardContent className="p-5 sm:p-7 lg:p-8">
          <div className="space-y-6">
            {currentStep === 1 && (
              <Step1Activity formData={formData} setFormData={setFormData} elder={elder} />
            )}
            {currentStep === 2 && (
              <Step2Schedule formData={formData} setFormData={setFormData} />
            )}
            {currentStep === 3 && (
              <Step3Budget formData={formData} setFormData={setFormData} />
            )}
          </div>

          {/* ── Wizard Nav ── */}
          <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-5">
            {currentStep > 1 ? (
              <Button
                type="button"
                variant="ghost"
                onClick={handleBack}
                leftIcon={<ArrowLeft className="w-4 h-4" />}
                className="cursor-pointer px-3"
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
                className="bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black shadow-lg shadow-emerald-950/20 cursor-pointer px-6 sm:px-10"
              >
                {t('find.submitToMatches', language === 'th' ? 'ค้นหาผู้ดูแลที่เหมาะสม' : 'Find Matches')}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
