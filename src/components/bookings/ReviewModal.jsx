import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Star, Heart, Check, Sparkles, MessageSquare } from 'lucide-react';

export function ReviewModal({
  isOpen = false,
  onClose,
  booking,
  onSubmit,
}) {
  const { t, getLocalized } = useLanguage();

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);

  useEffect(() => {
    if (isOpen) {
      setRating(5);
      setHoverRating(0);
      setComment('');
      setSelectedTags([]);
    }
  }, [isOpen]);

  if (!isOpen || !booking) return null;

  const quickTags = [
    { id: 'punctual', th: 'ตรงต่อเวลามาก', en: 'Very punctual' },
    { id: 'polite', th: 'สุภาพอ่อนโยน', en: 'Polite & gentle' },
    { id: 'skilled', th: 'ชำนาญขั้นตอนโรงพยาบาล', en: 'Hospital expert' },
    { id: 'careful', th: 'เข็นวีลแชร์ระมัดระวัง', en: 'Careful with wheelchair' },
    { id: 'caring', th: 'ดูแลดุจญาติมิตร', en: 'Treated like family' },
  ];

  const toggleTag = (tag) => {
    const isSelected = selectedTags.includes(tag.th);
    if (isSelected) {
      setSelectedTags(selectedTags.filter((t) => t !== tag.th));
    } else {
      setSelectedTags([...selectedTags, tag.th]);
      if (!comment) {
        setComment(tag.th);
      } else {
        setComment(`${comment} ${tag.th}`);
      }
    }
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    const finalCommentTh = comment.trim() || 'ผู้ดูแลให้บริการดีเยี่ยม สุภาพ ตรงต่อเวลา และใส่ใจคุณยายเป็นอย่างดี';
    const finalCommentEn = comment.trim() || 'Excellent companion! Punctual, polite, and very attentive to my parent.';

    onSubmit?.({
      rating,
      comment_th: finalCommentTh,
      comment_en: finalCommentEn,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('bookings.reviewModal.title', 'ให้คะแนนผู้ดูแล (Rate Caretaker)')}
      size="md"
      footer={
        <div className="flex gap-2 justify-end w-full">
          <Button variant="ghost" onClick={onClose}>
            {t('bookings.reviewModal.cancelBtn', 'ยกเลิก')}
          </Button>
          <Button
            variant="accent"
            onClick={handleSubmit}
            leftIcon={<Star className="w-4 h-4 fill-current" />}
          >
            {t('bookings.reviewModal.submitBtn', 'ส่งรีวิว (Submit Review)')}
          </Button>
        </div>
      }
    >
      <div className="space-y-5 py-1">
        {/* Caretaker Info Header */}
        <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
          <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-200 shrink-0 border border-white shadow-2xs">
            <img
              src={booking.caretakerPhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80'}
              alt={getLocalized(booking, 'caretakerName')}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-sm sm:text-base">
              {getLocalized(booking, 'caretakerName')}
            </h4>
            <p className="text-xs text-slate-500">
              {getLocalized(booking, 'destinationName')}
            </p>
            <p className="text-[11px] text-sky-600 font-medium">
              {booking.serviceDate} ({booking.timeSlot})
            </p>
          </div>
        </div>

        {/* 5-Star Interactive Rating */}
        <div className="text-center space-y-2 py-2">
          <label className="text-xs sm:text-sm font-bold text-slate-800 block">
            {t('bookings.reviewModal.ratingLabel', 'ให้คะแนนความพึงพอใจโดยรวม:')}
          </label>
          <div className="flex items-center justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => {
              const active = (hoverRating || rating) >= star;
              return (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1.5 cursor-pointer hover:scale-115 transition-transform focus:outline-hidden"
                  aria-label={`${star} Star`}
                >
                  <Star
                    className={`w-8 h-8 transition-colors ${
                      active
                        ? 'text-amber-400 fill-amber-400 drop-shadow-xs'
                        : 'text-slate-200 hover:text-slate-300'
                    }`}
                  />
                </button>
              );
            })}
          </div>
          <p className="text-xs font-semibold text-amber-700">
            {rating === 5 && '⭐️⭐️⭐️⭐️⭐️ ยอดเยี่ยม ประทับใจมาก'}
            {rating === 4 && '⭐️⭐️⭐️⭐️ ดีมาก พึงพอใจ'}
            {rating === 3 && '⭐️⭐️⭐️ ปานกลาง พอใช้ได้'}
            {rating === 2 && '⭐️⭐️ ต้องปรับปรุงบางส่วน'}
            {rating === 1 && '⭐️ ไม่พึงพอใจ'}
          </p>
        </div>

        {/* Quick Review Tags */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 block">
            {t('bookings.reviewModal.quickTagsLabel', 'จุดเด่นที่คุณประทับใจ (เลือกได้หลายข้อ):')}
          </label>
          <div className="flex flex-wrap gap-1.5">
            {quickTags.map((tag) => {
              const isSelected = selectedTags.includes(tag.th);
              return (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-sky-500 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {getLocalized(tag, 'th')}
                </button>
              );
            })}
          </div>
        </div>

        {/* Comments Textarea */}
        <div className="space-y-2">
          <label
            htmlFor="review-comment-input"
            className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5"
          >
            <MessageSquare className="w-4 h-4 text-sky-500" />
            <span>{t('bookings.reviewModal.commentLabel', 'ความคิดเห็นของคุณ:')}</span>
          </label>
          <textarea
            id="review-comment-input"
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={t(
              'bookings.reviewModal.commentPlaceholder',
              'บอกเล่าความประทับใจ ความตรงต่อเวลา ความใส่ใจ และความพึงพอใจของผู้สูงอายุ...'
            )}
            className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all resize-y shadow-2xs"
          />
        </div>
      </div>
    </Modal>
  );
}

export default ReviewModal;
