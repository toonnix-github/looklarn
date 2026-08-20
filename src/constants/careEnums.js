export const ELDER_MOBILITY = Object.freeze({
  INDEPENDENT: 'independent',
  CANE: 'cane',
  WALKER: 'walker',
  ASSISTED_WALKING: 'assisted_walking',
  WHEELCHAIR_ASSISTED: 'wheelchair_assisted',
  BED_BOUND: 'bed_bound',
  FULL_ASSISTANCE: 'full_assistance',
});

export const MOBILITY_AIDS = Object.freeze({
  WHEELCHAIR: 'wheelchair',
  CANE: 'cane',
  QUAD_CANE: 'quad_cane',
  WALKER: 'walker',
  HEARING_AID: 'hearing_aid',
  GLASSES: 'glasses',
  NONE: 'none',
});

export const MEDICAL_CONDITIONS = Object.freeze({
  HYPERTENSION: 'hypertension',
  HYPOTENSION: 'hypotension',
  DIABETES_TYPE_2: 'diabetes_type_2',
  KNEE_OSTEOARTHRITIS: 'knee_osteoarthritis',
  HEART_DISEASE: 'heart_disease',
  STROKE_HISTORY: 'stroke_history',
  DEMENTIA: 'dementia',
  ASTHMA: 'asthma',
  KIDNEY_DISEASE: 'kidney_disease',
  DYSLIPIDEMIA: 'dyslipidemia',
  EYE_CATARACT: 'eye_cataract',
  ALLERGY: 'allergy',
});

export const APPOINTMENT_EVENTS = Object.freeze({
  HOSPITAL: 'hospital',
  TEMPLE: 'temple',
  TOUR: 'tour',
  PARK: 'park',
  PHYSICAL_THERAPY: 'physical_therapy',
  PHARMACY: 'pharmacy',
  SHOPPING: 'shopping',
  BANK: 'bank',
  GOVERNMENT_OFFICE: 'government_office',
  FAMILY_EVENT: 'family_event',
  DINING: 'dining',
  HOME_VISIT: 'home_visit',
  CUSTOM: 'custom',
});

export const elderMobilityOptions = Object.freeze([
  {
    id: ELDER_MOBILITY.INDEPENDENT,
    label: { th: 'เดินได้ปกติ / คล่องแคล่ว (Independent)', en: 'Independent walking' },
    shortLabel: { th: 'เดินเองได้', en: 'Independent' },
    description: {
      th: 'สามารถเดินและขึ้นลงบันไดได้เองอย่างมั่นคง ไม่ต้องใช้อุปกรณ์ช่วย',
      en: 'Can walk and use stairs steadily without mobility aids.',
    },
  },
  {
    id: ELDER_MOBILITY.CANE,
    label: { th: 'ใช้ไม้เท้า / พยุงเดิน (Cane Assisted)', en: 'Cane assisted' },
    shortLabel: { th: 'ใช้ไม้เท้า', en: 'Cane' },
    description: {
      th: 'เดินได้ด้วยตัวเองแต่ต้องการไม้เท้าช่วยทรงตัว หรือมีคนช่วยพยุงแขน',
      en: 'Can walk with a cane or light arm support.',
    },
  },
  {
    id: ELDER_MOBILITY.WALKER,
    label: { th: 'ใช้วอล์คเกอร์ช่วยเดิน (Walker)', en: 'Walker assisted' },
    shortLabel: { th: 'ใช้วอล์คเกอร์', en: 'Walker' },
    description: {
      th: 'ต้องใช้อุปกรณ์ช่วยเดินเพื่อพยุงตัวและรักษาสมดุล',
      en: 'Uses a walker for balance and safer movement.',
    },
  },
  {
    id: ELDER_MOBILITY.ASSISTED_WALKING,
    label: { th: 'ต้องมีคนช่วยพยุงเดิน (Assisted Walking)', en: 'Assisted walking' },
    shortLabel: { th: 'พยุงเดิน', en: 'Assisted' },
    description: {
      th: 'เดินระยะสั้นได้ แต่ควรมีผู้ดูแลประกบและช่วยพยุง',
      en: 'Can walk short distances with close support.',
    },
  },
  {
    id: ELDER_MOBILITY.WHEELCHAIR_ASSISTED,
    label: { th: 'ใช้วีลแชร์เมื่อเดินทางไกล (Wheelchair Assisted)', en: 'Wheelchair assisted' },
    shortLabel: { th: 'วีลแชร์ไกล', en: 'Wheelchair' },
    description: {
      th: 'เดินระยะสั้นได้ แต่ต้องใช้วีลแชร์เมื่อไปโรงพยาบาลหรือเดินทางไกล',
      en: 'Can walk short distances but needs a wheelchair for long outings.',
    },
  },
  {
    id: ELDER_MOBILITY.BED_BOUND,
    label: { th: 'ติดเตียง / เคลื่อนย้ายยาก (Bed Bound)', en: 'Bed bound' },
    shortLabel: { th: 'ติดเตียง', en: 'Bed bound' },
    description: {
      th: 'ต้องวางแผนการเคลื่อนย้ายตัวและรถรับส่งเป็นพิเศษ',
      en: 'Requires special transfer and transport planning.',
    },
  },
  {
    id: ELDER_MOBILITY.FULL_ASSISTANCE,
    label: { th: 'ต้องการผู้ช่วยพยุงตลอดเวลา (Full Assistance)', en: 'Full assistance' },
    shortLabel: { th: 'ดูแลใกล้ชิด', en: 'Full assist' },
    description: {
      th: 'ต้องการผู้ดูแลประกบดูแลการเคลื่อนย้ายตัวและเข็นวีลแชร์ตลอดเวลา',
      en: 'Needs close caretaker support for transfers and wheelchair movement.',
    },
  },
]);

export const mobilityAidOptions = Object.freeze([
  { id: MOBILITY_AIDS.WHEELCHAIR, label: { th: 'รถเข็นวีลแชร์พับได้', en: 'Foldable wheelchair' }, shortLabel: { th: 'วีลแชร์', en: 'Wheelchair' } },
  { id: MOBILITY_AIDS.CANE, label: { th: 'ไม้เท้าช่วยพยุง', en: 'Walking cane' }, shortLabel: { th: 'ไม้เท้า', en: 'Cane' } },
  { id: MOBILITY_AIDS.QUAD_CANE, label: { th: 'ไม้เท้า 4 ขา', en: 'Quad cane' }, shortLabel: { th: 'ไม้เท้า 4 ขา', en: 'Quad cane' } },
  { id: MOBILITY_AIDS.WALKER, label: { th: 'วอล์คเกอร์หัดเดิน', en: 'Walker frame' }, shortLabel: { th: 'วอล์คเกอร์', en: 'Walker' } },
  { id: MOBILITY_AIDS.HEARING_AID, label: { th: 'เครื่องช่วยฟัง', en: 'Hearing aid' }, shortLabel: { th: 'ช่วยฟัง', en: 'Hearing' } },
  { id: MOBILITY_AIDS.GLASSES, label: { th: 'แว่นตา', en: 'Glasses' }, shortLabel: { th: 'แว่นตา', en: 'Glasses' } },
]);

export const medicalConditionOptions = Object.freeze([
  { id: MEDICAL_CONDITIONS.HYPERTENSION, label: { th: 'ความดันโลหิตสูง', en: 'Hypertension' }, shortLabel: { th: 'ความดันสูง', en: 'High BP' } },
  { id: MEDICAL_CONDITIONS.HYPOTENSION, label: { th: 'ความดันโลหิตต่ำ', en: 'Hypotension' }, shortLabel: { th: 'ความดันต่ำ', en: 'Low BP' } },
  { id: MEDICAL_CONDITIONS.DIABETES_TYPE_2, label: { th: 'เบาหวานชนิดที่ 2', en: 'Type 2 diabetes' }, shortLabel: { th: 'เบาหวาน', en: 'Diabetes' } },
  { id: MEDICAL_CONDITIONS.KNEE_OSTEOARTHRITIS, label: { th: 'ข้อเข่าเสื่อม / ปวดข้อ', en: 'Knee osteoarthritis' }, shortLabel: { th: 'ข้อเข่า', en: 'Knee' } },
  { id: MEDICAL_CONDITIONS.HEART_DISEASE, label: { th: 'โรคหัวใจ', en: 'Heart disease' }, shortLabel: { th: 'หัวใจ', en: 'Heart' } },
  { id: MEDICAL_CONDITIONS.STROKE_HISTORY, label: { th: 'ประวัติโรคหลอดเลือดสมอง', en: 'Stroke history' }, shortLabel: { th: 'เส้นเลือดสมอง', en: 'Stroke' } },
  { id: MEDICAL_CONDITIONS.DEMENTIA, label: { th: 'ภาวะสมองเสื่อม / อัลไซเมอร์', en: 'Dementia / Alzheimer' }, shortLabel: { th: 'สมองเสื่อม', en: 'Dementia' } },
  { id: MEDICAL_CONDITIONS.ASTHMA, label: { th: 'หอบหืด / โรคทางเดินหายใจ', en: 'Asthma / respiratory condition' }, shortLabel: { th: 'หอบหืด', en: 'Asthma' } },
  { id: MEDICAL_CONDITIONS.KIDNEY_DISEASE, label: { th: 'โรคไตเรื้อรัง', en: 'Chronic kidney disease' }, shortLabel: { th: 'โรคไต', en: 'Kidney' } },
  { id: MEDICAL_CONDITIONS.DYSLIPIDEMIA, label: { th: 'ไขมันในเลือดสูง', en: 'Dyslipidemia' }, shortLabel: { th: 'ไขมันสูง', en: 'Lipids' } },
  { id: MEDICAL_CONDITIONS.EYE_CATARACT, label: { th: 'ต้อกระจก / ปัญหาการมองเห็น', en: 'Cataract / visual impairment' }, shortLabel: { th: 'สายตา', en: 'Vision' } },
  { id: MEDICAL_CONDITIONS.ALLERGY, label: { th: 'ประวัติแพ้ยา / แพ้อาหาร', en: 'Medication / food allergy' }, shortLabel: { th: 'ภูมิแพ้', en: 'Allergy' } },
]);

export const appointmentEventOptions = Object.freeze([
  {
    id: APPOINTMENT_EVENTS.HOSPITAL,
    label: { th: 'พบแพทย์', en: 'Doctor visit' },
    fullLabel: { th: 'พาไปโรงพยาบาล / พบแพทย์', en: 'Hospital / doctor visit' },
    helper: { th: 'คิว ยา รถเข็น', en: 'Queue, meds, wheelchair' },
    description: { th: 'นัดหมายแพทย์ รับยา ทำแผล ตรวจสุขภาพ', en: 'Doctor appointments, medication pickup, wound care, checkups' },
    icon: 'Stethoscope',
    tone: 'sky',
    defaultDurationHours: 4,
  },
  {
    id: APPOINTMENT_EVENTS.TEMPLE,
    label: { th: 'ไหว้พระ', en: 'Temple' },
    fullLabel: { th: 'ไหว้พระ ทำบุญ วันพระ', en: 'Temple / merit making' },
    helper: { th: 'ร่ม น้ำ พยุง', en: 'Shade, water, support' },
    description: { th: 'ไปวัด ไหว้พระ ทำบุญ ฟังธรรม', en: 'Temple visits, merit making, dharma listening' },
    icon: 'Landmark',
    tone: 'amber',
    defaultDurationHours: 3,
  },
  {
    id: APPOINTMENT_EVENTS.TOUR,
    label: { th: 'ซื้อของ', en: 'Shopping' },
    fullLabel: { th: 'ท่องเที่ยว ชมเมือง & ซื้อของ', en: 'City tour & shopping' },
    helper: { th: 'ห้าง ถือของ', en: 'Mall, bags' },
    description: { th: 'ซื้อของ ใช้ธุระ เดินในห้าง หรือชมสถานที่', en: 'Shopping, errands, mall walks, sightseeing' },
    icon: 'ShoppingBag',
    tone: 'teal',
    defaultDurationHours: 4,
  },
  {
    id: APPOINTMENT_EVENTS.PARK,
    label: { th: 'เดินสวน', en: 'Park walk' },
    fullLabel: { th: 'เดินเล่น สวนสาธารณะ & พักผ่อน', en: 'Park stroll & leisure' },
    helper: { th: 'ลมเช้า กายภาพ', en: 'Fresh air, mobility' },
    description: { th: 'เดินเล่น ออกกำลังกายเบาๆ รับอากาศ', en: 'Gentle walks, light exercise, fresh air' },
    icon: 'Trees',
    tone: 'emerald',
    defaultDurationHours: 2,
  },
  {
    id: APPOINTMENT_EVENTS.PHYSICAL_THERAPY,
    label: { th: 'กายภาพ', en: 'Therapy' },
    fullLabel: { th: 'กายภาพบำบัด / ฟื้นฟูการเดิน', en: 'Physical therapy / mobility rehab' },
    helper: { th: 'ฝึกเดิน ยืดกล้าม', en: 'Gait, stretch' },
    description: { th: 'พาไปกายภาพบำบัดหรือทำกิจกรรมฟื้นฟูตามแผน', en: 'Escort to therapy or mobility rehab sessions' },
    icon: 'Activity',
    tone: 'emerald',
    defaultDurationHours: 2,
  },
  {
    id: APPOINTMENT_EVENTS.PHARMACY,
    label: { th: 'รับยา', en: 'Pharmacy' },
    fullLabel: { th: 'รับยา / ปรึกษาเภสัชกร', en: 'Pharmacy pickup / pharmacist consult' },
    helper: { th: 'เช็คยา แจ้งลูก', en: 'Meds, updates' },
    description: { th: 'รับยา ตรวจรายการยา และรายงานผู้ปกครอง', en: 'Medication pickup, checklist, guardian update' },
    icon: 'Pill',
    tone: 'rose',
    defaultDurationHours: 2,
  },
  {
    id: APPOINTMENT_EVENTS.SHOPPING,
    label: { th: 'ซื้อของใช้', en: 'Errands' },
    fullLabel: { th: 'ซื้อของใช้ประจำวัน / ทำธุระ', en: 'Daily shopping / errands' },
    helper: { th: 'ถือของ จ่ายเงิน', en: 'Bags, payment' },
    description: { th: 'ช่วยซื้อของ ใช้ธุระ และดูแลระหว่างเดินทาง', en: 'Daily errands and safe outing support' },
    icon: 'ShoppingBag',
    tone: 'teal',
    defaultDurationHours: 3,
  },
  {
    id: APPOINTMENT_EVENTS.BANK,
    label: { th: 'ธนาคาร', en: 'Bank' },
    fullLabel: { th: 'ทำธุรกรรมธนาคาร', en: 'Bank appointment' },
    helper: { th: 'คิว เอกสาร', en: 'Queue, papers' },
    description: { th: 'พาไปธนาคาร ช่วยจัดเอกสาร และรอคิว', en: 'Bank escort, document help, queue support' },
    icon: 'Building2',
    tone: 'slate',
    defaultDurationHours: 2,
  },
  {
    id: APPOINTMENT_EVENTS.GOVERNMENT_OFFICE,
    label: { th: 'ราชการ', en: 'Government' },
    fullLabel: { th: 'ติดต่อหน่วยงานราชการ', en: 'Government office visit' },
    helper: { th: 'เอกสาร คิว', en: 'Forms, queue' },
    description: { th: 'พาไปติดต่อราชการและช่วยจัดลำดับขั้นตอน', en: 'Government office escort and process support' },
    icon: 'ClipboardList',
    tone: 'sky',
    defaultDurationHours: 3,
  },
  {
    id: APPOINTMENT_EVENTS.FAMILY_EVENT,
    label: { th: 'งานครอบครัว', en: 'Family event' },
    fullLabel: { th: 'งานครอบครัว / งานสังคม', en: 'Family / social event' },
    helper: { th: 'ดูแลใกล้ชิด', en: 'Close support' },
    description: { th: 'พาไปร่วมงานครอบครัว งานเลี้ยง หรืองานสังคม', en: 'Escort to family gatherings or social events' },
    icon: 'Users',
    tone: 'rose',
    defaultDurationHours: 4,
  },
  {
    id: APPOINTMENT_EVENTS.DINING,
    label: { th: 'ทานข้าว', en: 'Dining' },
    fullLabel: { th: 'ร้านอาหาร / คาเฟ่', en: 'Restaurant / cafe' },
    helper: { th: 'อาหาร ยา', en: 'Meal, meds' },
    description: { th: 'ดูแลเรื่องอาหาร การเดินทาง และยาหลังอาหาร', en: 'Meal, transport, and post-meal medication support' },
    icon: 'Coffee',
    tone: 'amber',
    defaultDurationHours: 2,
  },
  {
    id: APPOINTMENT_EVENTS.HOME_VISIT,
    label: { th: 'เยี่ยมบ้าน', en: 'Home visit' },
    fullLabel: { th: 'เยี่ยมญาติ / เยี่ยมบ้าน', en: 'Home / family visit' },
    helper: { th: 'รับส่ง ปลอดภัย', en: 'Pickup, safe' },
    description: { th: 'พาไปเยี่ยมญาติหรือสถานที่คุ้นเคย พร้อมดูแลการเดินทาง', en: 'Safe escort to family or familiar places' },
    icon: 'Home',
    tone: 'emerald',
    defaultDurationHours: 3,
  },
]);

const toLookup = (options) =>
  Object.freeze(
    options.reduce((lookup, option) => {
      lookup[option.id] = option;
      return lookup;
    }, {})
  );

export const elderMobilityById = toLookup(elderMobilityOptions);
export const mobilityAidById = toLookup(mobilityAidOptions);
export const medicalConditionById = toLookup(medicalConditionOptions);
export const appointmentEventById = toLookup(appointmentEventOptions);

export const getLocalizedEnumValue = (value, language = 'th') => {
  if (!value) return '';
  if (typeof value === 'string') return value;
  return value[language] || value.th || value.en || '';
};

export const getEnumLabel = (item, language = 'th', key = 'label') =>
  getLocalizedEnumValue(item?.[key], language);

export const getElderMobilityMeta = (id) =>
  elderMobilityById[id] || elderMobilityById[ELDER_MOBILITY.WHEELCHAIR_ASSISTED];

export const getMobilityAidMeta = (id) => mobilityAidById[id] || null;

export const getMedicalConditionMeta = (id) => medicalConditionById[id] || null;

export const getAppointmentEventMeta = (id) =>
  appointmentEventById[id] || appointmentEventById[APPOINTMENT_EVENTS.CUSTOM] || {
    id: APPOINTMENT_EVENTS.CUSTOM,
    label: { th: 'กิจกรรมอื่น', en: 'Other activity' },
    fullLabel: { th: 'กิจกรรมอื่น', en: 'Other activity' },
    helper: { th: 'ระบุเอง', en: 'Custom' },
    description: { th: 'กิจกรรมตามที่นัดหมาย', en: 'Custom appointment activity' },
    icon: 'HeartPulse',
    tone: 'slate',
    defaultDurationHours: 3,
  };

export const getAppointmentEventLabel = (id, language = 'th', key = 'label') =>
  getEnumLabel(getAppointmentEventMeta(id), language, key);
