import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CalendarDays, HeartHandshake, Home, Menu, Search, UserRound, X } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import LanguageToggle from './LanguageToggle';
import { Button } from '../ui/Button';

export function Navbar() {
  const location = useLocation();
  const { t } = useLanguage();
  const { bookings } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const upcomingCount = (bookings || []).filter((b) => b.status === 'upcoming').length;

  const navLinks = [
    { path: '/', label: t('nav.home', 'หน้าแรก') },
    { path: '/find', label: t('nav.findCaretaker', 'ค้นหาผู้ดูแล') },
    {
      path: '/bookings',
      label: t('nav.myBookings', 'การจองของฉัน'),
      badge: upcomingCount > 0 ? upcomingCount : null,
    },
    { path: '/elder-profile', label: t('nav.elderProfile', 'ข้อมูลผู้สูงอายุ') },
  ];

  const mobileTabs = [
    { path: '/', label: 'หน้าหลัก', ariaLabel: 'แท็บหน้าหลัก', icon: Home },
    { path: '/find', label: 'ค้นหา', ariaLabel: 'แท็บค้นหา', icon: Search },
    {
      path: '/bookings',
      label: 'จอง',
      ariaLabel: 'แท็บการจอง',
      icon: CalendarDays,
      badge: upcomingCount > 0 ? upcomingCount : null,
    },
    { path: '/elder-profile', label: 'แม่', ariaLabel: 'แท็บข้อมูลแม่', icon: UserRound },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    if (path === '/elder' || path === '/elder-profile') {
      return location.pathname === '/elder' || location.pathname === '/elder-profile';
    }
    if (path === '/find') {
      return location.pathname === '/find' || location.pathname === '/matches' || location.pathname === '/results';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <header role="banner" className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <nav aria-label="Main Navigation" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <Link to="/" className="flex items-center gap-3 group focus:outline-hidden focus:ring-2 focus:ring-sky-500 rounded-xl p-1">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-sky-500 to-emerald-400 flex items-center justify-center text-white shadow-md shadow-sky-500/25 group-hover:scale-105 transition-transform">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
                    Looklarn
                  </span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-200/70">
                    ลูกหลาน
                  </span>
                </div>
                <span className="text-[10px] sm:text-[11px] font-medium text-slate-500">
                  {t('nav.tagline', 'ผู้ช่วยดูแลผู้สูงอายุที่คุณวางใจ')}
                </span>
              </div>
            </Link>

            <div className="hidden md:flex items-center gap-1 lg:gap-2">
              {navLinks.map((link) => {
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`relative px-3.5 py-2 rounded-xl text-sm font-bold transition-all ${
                      active
                        ? 'text-sky-600 bg-sky-50 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <span>{link.label}</span>
                    {link.badge != null && (
                      <span className="ml-1.5 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-black text-white bg-sky-500 rounded-full">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>

            <div className="hidden md:flex items-center gap-3">
              <LanguageToggle />
              <Link to="/find">
                <Button
                  variant="accent"
                  size="sm"
                  leftIcon={<Search className="w-4 h-4 text-slate-950" />}
                  className="bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black shadow-sm"
                >
                  {t('nav.findCaretakerCta', 'จองผู้ดูแลด่วน')}
                </Button>
              </Link>
            </div>

            <div className="flex md:hidden items-center gap-2">
              <LanguageToggle />
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 focus:outline-hidden"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden py-3 border-t border-slate-100 space-y-1">
              {navLinks.map((link) => {
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-sm font-bold ${
                      active ? 'text-sky-600 bg-sky-50' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{link.label}</span>
                    {link.badge != null && (
                      <span className="px-1.5 py-0.5 text-xs font-black text-white bg-sky-500 rounded-full">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          )}
        </nav>
      </header>

      <div
        aria-label="Mobile tab bar"
        className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 px-4 pb-[max(env(safe-area-inset-bottom),0.55rem)] pt-2 shadow-[0_-10px_30px_rgba(15,23,42,0.08)] backdrop-blur-md md:hidden"
      >
        <div className="mx-auto grid max-w-md grid-cols-4 gap-1">
          {mobileTabs.map((tab) => {
            const active = isActive(tab.path);
            const Icon = tab.icon;

            return (
              <Link
                key={tab.path}
                to={tab.path}
                aria-label={tab.ariaLabel}
                className={`relative flex min-h-[3.55rem] flex-col items-center justify-center gap-1 rounded-2xl text-[0.68rem] font-black transition-all ${
                  active ? 'bg-sky-50 text-sky-700' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                <span className={`grid h-7 w-7 place-items-center rounded-xl ${active ? 'bg-sky-600 text-white shadow-sm' : 'bg-slate-100 text-slate-500'}`}>
                  <Icon className="h-4 w-4" />
                </span>
                <span className="leading-none">{tab.label}</span>
                {tab.badge != null && (
                  <span className="absolute right-4 top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-emerald-500 px-1 text-[0.6rem] font-black leading-none text-white">
                    {tab.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default Navbar;
