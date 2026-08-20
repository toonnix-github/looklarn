import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import HeroBanner from '../components/home/HeroBanner';
import ActivityGrid from '../components/home/ActivityGrid';
import PromoBanner from '../components/home/PromoBanner';
import HowItWorks from '../components/home/HowItWorks';
import Testimonials from '../components/home/Testimonials';
import CtaSection from '../components/home/CtaSection';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { formatDate } from '../utils/formatters';
import {
  appointmentEventOptions,
  getAppointmentEventLabel,
  getAppointmentEventMeta,
  getElderMobilityMeta,
  getEnumLabel,
  getMedicalConditionMeta,
} from '../constants/careEnums';
import {
  Accessibility,
  Activity,
  ArrowRight,
  Building2,
  CalendarDays,
  ClipboardList,
  Clock3,
  Coffee,
  Droplets,
  HeartPulse,
  Home as HomeIcon,
  Landmark,
  MapPin,
  PhoneCall,
  Pill,
  Plus,
  Search,
  ShieldCheck,
  ShoppingBag,
  Siren,
  Sparkles,
  Stethoscope,
  Trees,
  Users,
  X,
} from 'lucide-react';

const eventIconMap = {
  Activity,
  Building2,
  ClipboardList,
  Coffee,
  HeartPulse,
  Home: HomeIcon,
  Landmark,
  Pill,
  ShoppingBag,
  Stethoscope,
  Trees,
  Users,
};

const eventFallbackImageByTone = {
  amber: '/assets/activity-temple.png',
  emerald: '/assets/activity-park.png',
  rose: '/assets/activity-hospital.png',
  sky: '/assets/activity-hospital.png',
  slate: '/assets/activity-shopping.png',
  teal: '/assets/activity-shopping.png',
};

export default function HomePage() {
  const { elder, bookings, activities } = useApp();
  const { language, getLocalized } = useLanguage();
  const [activityModalOpen, setActivityModalOpen] = useState(false);
  const upcomingBookings = (bookings || []).filter((booking) => booking.status === 'upcoming');
  const upcomingBooking = upcomingBookings[0];
  const secondaryBookings = upcomingBookings.slice(1, 3);
  const featuredActivities = (activities || []).slice(0, 3);
  const elderPhoto = elder?.photo || '/assets/elder-somporn.png';
  const mobilityMeta = getElderMobilityMeta(elder?.mobilityLevel);
  const primaryConditionMetas = (elder?.medicalConditions || [])
    .map(getMedicalConditionMeta)
    .filter(Boolean)
    .slice(0, 2);
  const activityByType = (activities || []).reduce((lookup, activity) => {
    lookup[activity.type] = activity;
    return lookup;
  }, {});
  const allAppointmentActivities = appointmentEventOptions.map((event) => ({
    id: `event-${event.id}`,
    type: event.id,
    image: activityByType[event.id]?.image || eventFallbackImageByTone[event.tone] || '/assets/activity-hospital.png',
    meta: event,
  }));
  const getActivityDisplay = (activity) => {
    const meta = activity.meta || getAppointmentEventMeta(activity.type);
    const ActivityIcon = eventIconMap[meta.icon] || HeartPulse;
    return {
      label: getEnumLabel(meta, language, 'label') || getLocalized(activity, 'title'),
      helper: getEnumLabel(meta, language, 'helper') || getLocalized(activity, 'subtitle'),
      icon: ActivityIcon,
    };
  };
  const elderPills = [
    {
      icon: CalendarDays,
      label: `${elder?.age || '-'} ปี`,
      className: 'bg-slate-100 text-slate-700 ring-slate-200',
    },
    {
      icon: Droplets,
      label: elder?.bloodType || 'O+',
      className: 'bg-rose-50 text-rose-700 ring-rose-100',
    },
    {
      icon: Accessibility,
      label: getEnumLabel(mobilityMeta, language, 'shortLabel'),
      className: 'bg-sky-50 text-sky-700 ring-sky-100',
    },
    ...primaryConditionMetas.map((condition) => ({
      icon: Pill,
      label: getEnumLabel(condition, language, 'shortLabel'),
      className: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
    })),
  ];

  return (
    <div
      data-testid="page-home"
      className="h-full max-h-full overflow-hidden bg-slate-100 px-[4.1vw] py-[1.8dvh] sm:h-auto sm:max-h-none sm:overflow-visible sm:bg-transparent sm:px-6 sm:py-10 lg:px-8"
    >
      <section
        className="grid h-full min-h-0 grid-rows-[0.6fr_0.44fr_1.58fr_0.78fr] gap-[1.2dvh] sm:hidden"
        aria-label="Looklarn mobile dashboard"
      >
        <h1 className="sr-only">Looklarn ลูกหลาน</h1>
        <div className="min-h-0 overflow-hidden rounded-[min(5.4vw,1.35rem)] bg-white shadow-sm ring-1 ring-slate-200/75">
          <div className="grid h-full min-h-0 grid-cols-[0.66fr_1.66fr] items-center gap-[2.6vw] p-[2.35vw]">
            <div className="relative aspect-square w-full self-center overflow-hidden rounded-[min(3.5vw,0.9rem)] bg-sky-50">
              <img
                src={elderPhoto}
                alt={getLocalized(elder, 'name')}
                className="h-full w-full object-cover object-center"
                onError={(event) => {
                  event.currentTarget.src = '/assets/elder-somporn.png';
                }}
              />
              <div className="absolute inset-x-[8%] bottom-[8%] rounded-full bg-white/90 px-[2vw] py-[0.38dvh] text-center text-[clamp(0.54rem,2.35vw,0.64rem)] font-black text-emerald-700 shadow-sm">
                {getLocalized(elder, 'nickname')}
              </div>
            </div>

            <div className="flex min-h-0 flex-col justify-center gap-[0.62dvh]">
              <div>
                <div className="inline-flex items-center gap-[1.3vw] rounded-full bg-sky-50 px-[2.2vw] py-[0.36dvh] text-[clamp(0.54rem,2.3vw,0.66rem)] font-black text-sky-700 ring-1 ring-sky-100">
                  <Sparkles className="h-[1.45dvh] w-[1.45dvh]" />
                  AI Care Match
                </div>
              </div>

              <div className="flex flex-wrap gap-[1.05vw]">
                {elderPills.map(({ icon: Icon, label, className }) => (
                  <span
                    key={label}
                    className={`inline-flex items-center gap-[0.8vw] rounded-full px-[1.7vw] py-[0.38dvh] text-[clamp(0.5rem,2.2vw,0.6rem)] font-black leading-none ring-1 ${className}`}
                  >
                    <Icon className="h-[1.28dvh] w-[1.28dvh] shrink-0" />
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid min-h-0 grid-cols-[1.08fr_0.92fr] gap-[2.6vw]">
          <Link
            to="/find"
            className="group flex min-h-0 items-center justify-between rounded-[min(4.6vw,1.12rem)] bg-gradient-to-br from-sky-500 to-cyan-600 px-[3.8vw] text-white shadow-lg shadow-sky-700/25 ring-1 ring-sky-300/40 transition active:scale-[0.985]"
          >
            <span className="flex min-w-0 items-center gap-[2.4vw]">
              <span className="grid aspect-square h-[4.9dvh] place-items-center rounded-[min(3.2vw,0.8rem)] bg-white/20 shadow-inner ring-1 ring-white/25">
                <Search className="h-[2.4dvh] w-[2.4dvh]" />
              </span>
              <span className="min-w-0">
                <span className="block text-[clamp(0.78rem,3.7vw,0.96rem)] font-black leading-tight">
                  ค้นหาผู้ดูแล
                </span>
                <span className="block truncate text-[clamp(0.56rem,2.45vw,0.68rem)] font-semibold text-sky-100">
                  จับคู่ด้วย AI
                </span>
              </span>
            </span>
            <span className="grid aspect-square h-[3.5dvh] place-items-center rounded-full bg-white text-sky-600 shadow-sm transition group-active:translate-x-0.5">
              <ArrowRight className="h-[1.9dvh] w-[1.9dvh] shrink-0" />
            </span>
          </Link>

          <button
            type="button"
            className="group flex min-h-0 items-center justify-between rounded-[min(4.6vw,1.12rem)] bg-gradient-to-br from-rose-500 to-pink-600 px-[3.4vw] text-left text-white shadow-lg shadow-rose-700/25 ring-1 ring-rose-300/40 transition active:scale-[0.985]"
          >
            <span className="min-w-0">
              <span className="block text-[clamp(0.76rem,3.45vw,0.92rem)] font-black leading-tight">
                ฉุกเฉิน
              </span>
              <span className="block truncate text-[clamp(0.56rem,2.45vw,0.68rem)] font-bold text-rose-100">
                โทรหาลูกหลาน
              </span>
            </span>
            <span className="grid aspect-square h-[4.5dvh] place-items-center rounded-full bg-white text-rose-600 shadow-sm ring-1 ring-white/50 transition group-active:scale-95">
              <Siren className="h-[2.2dvh] w-[2.2dvh]" />
            </span>
          </button>
        </div>

        <section className="flex min-h-0 flex-col overflow-hidden rounded-[min(5vw,1.25rem)] bg-sky-50/70 p-[3.1vw] shadow-sm ring-1 ring-sky-100">
          <div className="mb-[0.95dvh] flex items-center justify-between">
            <div className="flex min-w-0 items-center gap-[2vw]">
              <span className="grid aspect-square h-[3.7dvh] place-items-center rounded-full bg-white text-emerald-700 shadow-sm ring-1 ring-emerald-100">
                <ShieldCheck className="h-[2dvh] w-[2dvh]" />
              </span>
              <h2 className="text-[clamp(0.86rem,3.8vw,1rem)] font-black leading-tight text-slate-950">
                นัดหมายที่จะมาถึง
              </h2>
            </div>
            <span className="rounded-full bg-white px-[2.2vw] py-[0.45dvh] text-[clamp(0.55rem,2.35vw,0.66rem)] font-black text-sky-700 shadow-sm ring-1 ring-sky-100">
              {upcomingBookings.length} นัด
            </span>
          </div>

          <div className="flex min-h-0 flex-1 flex-col gap-[0.9dvh]">
            <Link
              to="/bookings"
              className="flex basis-[48%] min-h-0 flex-col justify-between overflow-hidden rounded-[min(4vw,1rem)] bg-white p-[3vw] text-slate-950 shadow-sm ring-1 ring-sky-100 transition active:scale-[0.99]"
            >
              <div className="min-w-0">
                <div className="mb-[0.65dvh] inline-flex rounded-full bg-sky-100 px-[2vw] py-[0.4dvh] text-[clamp(0.54rem,2.3vw,0.64rem)] font-black text-sky-700">
                  {upcomingBooking ? formatDate(upcomingBooking.serviceDate, language, 'short') : 'ยังไม่มีนัดหมาย'}
                </div>
                <h3 className="line-clamp-2 text-[clamp(0.88rem,3.9vw,1.05rem)] font-black leading-tight">
                  {upcomingBooking ? getLocalized(upcomingBooking, 'activityTitle') : 'เลือกผู้ดูแลสำหรับนัดแรก'}
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-[2vw] text-[clamp(0.56rem,2.45vw,0.68rem)] font-bold text-slate-500">
                <span className="flex min-w-0 items-center gap-[1vw] truncate rounded-full bg-slate-50 px-[1.7vw] py-[0.35dvh]">
                  <Clock3 className="h-[1.65dvh] w-[1.65dvh] shrink-0" />
                  {upcomingBooking ? upcomingBooking.timeSlot : '-'}
                </span>
                <span className="flex min-w-0 items-center gap-[1vw] truncate rounded-full bg-slate-50 px-[1.7vw] py-[0.35dvh]">
                  <MapPin className="h-[1.65dvh] w-[1.65dvh] shrink-0" />
                  {upcomingBooking ? getLocalized(upcomingBooking, 'caretakerNickname') : 'รอเลือก'}
                </span>
              </div>
            </Link>

            <div className="grid min-h-0 flex-1 gap-[0.7dvh]">
              {secondaryBookings.length > 0 ? (
                secondaryBookings.map((booking) => (
                  <Link
                    key={booking.id}
                    to="/bookings"
                    className="grid min-h-0 grid-cols-[auto_1fr_auto] items-center gap-[2vw] rounded-[min(3.2vw,0.8rem)] bg-white px-[2.5vw] py-[0.85dvh] shadow-sm ring-1 ring-slate-100 transition active:scale-[0.99]"
                  >
                    <span className="grid aspect-square h-[3.1dvh] place-items-center rounded-full bg-emerald-50 text-emerald-700">
                      <CalendarDays className="h-[1.7dvh] w-[1.7dvh]" />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-[clamp(0.64rem,2.75vw,0.76rem)] font-black leading-tight text-slate-900">
                        {getAppointmentEventLabel(booking.activityType, language) || getLocalized(booking, 'activityTitle')}
                      </span>
                      <span className="block truncate text-[clamp(0.52rem,2.2vw,0.62rem)] font-bold leading-tight text-slate-500">
                        {formatDate(booking.serviceDate, language, 'short')} · {booking.timeSlot}
                      </span>
                    </span>
                    <ArrowRight className="h-[1.9dvh] w-[1.9dvh] text-slate-300" />
                  </Link>
                ))
              ) : (
                <div className="flex min-h-0 items-center rounded-[min(3.2vw,0.8rem)] bg-slate-50 px-[2.4vw] text-[clamp(0.6rem,2.55vw,0.7rem)] font-bold text-slate-500 ring-1 ring-slate-100">
                  ยังไม่มีนัดอื่นต่อจากนี้
                </div>
              )}
            </div>

            <Link
              to="/find"
              className="flex h-[4.7dvh] shrink-0 items-center justify-center gap-[2vw] rounded-full bg-emerald-500 px-[3vw] text-[clamp(0.66rem,2.9vw,0.78rem)] font-black text-white shadow-lg shadow-emerald-700/20 ring-1 ring-emerald-300 transition active:scale-[0.985]"
            >
              ทำการนัดหมายครั้งถัดไป
              <PhoneCall className="h-[1.8dvh] w-[1.8dvh]" />
            </Link>
          </div>
        </section>

        <div className="min-h-0 overflow-hidden rounded-[min(5vw,1.25rem)] bg-white p-[3.2vw] shadow-sm ring-1 ring-slate-200/75">
          <div className="mb-[0.9dvh] flex items-center justify-between">
            <div>
              <h2 className="text-[clamp(0.86rem,3.8vw,1rem)] font-black leading-tight text-slate-950">
                เลือกกิจกรรม
              </h2>
              <p className="text-[clamp(0.55rem,2.3vw,0.66rem)] font-semibold leading-tight text-slate-500">
                เริ่มจากสิ่งที่คุณแม่อยากทำ
              </p>
            </div>
            <HeartPulse className="h-[2.7dvh] w-[2.7dvh] text-rose-500" />
          </div>
          <div className="grid h-[calc(100%-4.2dvh)] min-h-0 grid-cols-[1fr_1fr_1fr_auto] gap-[1.7vw]">
            {featuredActivities.map((activity) => {
              const { label, helper, icon: ActivityIcon } = getActivityDisplay(activity);
              return (
                <Link
                  key={activity.id}
                  to={`/find?activity=${activity.type}`}
                  className="flex min-h-0 flex-col justify-center gap-[0.45dvh] overflow-hidden rounded-[min(3.4vw,0.85rem)] bg-slate-50 px-[1.5vw] py-[0.65dvh] text-center ring-1 ring-slate-100 transition active:scale-[0.985]"
                >
                  <span className="relative mx-auto grid aspect-square h-[4.3dvh] place-items-center overflow-hidden rounded-[min(2.8vw,0.7rem)] bg-slate-200 shadow-sm">
                    <img
                      src={activity.image}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover"
                      loading="lazy"
                    />
                    <span className="absolute inset-0 bg-slate-950/18" />
                    <ActivityIcon className="relative h-[2.2dvh] w-[2.2dvh] text-white" />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-[clamp(0.58rem,2.5vw,0.68rem)] font-black leading-tight text-slate-900">
                      {label}
                    </span>
                    <span className="block truncate text-[clamp(0.46rem,1.95vw,0.55rem)] font-bold leading-tight text-slate-500">
                      {helper}
                    </span>
                  </span>
                </Link>
              );
            })}
            <button
              type="button"
              onClick={() => setActivityModalOpen(true)}
              className="flex min-h-0 w-[13vw] flex-col items-center justify-center gap-[0.45dvh] rounded-[min(3.4vw,0.85rem)] bg-sky-50 text-sky-700 shadow-sm ring-1 ring-sky-100 transition active:scale-[0.985]"
              aria-label="ดูทุกกิจกรรม"
            >
              <span className="grid aspect-square h-[4.1dvh] place-items-center rounded-full bg-white shadow-sm ring-1 ring-sky-100">
                <Plus className="h-[2.1dvh] w-[2.1dvh]" />
              </span>
              <span className="text-[clamp(0.5rem,2.05vw,0.58rem)] font-black leading-none">
                More
              </span>
            </button>
          </div>
        </div>
      </section>

      {activityModalOpen && (
        <div className="fixed inset-0 z-[70] sm:hidden" role="dialog" aria-modal="true" aria-label="เลือกกิจกรรมทั้งหมด">
          <button
            type="button"
            aria-label="ปิดรายการกิจกรรม"
            className="absolute inset-0 bg-slate-950/35"
            onClick={() => setActivityModalOpen(false)}
          />
          <div className="absolute inset-x-0 bottom-0 rounded-t-[1.4rem] bg-white px-4 pb-[max(env(safe-area-inset-bottom),1rem)] pt-3 shadow-2xl">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h2 className="text-base font-black leading-tight text-slate-950">เลือกกิจกรรมทั้งหมด</h2>
                <p className="text-xs font-semibold text-slate-500">เลือกสิ่งที่คุณแม่อยากทำ แล้วให้ AI หาผู้ดูแลให้</p>
              </div>
              <button
                type="button"
                className="grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-slate-600"
                onClick={() => setActivityModalOpen(false)}
                aria-label="ปิด"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {allAppointmentActivities.map((activity) => {
                const { label, helper, icon: ActivityIcon } = getActivityDisplay(activity);

                return (
                  <Link
                    key={activity.id}
                    to={`/find?activity=${activity.type}`}
                    onClick={() => setActivityModalOpen(false)}
                    className="grid grid-cols-[auto_1fr] items-center gap-3 rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-100 active:scale-[0.99]"
                  >
                    <span className="relative grid h-12 w-12 place-items-center overflow-hidden rounded-xl bg-slate-200">
                      <img src={activity.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
                      <span className="absolute inset-0 bg-slate-950/20" />
                      <ActivityIcon className="relative h-5 w-5 text-white" />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-black text-slate-900">{label}</span>
                      <span className="block truncate text-xs font-bold text-slate-500">{helper}</span>
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <div className="hidden max-w-7xl space-y-10 sm:mx-auto sm:block sm:space-y-14">
        <HeroBanner headingAs="div" />
        <ActivityGrid />
        <PromoBanner />
        <HowItWorks />
        <Testimonials />
        <CtaSection />
      </div>
    </div>
  );
}
