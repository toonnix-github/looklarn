import React, { useContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import { LanguageProvider, LanguageContext } from './context/LanguageContext';
import { AppProvider, AppContext } from './context/AppContext';
import { ToastProvider } from './components/ui/Toast';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ScrollToTop from './components/layout/ScrollToTop';

import HomePage from './pages/HomePage';
import FindCaretakerPage from './pages/FindCaretakerPage';
import MatchResultsPage from './pages/MatchResultsPage';
import CaretakerProfilePage from './pages/CaretakerProfilePage';
import BookingPage from './pages/BookingPage';
import MyBookingsPage from './pages/MyBookingsPage';
import ElderProfilePage from './pages/ElderProfilePage';
import NotFoundPage from './pages/NotFoundPage';

export function AppContent() {
  return (
    <ToastProvider>
      <ScrollToTop />
      <div className="min-h-screen bg-slate-100 font-sans text-slate-900 antialiased selection:bg-sky-500 selection:text-white">
        <Navbar />
        <div className="h-[calc(100dvh-9.0625rem)] overflow-hidden lg:h-auto lg:min-h-screen lg:overflow-visible lg:pl-0">
          <main className="h-full overflow-y-auto lg:h-auto lg:min-h-screen lg:overflow-visible">
            <Routes>
              {/* Primary 7 Core App Views */}
              <Route path="/" element={<HomePage />} />
              <Route path="/find" element={<FindCaretakerPage />} />
              <Route path="/matches" element={<MatchResultsPage />} />
              <Route path="/results" element={<MatchResultsPage />} />
              <Route path="/caretaker/:id" element={<CaretakerProfilePage />} />
              <Route path="/book/:id" element={<BookingPage />} />
              <Route path="/bookings" element={<MyBookingsPage />} />
              <Route path="/elder" element={<ElderProfilePage />} />
              <Route path="/elder-profile" element={<ElderProfilePage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </div>
    </ToastProvider>
  );
}

export function App() {
  const existingLang = useContext(LanguageContext);
  const existingApp = useContext(AppContext);

  let content = <AppContent />;

  if (!existingApp) {
    content = <AppProvider>{content}</AppProvider>;
  }
  if (!existingLang) {
    content = <LanguageProvider>{content}</LanguageProvider>;
  }

  return content;
}

export default App;
