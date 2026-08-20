import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HeartHandshake, Menu, X, Search } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAppContext, useApp } from '../../context/AppContext';
import LanguageToggle from './LanguageToggle';
import { Button } from '../ui/Button';
import { cn } from '../../utils/cn';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { t } = useLanguage();

  // Interop hook access
  const appCtx =
    (typeof useAppContext === 'function' ? useAppContext() : null) ||
    (typeof useApp === 'function' ? useApp() : null) ||
    {};
  const bookings = appCtx.bookings || [];
  const upcomingCount = bookings.filter((b) => b.status === 'upcoming').length;

  const navLinks = [
    { path: '/', label: t('nav.home', 'หน้าแรก') },
    { path: '/find', label: t('nav.findCaretaker', 'ค้นหาผู้ดูแล') },
    { path: '/bookings', label: t('nav.myBookings', 'การจองของฉัน'), badge: upcomingCount > 0 ? upcomingCount : null },
    { path: '/elder-profile', label: t('nav.elderProfile', 'ข้อมูลผู้สูงอายุ') },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    if (path === '/elder' || path === '/elder-profile') return location.pathname === '/elder' || location.pathname === '/elder-profile';
    if (path === '/find') return location.pathname === '/find' || location.pathname === '/matches' || location.pathname === '/results';
    return location.pathname.startsWith(path);
  };

  return (
    <header role="banner" className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-sky-100/80 shadow-xs transition-colors">
      <nav aria-label="Main Navigation" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo inside nav */}
          <Link to="/" className="flex items-center gap-2.5 group focus:outline-hidden">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500 to-emerald-400 flex items-center justify-center text-white shadow-sm shadow-sky-500/25 group-hover:scale-105 transition-transform">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-tight text-slate-900">Looklarn</span>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-200/50">
                  ลูกหลาน
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium tracking-wide">
                AI Companion Escort
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1.5 lg:gap-2">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    'relative px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-150 flex items-center gap-2',
                    active
                      ? 'bg-sky-50 text-sky-700 font-semibold shadow-xs'
                      : 'text-slate-600 hover:text-sky-600 hover:bg-slate-50'
                  )}
                >
                  <span>{link.label}</span>
                  {link.badge != null && (
                    <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold text-white bg-sky-500 rounded-full">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right Actions: Language Toggle & CTA */}
          <div className="hidden md:flex items-center gap-3">
            <LanguageToggle />
            <Link to="/find">
              <Button variant="accent" size="sm" leftIcon={<Search className="w-4 h-4" />}>
                {t('nav.findCaretakerCta', 'จองผู้ดูแลด่วน')}
              </Button>
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex items-center gap-2 md:hidden">
            <LanguageToggle />
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 focus:outline-hidden cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg animate-in slide-in-from-top-2">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium transition-colors',
                    active
                      ? 'bg-sky-50 text-sky-700 font-semibold'
                      : 'text-slate-700 hover:bg-slate-50'
                  )}
                >
                  <span>{link.label}</span>
                  {link.badge != null && (
                    <span className="px-2 py-0.5 text-xs font-bold text-white bg-sky-500 rounded-full">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
            <div className="pt-3 border-t border-slate-100">
              <Link to="/find" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="accent" className="w-full py-3">
                  {t('nav.findCaretakerCta', 'จองผู้ดูแลด่วน')}
                </Button>
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

export default Navbar;
