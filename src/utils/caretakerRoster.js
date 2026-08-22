import { CARETAKER_BADGES } from '../constants/caretakerBadges';

const PHOTO_BY_ID = Object.freeze({
  'ct-001': '/assets/caretaker-male-01.jpg',
  'ct-002': '/assets/caretaker-female-01.jpg',
  'ct-003': '/assets/caretaker-female-02.jpg',
  'ct-004': '/assets/caretaker-female-03.jpg',
  'ct-005': '/assets/caretaker-male-02.jpg',
});

const EXTRA_CARETAKERS = Object.freeze([
  {
    id: 'ct-006',
    name: { th: 'มินตรา ศรีสุข', en: 'Mintra Srisuk' },
    nickname: { th: 'มิ้นท์', en: 'Mint' },
    gender: 'female',
    age: 33,
    photo: '/assets/caretaker-female-11.jpg',
    matchScore: 94,
    tierName: { th: 'ผู้ช่วยพยาบาลดูแลนัด รพ. และเอกสาร', en: 'Hospital Escort & Care Document Assistant' },
    rating: 4.93,
    reviewsCount: 61,
    completedTrips: 131,
    experienceYears: 5,
    specialties: [
      { th: 'ประสานงานแผนกผู้ป่วยนอกและรับยา', en: 'OPD Coordination & Pharmacy Pickup' },
      { th: 'ช่วยเข็นวีลแชร์ในโรงพยาบาล', en: 'Hospital Wheelchair Assistance' },
      { th: 'สรุปคำแนะนำแพทย์ให้ครอบครัว', en: 'Doctor Notes for Family' },
    ],
  },
  {
    id: 'ct-007',
    name: { th: 'วีรชัย ทองดี', en: 'Weerachai Thongdee' },
    nickname: { th: 'ชัย', en: 'Chai' },
    gender: 'male',
    age: 41,
    photo: '/assets/caretaker-male-03.jpg',
    matchScore: 93,
    tierName: { th: 'ผู้ช่วยเดินทางพร้อมรถสำหรับวีลแชร์', en: 'Wheelchair Transport Companion' },
    rating: 4.91,
    reviewsCount: 55,
    completedTrips: 156,
    experienceYears: 7,
    specialties: [
      { th: 'รถกว้างสำหรับพับเก็บวีลแชร์', en: 'Wheelchair-Friendly Vehicle' },
      { th: 'ช่วยย้ายตัวขึ้นลงรถอย่างปลอดภัย', en: 'Safe Transfer Assistance' },
      { th: 'ขับรถนุ่มนวลสำหรับผู้สูงอายุ', en: 'Gentle Senior Transport' },
    ],
  },
  {
    id: 'ct-008',
    name: { th: 'สุชาดา รุ่งเรือง', en: 'Suchada Rungruang' },
    nickname: { th: 'ดา', en: 'Da' },
    gender: 'female',
    age: 36,
    photo: '/assets/caretaker-female-05.jpg',
    matchScore: 92,
    tierName: { th: 'ผู้ดูแลพาไหว้พระและกิจกรรมเบา ๆ', en: 'Temple & Gentle Outing Companion' },
    rating: 4.9,
    reviewsCount: 48,
    completedTrips: 118,
    experienceYears: 6,
    specialties: [
      { th: 'ดูแลขึ้นลงบันไดและพื้นต่างระดับ', en: 'Stair & Uneven Ground Support' },
      { th: 'เตรียมร่ม น้ำ และจุดพัก', en: 'Shade, Water & Rest Planning' },
      { th: 'พูดอีสานได้', en: 'Isan Dialect' },
    ],
  },
  {
    id: 'ct-009',
    name: { th: 'เบญญาภา จันทร์ดี', en: 'Benyapa Chandee' },
    nickname: { th: 'เบญ', en: 'Ben' },
    gender: 'female',
    age: 29,
    photo: '/assets/caretaker-female-06.jpg',
    matchScore: 91,
    tierName: { th: 'ผู้ช่วยกายภาพและเดินเล่นพักผ่อน', en: 'Mobility Exercise & Leisure Companion' },
    rating: 4.88,
    reviewsCount: 39,
    completedTrips: 96,
    experienceYears: 4,
    specialties: [
      { th: 'ช่วยพยุงเดินและฝึกทรงตัว', en: 'Gait & Balance Support' },
      { th: 'เดินสวนหรือห้างแบบไม่เร่ง', en: 'Slow-Paced Park or Mall Walks' },
      { th: 'อัปเดตรูปและอาการให้ครอบครัว', en: 'Photo & Care Updates' },
    ],
  },
  {
    id: 'ct-010',
    name: { th: 'ธนพล เกียรติไพบูลย์', en: 'Thanapol Kiatpaiboon' },
    nickname: { th: 'นัท', en: 'Nut' },
    gender: 'male',
    age: 37,
    photo: '/assets/caretaker-male-04.jpg',
    matchScore: 90,
    tierName: { th: 'ผู้ประสานงานคิวโรงพยาบาลและเอกสาร', en: 'Hospital Queue & Document Coordinator' },
    rating: 4.87,
    reviewsCount: 44,
    completedTrips: 124,
    experienceYears: 5,
    specialties: [
      { th: 'ช่วยติดต่อแผนกและลงทะเบียน', en: 'Clinic Desk & Registration Help' },
      { th: 'ช่วยถือเอกสารและรับยา', en: 'Documents & Medication Pickup' },
      { th: 'รอคิวนานได้ ใจเย็น', en: 'Patient Long-Queue Support' },
    ],
  },
  {
    id: 'ct-011',
    name: { th: 'รัตนา แก้วมณี', en: 'Rattana Kaewmanee' },
    nickname: { th: 'นา', en: 'Na' },
    gender: 'female',
    age: 45,
    photo: '/assets/caretaker-female-07.jpg',
    matchScore: 89,
    tierName: { th: 'ผู้ดูแลภาวะความจำเสื่อมและผู้สูงอายุเปราะบาง', en: 'Dementia-Aware Senior Companion' },
    rating: 4.96,
    reviewsCount: 82,
    completedTrips: 211,
    experienceYears: 10,
    specialties: [
      { th: 'ดูแลผู้มีภาวะหลงลืมอย่างใจเย็น', en: 'Calm Dementia-Aware Care' },
      { th: 'เตือนทานยาและสังเกตอาการ', en: 'Medication Reminder & Observation' },
      { th: 'พูดใต้ได้', en: 'Southern Dialect' },
    ],
  },
  {
    id: 'ct-012',
    name: { th: 'กิตติ วิริยะกุล', en: 'Kitti Wiriyakul' },
    nickname: { th: 'ตี๋', en: 'Tee' },
    gender: 'male',
    age: 39,
    photo: '/assets/caretaker-male-05.jpg',
    matchScore: 87,
    tierName: { th: 'ผู้ช่วยพาไปธนาคารและหน่วยงานราชการ', en: 'Bank & Government Office Escort' },
    rating: 4.84,
    reviewsCount: 34,
    completedTrips: 88,
    experienceYears: 6,
    specialties: [
      { th: 'ช่วยจัดเอกสารและรอคิว', en: 'Document Prep & Queue Support' },
      { th: 'อ่านป้ายและแบบฟอร์มให้ชัดเจน', en: 'Form Reading Assistance' },
      { th: 'ดูแลความปลอดภัยในที่คนเยอะ', en: 'Crowd Safety Support' },
    ],
  },
  {
    id: 'ct-013',
    name: { th: 'ชลธิชา วัฒนกุล', en: 'Chonthicha Wattanakul' },
    nickname: { th: 'ชล', en: 'Chon' },
    gender: 'female',
    age: 32,
    photo: '/assets/caretaker-female-08.jpg',
    matchScore: 86,
    tierName: { th: 'ผู้ช่วยซื้อของและกิจกรรมในห้าง', en: 'Shopping & Indoor Activity Companion' },
    rating: 4.82,
    reviewsCount: 29,
    completedTrips: 74,
    experienceYears: 4,
    specialties: [
      { th: 'ช่วยถือของและจัดลำดับซื้อของ', en: 'Shopping List & Bag Assistance' },
      { th: 'เลือกเส้นทางลิฟต์และจุดพัก', en: 'Elevator & Rest-Point Planning' },
      { th: 'คุยเก่งและใจเย็น', en: 'Warm Conversation' },
    ],
  },
  {
    id: 'ct-014',
    name: { th: 'พงศกร นาคะ', en: 'Pongsakorn Naka' },
    nickname: { th: 'โก้', en: 'Go' },
    gender: 'male',
    age: 35,
    photo: '/assets/caretaker-male-06.jpg',
    matchScore: 85,
    tierName: { th: 'ผู้ช่วยพาครอบครัวร่วมงานสังคม', en: 'Family Event Escort Companion' },
    rating: 4.8,
    reviewsCount: 37,
    completedTrips: 102,
    experienceYears: 5,
    specialties: [
      { th: 'ดูแลขึ้นลงรถและยืนรอนานได้', en: 'Vehicle Transfer & Event Waiting' },
      { th: 'ช่วยประสานงานกับญาติ', en: 'Family Coordination' },
      { th: 'แต่งกายสุภาพตามงาน', en: 'Formal Event Etiquette' },
    ],
  },
  {
    id: 'ct-015',
    name: { th: 'พิมพ์ชนก สุวรรณ', en: 'Pimchanok Suwan' },
    nickname: { th: 'พิม', en: 'Pim' },
    gender: 'female',
    age: 30,
    photo: '/assets/caretaker-female-09.jpg',
    matchScore: 84,
    tierName: { th: 'ผู้ช่วยเฝ้าไข้และอัปเดตครอบครัว', en: 'Inpatient Watch & Family Update Assistant' },
    rating: 4.89,
    reviewsCount: 46,
    completedTrips: 119,
    experienceYears: 5,
    specialties: [
      { th: 'เฝ้าไข้ช่วงกลางวัน', en: 'Daytime Inpatient Watch' },
      { th: 'วัดสัญญาณชีพพื้นฐาน', en: 'Basic Vital Signs Check' },
      { th: 'ส่งอัปเดตเป็นรอบ ๆ', en: 'Scheduled Family Updates' },
    ],
  },
  {
    id: 'ct-016',
    name: { th: 'ณัฐวุฒิ ภักดี', en: 'Nattawut Pakdee' },
    nickname: { th: 'วุฒิ', en: 'Wut' },
    gender: 'male',
    age: 43,
    photo: '/assets/caretaker-male-07.jpg',
    matchScore: 83,
    tierName: { th: 'ผู้ช่วยเดินทางระยะไกลและรถกว้าง', en: 'Long-Distance Senior Transport Companion' },
    rating: 4.78,
    reviewsCount: 31,
    completedTrips: 95,
    experienceYears: 8,
    specialties: [
      { th: 'รถกว้างสำหรับนั่งสบาย', en: 'Comfortable Spacious Vehicle' },
      { th: 'วางแผนจุดพักระหว่างทาง', en: 'Rest-Stop Planning' },
      { th: 'ช่วยยกอุปกรณ์ช่วยเดิน', en: 'Mobility Aid Handling' },
    ],
  },
  {
    id: 'ct-017',
    name: { th: 'กานต์สินี วงษ์ชัย', en: 'Kansinee Wongchai' },
    nickname: { th: 'กานต์', en: 'Kan' },
    gender: 'female',
    age: 34,
    photo: '/assets/caretaker-female-10.jpg',
    matchScore: 82,
    tierName: { th: 'ผู้ดูแลพูดเหนือและกิจกรรมเบา ๆ', en: 'Northern Dialect Leisure Companion' },
    rating: 4.81,
    reviewsCount: 33,
    completedTrips: 86,
    experienceYears: 5,
    specialties: [
      { th: 'พูดเหนือได้', en: 'Northern Dialect' },
      { th: 'พาเดินเล่นและนั่งคาเฟ่', en: 'Strolls & Cafe Outings' },
      { th: 'ช่วยเตือนยาและดูแลอาหาร', en: 'Medication & Meal Reminders' },
    ],
  },
  {
    id: 'ct-018',
    name: { th: 'อนันต์ ศิริชัย', en: 'Anan Sirichai' },
    nickname: { th: 'นนท์', en: 'Non' },
    gender: 'male',
    age: 46,
    photo: '/assets/caretaker-male-08.jpg',
    matchScore: 80,
    tierName: { th: 'ผู้ช่วยยกพยุงและดูแลผู้ใช้วีลแชร์', en: 'Transfer & Wheelchair Support Companion' },
    rating: 4.77,
    reviewsCount: 27,
    completedTrips: 79,
    experienceYears: 9,
    specialties: [
      { th: 'ช่วยย้ายตัวอย่างถูกท่า', en: 'Safe Body Transfer' },
      { th: 'รับมือบันไดและทางลาด', en: 'Ramp & Step Support' },
      { th: 'เฝ้าระวังการหกล้ม', en: 'Fall-Risk Awareness' },
    ],
  },
  {
    id: 'ct-019',
    name: { th: 'ภาคิน เจริญผล', en: 'Phakin Charoenphon' },
    nickname: { th: 'คิน', en: 'Kin' },
    gender: 'male',
    age: 31,
    photo: '/assets/caretaker-male-09.jpg',
    matchScore: 78,
    tierName: { th: 'ผู้ช่วยกิจกรรมกลางแจ้งและเดินสวน', en: 'Outdoor Walk & Park Companion' },
    rating: 4.74,
    reviewsCount: 22,
    completedTrips: 63,
    experienceYears: 4,
    specialties: [
      { th: 'เลือกเส้นทางร่มและจุดพัก', en: 'Shaded Route Planning' },
      { th: 'ช่วยพยุงเดินช้า ๆ', en: 'Slow Walking Support' },
      { th: 'สังเกตอาการเหนื่อยง่าย', en: 'Fatigue Monitoring' },
    ],
  },
  {
    id: 'ct-020',
    name: { th: 'ลลิตา พรหมรักษ์', en: 'Lalita Promrak' },
    nickname: { th: 'ลิตา', en: 'Lita' },
    gender: 'female',
    age: 40,
    photo: '/assets/caretaker-female-04.jpg',
    matchScore: 76,
    tierName: { th: 'ผู้ดูแลทั่วไปสำหรับนัดครึ่งวัน', en: 'Standard Half-Day Senior Companion' },
    rating: 4.72,
    reviewsCount: 25,
    completedTrips: 70,
    experienceYears: 6,
    specialties: [
      { th: 'ดูแลพื้นฐานและพาเดินทางใกล้บ้าน', en: 'Basic Care & Nearby Trips' },
      { th: 'ช่วยถือของและเตือนยา', en: 'Bags & Medication Reminder' },
      { th: 'พูดกลางชัดเจน', en: 'Clear Central Thai' },
    ],
  },
]);

const cloneLocalizedList = (list = []) => list.map((item) => ({ ...item }));

const inferVerifiedBadges = (profile) => {
  const profileText = [
    profile.tierName?.th,
    profile.tierName?.en,
    ...(profile.specialties || []).flatMap((item) => [item.th, item.en]),
  ].join(' ').toLowerCase();
  const badges = new Set([
    CARETAKER_BADGES.CERTIFIED_CAREGIVER,
    CARETAKER_BADGES.CPR_FIRST_AID,
  ]);

  if (profileText.includes('รพ') || profileText.includes('โรงพยาบาล') || profileText.includes('hospital') || profileText.includes('แพทย์') || profileText.includes('medical')) {
    badges.add(CARETAKER_BADGES.HOSPITAL_ESCORT);
    badges.add(CARETAKER_BADGES.MEDICAL_TRAINING);
  }
  if (profileText.includes('พยาบาล') || profileText.includes('nurse')) {
    badges.add(CARETAKER_BADGES.MEDICAL_TRAINING);
  }
  if (profileText.includes('สมองเสื่อม') || profileText.includes('dementia')) {
    badges.add(CARETAKER_BADGES.DEMENTIA_CARE);
  }
  if (profileText.includes('รถ') || profileText.includes('ขับ') || profileText.includes('driver') || profileText.includes('transport') || profileText.includes('vehicle')) {
    badges.add(CARETAKER_BADGES.SAFE_DRIVER);
  }
  if (profileText.includes('วัด') || profileText.includes('ไหว้พระ') || profileText.includes('temple') || profileText.includes('guide')) {
    badges.add(CARETAKER_BADGES.TOUR_GUIDE);
  }

  return [...badges];
};

const buildExtraProfile = (template, profile) => ({
  ...template,
  ...profile,
  isBestMatch: false,
  tier: profile.tier || template.tier,
  tierName: profile.tierName,
  specialties: cloneLocalizedList(profile.specialties),
  languages: cloneLocalizedList(profile.languages || template.languages),
  verifiedBadges: [...(profile.verifiedBadges || inferVerifiedBadges(profile))],
  education: profile.education || template.education,
  vehicle: profile.vehicle || template.vehicle,
  serviceAreas: cloneLocalizedList(profile.serviceAreas || template.serviceAreas),
  bio: profile.bio || {
    th: `${profile.name.th} มีประสบการณ์ดูแลผู้สูงอายุ ${profile.experienceYears} ปี เชี่ยวชาญงานตามโปรไฟล์และสื่อสารกับครอบครัวอย่างสม่ำเสมอ`,
    en: `${profile.name.en} has ${profile.experienceYears} years of senior companion experience with reliable family updates.`,
  },
  availableSlots: profile.availableSlots || template.availableSlots,
  reviews: profile.reviews || [],
});

export const buildCaretakerRoster = (initialCaretakers = []) => {
  const templates = initialCaretakers.length > 0 ? initialCaretakers : [];
  const normalizedInitial = templates.map((caretaker) => ({
    ...caretaker,
    photo: PHOTO_BY_ID[caretaker.id] || caretaker.photo,
    isBestMatch: caretaker.id === 'ct-001',
  }));

  const extras = EXTRA_CARETAKERS.map((profile, index) => {
    const template = templates[index % templates.length] || {};
    return buildExtraProfile(template, profile);
  });

  return [...normalizedInitial, ...extras];
};
