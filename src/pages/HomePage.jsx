import React from 'react';
import HeroBanner from '../components/home/HeroBanner';
import ActivityGrid from '../components/home/ActivityGrid';
import PromoBanner from '../components/home/PromoBanner';
import HowItWorks from '../components/home/HowItWorks';
import Testimonials from '../components/home/Testimonials';
import CtaSection from '../components/home/CtaSection';

export default function HomePage() {
  return (
    <div data-testid="page-home" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16">
      {/* 1. Hero Banner */}
      <HeroBanner />

      {/* 2. Featured Activity Grid (4 Categories) */}
      <ActivityGrid />

      {/* 3. Partner Promotion Banner */}
      <PromoBanner />

      {/* 4. How It Works (3 Steps) */}
      <HowItWorks />

      {/* 5. Testimonials */}
      <Testimonials />

      {/* 6. Bottom CTA Section */}
      <CtaSection />
    </div>
  );
}
