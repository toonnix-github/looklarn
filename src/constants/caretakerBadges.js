export const CARETAKER_BADGES = Object.freeze({
  CRIMINAL_CHECK: 'criminal_record_checked',
  ID_VERIFIED: 'id_verified',
  CERTIFIED_CAREGIVER: 'certified_caregiver',
  CPR_FIRST_AID: 'cpr_first_aid',
  HOSPITAL_ESCORT: 'hospital_escort_trained',
  REGISTERED_NURSE: 'registered_nurse',
  DEMENTIA_CARE: 'dementia_certified',
  MEDICAL_TRAINING: 'medical_training',
  SAFE_DRIVER: 'defensive_driving_licensed',
  TOUR_GUIDE: 'tour_guide_licensed',
});

export const CARETAKER_BADGE_META = Object.freeze({
  [CARETAKER_BADGES.CRIMINAL_CHECK]: {
    label: { th: 'ตรวจประวัติ', en: 'Criminal check' },
    tone: 'emerald',
  },
  [CARETAKER_BADGES.ID_VERIFIED]: {
    label: { th: 'ยืนยันตัวตน', en: 'ID verified' },
    tone: 'indigo',
  },
  [CARETAKER_BADGES.CERTIFIED_CAREGIVER]: {
    label: { th: 'ผู้ดูแลรับรอง', en: 'Care certified' },
    tone: 'sky',
  },
  [CARETAKER_BADGES.CPR_FIRST_AID]: {
    label: { th: 'ปฐมพยาบาล', en: 'First aid' },
    tone: 'rose',
  },
  [CARETAKER_BADGES.HOSPITAL_ESCORT]: {
    label: { th: 'อบรม รพ.', en: 'Hospital trained' },
    tone: 'cyan',
  },
  [CARETAKER_BADGES.REGISTERED_NURSE]: {
    label: { th: 'พยาบาล', en: 'Registered nurse' },
    tone: 'violet',
  },
  [CARETAKER_BADGES.DEMENTIA_CARE]: {
    label: { th: 'สมองเสื่อม', en: 'Dementia care' },
    tone: 'amber',
  },
  [CARETAKER_BADGES.MEDICAL_TRAINING]: {
    label: { th: 'อบรมแพทย์', en: 'Medical training' },
    tone: 'blue',
  },
  [CARETAKER_BADGES.SAFE_DRIVER]: {
    label: { th: 'ขับขี่ปลอดภัย', en: 'Safe driver' },
    tone: 'slate',
  },
  [CARETAKER_BADGES.TOUR_GUIDE]: {
    label: { th: 'นำเที่ยว', en: 'Guide licensed' },
    tone: 'teal',
  },
});

const STANDARD_BADGES = [
  CARETAKER_BADGES.CRIMINAL_CHECK,
  CARETAKER_BADGES.ID_VERIFIED,
];

const BADGE_PRIORITY = [
  CARETAKER_BADGES.CRIMINAL_CHECK,
  CARETAKER_BADGES.CPR_FIRST_AID,
  CARETAKER_BADGES.REGISTERED_NURSE,
  CARETAKER_BADGES.HOSPITAL_ESCORT,
  CARETAKER_BADGES.MEDICAL_TRAINING,
  CARETAKER_BADGES.DEMENTIA_CARE,
  CARETAKER_BADGES.SAFE_DRIVER,
  CARETAKER_BADGES.TOUR_GUIDE,
  CARETAKER_BADGES.CERTIFIED_CAREGIVER,
  CARETAKER_BADGES.ID_VERIFIED,
];

export const getCaretakerBadgeIds = (caretaker = {}) => {
  const explicitBadges = Array.isArray(caretaker.verifiedBadges) ? caretaker.verifiedBadges : [];
  const normalized = new Set([...STANDARD_BADGES, ...explicitBadges]);

  if (normalized.has(CARETAKER_BADGES.REGISTERED_NURSE)) {
    normalized.add(CARETAKER_BADGES.MEDICAL_TRAINING);
  }
  if (normalized.has(CARETAKER_BADGES.HOSPITAL_ESCORT)) {
    normalized.add(CARETAKER_BADGES.MEDICAL_TRAINING);
  }

  return [...normalized]
    .filter((badgeId) => CARETAKER_BADGE_META[badgeId])
    .sort((a, b) => BADGE_PRIORITY.indexOf(a) - BADGE_PRIORITY.indexOf(b));
};
