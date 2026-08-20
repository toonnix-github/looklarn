import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Star, ShieldCheck, MessageSquareQuote, ThumbsUp } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

export function CaretakerReviews({
  reviews = [],
  rating = 4.95,
  reviewsCount = 58,
  className = '',
}) {
  const { t, getLocalized, language } = useLanguage();

  const starDistribution = [
    { stars: 5, percentage: 92, count: Math.round(reviewsCount * 0.92) },
    { stars: 4, percentage: 8, count: Math.round(reviewsCount * 0.08) },
    { stars: 3, percentage: 0, count: 0 },
    { stars: 2, percentage: 0, count: 0 },
    { stars: 1, percentage: 0, count: 0 },
  ];

  return (
    <Card className={`space-y-6 ${className}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquareQuote className="w-5 h-5 text-amber-500" />
            <CardTitle>
              {t('caretaker.reviewsTitle', 'รีวิวและความคิดเห็นจากครอบครัวผู้ใช้บริการจริง')}
            </CardTitle>
          </div>
          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
            {reviewsCount} {language === 'th' ? 'รายการ' : 'entries'}
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Rating Breakdown Summary */}
        <div className="p-5 bg-gradient-to-r from-amber-50/50 via-sky-50/30 to-emerald-50/50 rounded-2xl border border-slate-100 flex flex-col sm:flex-row items-center gap-6">
          {/* Big Score */}
          <div className="text-center sm:border-r sm:border-slate-200/80 sm:pr-8 shrink-0">
            <div className="text-4xl sm:text-5xl font-black text-slate-900 leading-none tracking-tight">
              {rating}
            </div>
            <div className="flex items-center justify-center gap-0.5 text-amber-400 my-1.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-slate-500 font-medium">
              {t('caretaker.reviewsCount', { count: reviewsCount })}
            </p>
          </div>

          {/* Star Distribution Progress Bars */}
          <div className="flex-1 w-full space-y-1.5">
            {starDistribution.map((dist) => (
              <div key={dist.stars} className="flex items-center gap-2.5 text-xs text-slate-600">
                <span className="w-10 font-bold flex items-center gap-1">
                  {dist.stars} <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                </span>
                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      dist.stars === 5 ? 'bg-emerald-500' : 'bg-sky-400'
                    }`}
                    style={{ width: `${dist.percentage}%` }}
                  />
                </div>
                <span className="w-8 text-right font-medium text-slate-400">
                  {dist.percentage}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Verified Reviews List */}
        <div className="space-y-4">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-4 sm:p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-3 hover:bg-white hover:shadow-xs transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-slate-900 text-sm">
                    {rev.reviewerName}
                  </span>
                  <span className="text-xs font-medium text-sky-600 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-100">
                    {getLocalized(rev, 'relationship')}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    {t('caretaker.verifiedOuting', 'ยืนยันการใช้บริการจริง')}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-xs text-slate-400 font-medium">
                    {formatDate(rev.date, language)}
                  </span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic bg-white p-3.5 rounded-xl border border-slate-100">
                "{getLocalized(rev, 'comment')}"
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default CaretakerReviews;
