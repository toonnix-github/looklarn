import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import StepIndicator from '../components/find/StepIndicator';
import Step1Activity from '../components/find/Step1Physical';
import Step2Caretaker from '../components/find/Step3Schedule';
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
  const elderPhoto = elder?.photo || '/assets/elder-somporn.png';
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
    startTime: searchCriteria?.startTime || '08:00',
    endTime: searchCriteria?.endTime || '12:00',
    durationHours: searchCriteria?.durationHours || 4,
    pickupAddress: searchCriteria?.pickupAddress || elderAddress || '',
    destination: searchCriteria?.destination || elderHospital || '',
    notes: searchCriteria?.specialNotes || elderNotes || '',
    // pass-through from elder profile for AI matching
    mobility: elderMobility,
    conditions: elderConditions,
    needsMedicationReminder: searchCriteria?.needsMedicationReminder ?? true,
    language: elder?.preferredLanguages?.[0] || 'Thai',
    religion: 'Buddhism',
    dietary: 'low_sodium',
    genderPref: searchCriteria?.genderPref || 'any',
    caretakerRequirements: searchCriteria?.caretakerRequirements || [],
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
    setCurrentStep((prev) => Math.min(prev + 1, 2));
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
    <div
      data-testid="page-find"
      className="h-full max-h-full w-full overflow-hidden bg-slate-100 px-[4.1vw] py-[1.35dvh] sm:mx-auto sm:h-auto sm:max-h-none sm:max-w-3xl sm:overflow-visible sm:bg-transparent sm:px-6 sm:py-6 lg:py-10"
    >
      <div className="grid h-full min-h-0 grid-rows-[auto_auto_auto_1fr] gap-[1dvh] sm:block">

      {/* ── Page Header ── */}
      <div className="sm:mb-6">
        <h1 className="text-[clamp(1.24rem,5.8vw,1.52rem)] font-black leading-tight text-slate-900 sm:text-3xl">
          {language === 'th'
            ? `วันนี้คุณ${elderNickname || elderName}มีนัดอะไร`
            : `Today for ${elderNickname || elderName}`}
        </h1>
      </div>

      {/* ── Elder Profile Card ── */}
      <div className="overflow-hidden rounded-[min(4.6vw,1.15rem)] bg-white shadow-sm ring-1 ring-slate-200/80 sm:mb-6 sm:rounded-2xl">
        <div className="flex items-center gap-[2.8vw] p-[2.8vw] sm:gap-4 sm:p-5">
          {/* Avatar */}
          <div className="shrink-0">
            {elderPhoto ? (
              <img
                src={elderPhoto}
                alt={elderName}
                onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/assets/elder-somporn.png'; }}
                className="aspect-square h-[7.3dvh] max-h-16 min-h-12 object-cover ring-2 ring-sky-100 shadow-sm sm:h-20 sm:w-20"
              />
            ) : null}
            <div
              className={`aspect-square h-[7.3dvh] max-h-16 min-h-12 items-center justify-center bg-gradient-to-br from-sky-100 to-teal-100 shadow-sm ring-2 ring-sky-100 sm:h-20 sm:w-20 ${elderPhoto ? 'hidden' : 'flex'}`}
            >
              <User className="h-[3.2dvh] w-[3.2dvh] text-sky-400 sm:h-8 sm:w-8" />
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-[clamp(0.9rem,4vw,1.08rem)] font-black leading-tight text-slate-900 sm:text-lg">{elderName}</p>
                <p className="text-[clamp(0.66rem,2.85vw,0.78rem)] font-semibold leading-tight text-slate-500 sm:text-sm">
                  {elderNickname && `"${elderNickname}" · `}
                  {elderAge} {language === 'th' ? 'ปี' : 'years old'}
                </p>
              </div>
              <Link
                to="/elder-profile"
                className="flex shrink-0 items-center gap-[1vw] rounded-full border border-slate-200 px-[2vw] py-[0.45dvh] text-[clamp(0.6rem,2.55vw,0.7rem)] font-black text-slate-600 transition-colors hover:bg-slate-50 sm:gap-1.5 sm:rounded-xl sm:px-3 sm:py-1.5 sm:text-xs"
              >
                <Edit3 className="h-[1.45dvh] w-[1.45dvh] sm:h-3.5 sm:w-3.5" />
                {language === 'th' ? 'แก้ไข' : 'Edit'}
              </Link>
            </div>

            {/* Mobility + Conditions */}
            <div className="mt-[0.7dvh] flex flex-wrap gap-[1vw] sm:mt-2.5 sm:gap-1.5">
              <span className="inline-flex items-center gap-[0.8vw] rounded-full border border-sky-200 bg-sky-50 px-[1.7vw] py-[0.32dvh] text-[clamp(0.56rem,2.35vw,0.66rem)] font-black leading-none text-sky-700 sm:gap-1 sm:rounded-lg sm:px-2 sm:py-0.5 sm:text-xs">
                <MobilityIcon className="h-[1.3dvh] w-[1.3dvh] sm:h-3.5 sm:w-3.5" />
                {mobilityLabel}
              </span>
              {elderConditions.filter(c => c !== 'none').map((cond) => {
                const conditionMeta = getMedicalConditionMeta(cond);
                return (
                  <span key={cond} className="inline-flex items-center gap-[0.8vw] rounded-full border border-rose-200 bg-rose-50 px-[1.7vw] py-[0.32dvh] text-[clamp(0.56rem,2.35vw,0.66rem)] font-black leading-none text-rose-700 sm:gap-1 sm:rounded-lg sm:px-2 sm:py-0.5 sm:text-xs">
                    <HeartPulse className="h-[1.2dvh] w-[1.2dvh] sm:h-3 sm:w-3" />
                    {getEnumLabel(conditionMeta, language, 'shortLabel') || cond}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        {/* Subtle divider + note */}
        <div className="hidden border-t border-slate-100 bg-slate-50/60 px-4 py-2.5 sm:block sm:px-5">
          <p className="text-[11px] text-slate-400 font-medium">
            <span className="text-emerald-600 font-bold">✓ </span>
            {language === 'th'
              ? 'ข้อมูลสุขภาพและความต้องการพิเศษถูกส่งให้ AI แล้ว — แก้ไขได้ที่ "แก้ไขโปรไฟล์"'
              : 'Health data & special needs sent to AI — edit via "Edit Profile"'}
          </p>
        </div>
      </div>

      {/* ── Step Indicator ── */}
      <div className="sm:mb-5">
        <StepIndicator currentStep={currentStep} onStepClick={handleStepClick} />
      </div>

      {/* ── Step Content ── */}
      <Card className="min-h-0 overflow-hidden rounded-[min(5vw,1.25rem)] border-0 bg-white shadow-sm ring-1 ring-slate-200/80 sm:overflow-visible sm:rounded-2xl">
        <CardContent className="flex h-full min-h-0 flex-col p-[3.2vw] sm:block sm:p-7 lg:p-8">
          <div className="min-h-0 flex-1 overflow-hidden sm:overflow-visible">
            {currentStep === 1 && (
              <Step1Activity formData={formData} setFormData={setFormData} elder={elder} />
            )}
            {currentStep === 2 && (
              <Step2Caretaker formData={formData} setFormData={setFormData} />
            )}
          </div>

          {/* ── Wizard Nav ── */}
          <div className="mt-[1.2dvh] flex shrink-0 items-center justify-between gap-3 border-t border-slate-100 pt-[1.2dvh] sm:mt-8 sm:pt-5">
            {currentStep > 1 ? (
              <Button
                type="button"
                variant="ghost"
                onClick={handleBack}
                leftIcon={<ArrowLeft className="w-4 h-4" />}
                className="shrink-0 cursor-pointer whitespace-nowrap px-3"
              >
                {t('common.back', 'ย้อนกลับ')}
              </Button>
            ) : (
              <div />
            )}

            {currentStep < 2 ? (
              <Button
                type="button"
                variant="primary"
                onClick={handleNext}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="h-[4.7dvh] cursor-pointer px-6 text-[clamp(0.74rem,3.15vw,0.88rem)] font-black sm:h-auto sm:text-sm"
              >
                {t('common.next', 'ถัดไป')}
              </Button>
            ) : (
              <Button
                type="button"
                variant="accent"
                size="md"
                onClick={handleSubmit}
                rightIcon={<Sparkles className="h-4 w-4 text-slate-950" />}
                className="h-[5.2dvh] max-h-12 min-w-0 cursor-pointer whitespace-nowrap rounded-xl bg-emerald-400 px-4 text-sm font-black text-slate-950 shadow-md shadow-emerald-950/15 hover:bg-emerald-300 sm:h-auto sm:px-7"
              >
                {t('find.submitToMatches', language === 'th' ? 'ค้นหาผู้ดูแลที่เหมาะสม' : 'Find Matches')}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
