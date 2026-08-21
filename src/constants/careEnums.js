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
  INPATIENT_WATCH: 'inpatient_watch',
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

export const CARETAKER_REQUIREMENTS = Object.freeze({
  WHEELCHAIR_EXPERIENCE: 'wheelchair_experience',
  HOSPITAL_ESCORT: 'hospital_escort',
  MEDICATION_REMINDER: 'medication_reminder',
  VITAL_SIGNS: 'vital_signs',
  FIRST_AID: 'first_aid',
  GENTLE_TRANSFER: 'gentle_transfer',
  PATIENT_TEMPERAMENT: 'patient_temperament',
  CLEAR_SPEECH: 'clear_speech',
  THAI_LANGUAGE: 'thai_language',
  ISAN_LANGUAGE: 'isan_language',
  NORTHERN_LANGUAGE: 'northern_language',
  SOUTHERN_LANGUAGE: 'southern_language',
  ENGLISH_LANGUAGE: 'english_language',
  NON_SMOKER: 'non_smoker',
  NO_STRONG_PERFUME: 'no_strong_perfume',
  CAN_LIFT_SUPPORT: 'can_lift_support',
  STAIR_ASSISTANCE: 'stair_assistance',
  CAR_AVAILABLE: 'car_available',
  LARGE_CAR: 'large_car',
  CAN_WAIT_LONG_QUEUE: 'can_wait_long_queue',
  DOCUMENT_HELP: 'document_help',
  PAYMENT_HELP: 'payment_help',
  FOOD_RESTRICTION_AWARE: 'food_restriction_aware',
  DIABETES_AWARE: 'diabetes_aware',
  BLOOD_PRESSURE_AWARE: 'blood_pressure_aware',
  DEMENTIA_AWARE: 'dementia_aware',
  FALL_RISK_AWARE: 'fall_risk_aware',
  QUIET_COMPANION: 'quiet_companion',
  PHOTO_UPDATE: 'photo_update',
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
    shortLabel: { th: 'วีลแชร์', en: 'Wheelchair' },
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
    shortDesc: { th: 'ช่วยคิวรับยา', en: 'Queue and meds' },
    helper: { th: 'ช่วยคิวรับยา', en: 'Queue and meds' },
    description: { th: 'นัดหมายแพทย์ รับยา ทำแผล ตรวจสุขภาพ', en: 'Doctor appointments, medication pickup, wound care, checkups' },
    icon: 'Stethoscope',
    tone: 'sky',
    defaultDurationHours: 4,
  },
  {
    id: APPOINTMENT_EVENTS.INPATIENT_WATCH,
    label: { th: 'เฝ้าไข้', en: 'Patient watch' },
    fullLabel: { th: 'เฝ้าไข้ / อยู่เป็นเพื่อนที่โรงพยาบาล', en: 'Patient watch / hospital companion' },
    shortDesc: { th: 'อยู่เป็นเพื่อน', en: 'Bedside companion' },
    helper: { th: 'อยู่เป็นเพื่อน', en: 'Bedside companion' },
    description: { th: 'อยู่เป็นเพื่อนผู้ป่วยที่โรงพยาบาล ช่วยดูแลพื้นฐาน และรายงานอาการให้ครอบครัว', en: 'Hospital bedside companion with basic care and family updates' },
    icon: 'HeartPulse',
    tone: 'rose',
    defaultDurationHours: 6,
  },
  {
    id: APPOINTMENT_EVENTS.TEMPLE,
    label: { th: 'ไหว้พระ', en: 'Temple' },
    fullLabel: { th: 'ไหว้พระ ทำบุญ วันพระ', en: 'Temple / merit making' },
    shortDesc: { th: 'พยุงเดินในวัด', en: 'Temple walking support' },
    helper: { th: 'พยุงเดินในวัด', en: 'Temple walking support' },
    description: { th: 'ไปวัด ไหว้พระ ทำบุญ ฟังธรรม', en: 'Temple visits, merit making, dharma listening' },
    icon: 'Landmark',
    tone: 'amber',
    defaultDurationHours: 3,
  },
  {
    id: APPOINTMENT_EVENTS.TOUR,
    label: { th: 'ซื้อของ', en: 'Shopping' },
    fullLabel: { th: 'ท่องเที่ยว ชมเมือง & ซื้อของ', en: 'City tour & shopping' },
    shortDesc: { th: 'ช่วยถือของ', en: 'Bag support' },
    helper: { th: 'ช่วยถือของ', en: 'Bag support' },
    description: { th: 'ซื้อของ ใช้ธุระ เดินในห้าง หรือชมสถานที่', en: 'Shopping, errands, mall walks, sightseeing' },
    icon: 'ShoppingBag',
    tone: 'teal',
    defaultDurationHours: 4,
  },
  {
    id: APPOINTMENT_EVENTS.PARK,
    label: { th: 'เดินสวน', en: 'Park walk' },
    fullLabel: { th: 'เดินเล่น สวนสาธารณะ & พักผ่อน', en: 'Park stroll & leisure' },
    shortDesc: { th: 'เดินเล่นปลอดภัย', en: 'Safe light walk' },
    helper: { th: 'เดินเล่นปลอดภัย', en: 'Safe light walk' },
    description: { th: 'เดินเล่น ออกกำลังกายเบาๆ รับอากาศ', en: 'Gentle walks, light exercise, fresh air' },
    icon: 'Trees',
    tone: 'emerald',
    defaultDurationHours: 2,
  },
  {
    id: APPOINTMENT_EVENTS.PHYSICAL_THERAPY,
    label: { th: 'กายภาพ', en: 'Therapy' },
    fullLabel: { th: 'กายภาพบำบัด / ฟื้นฟูการเดิน', en: 'Physical therapy / mobility rehab' },
    shortDesc: { th: 'พาไปฟื้นฟู', en: 'Therapy escort' },
    helper: { th: 'พาไปฟื้นฟู', en: 'Therapy escort' },
    description: { th: 'พาไปกายภาพบำบัดหรือทำกิจกรรมฟื้นฟูตามแผน', en: 'Escort to therapy or mobility rehab sessions' },
    icon: 'Activity',
    tone: 'emerald',
    defaultDurationHours: 2,
  },
  {
    id: APPOINTMENT_EVENTS.PHARMACY,
    label: { th: 'รับยา', en: 'Pharmacy' },
    fullLabel: { th: 'รับยา / ปรึกษาเภสัชกร', en: 'Pharmacy pickup / pharmacist consult' },
    shortDesc: { th: 'เช็กรายการยา', en: 'Medication check' },
    helper: { th: 'เช็กรายการยา', en: 'Medication check' },
    description: { th: 'รับยา ตรวจรายการยา และรายงานผู้ปกครอง', en: 'Medication pickup, checklist, guardian update' },
    icon: 'Pill',
    tone: 'rose',
    defaultDurationHours: 2,
  },
  {
    id: APPOINTMENT_EVENTS.SHOPPING,
    label: { th: 'ซื้อของใช้', en: 'Errands' },
    fullLabel: { th: 'ซื้อของใช้ประจำวัน / ทำธุระ', en: 'Daily shopping / errands' },
    shortDesc: { th: 'ซื้อของจำเป็น', en: 'Daily errands' },
    helper: { th: 'ซื้อของจำเป็น', en: 'Daily errands' },
    description: { th: 'ช่วยซื้อของ ใช้ธุระ และดูแลระหว่างเดินทาง', en: 'Daily errands and safe outing support' },
    icon: 'ShoppingBag',
    tone: 'teal',
    defaultDurationHours: 3,
  },
  {
    id: APPOINTMENT_EVENTS.BANK,
    label: { th: 'ธนาคาร', en: 'Bank' },
    fullLabel: { th: 'ทำธุรกรรมธนาคาร', en: 'Bank appointment' },
    shortDesc: { th: 'คิวและเอกสาร', en: 'Queue and papers' },
    helper: { th: 'คิวและเอกสาร', en: 'Queue and papers' },
    description: { th: 'พาไปธนาคาร ช่วยจัดเอกสาร และรอคิว', en: 'Bank escort, document help, queue support' },
    icon: 'Building2',
    tone: 'slate',
    defaultDurationHours: 2,
  },
  {
    id: APPOINTMENT_EVENTS.GOVERNMENT_OFFICE,
    label: { th: 'ราชการ', en: 'Government' },
    fullLabel: { th: 'ติดต่อหน่วยงานราชการ', en: 'Government office visit' },
    shortDesc: { th: 'ช่วยเอกสาร', en: 'Form support' },
    helper: { th: 'ช่วยเอกสาร', en: 'Form support' },
    description: { th: 'พาไปติดต่อราชการและช่วยจัดลำดับขั้นตอน', en: 'Government office escort and process support' },
    icon: 'ClipboardList',
    tone: 'sky',
    defaultDurationHours: 3,
  },
  {
    id: APPOINTMENT_EVENTS.FAMILY_EVENT,
    label: { th: 'งานครอบครัว', en: 'Family event' },
    fullLabel: { th: 'งานครอบครัว / งานสังคม', en: 'Family / social event' },
    shortDesc: { th: 'ดูแลในงาน', en: 'Event support' },
    helper: { th: 'ดูแลในงาน', en: 'Event support' },
    description: { th: 'พาไปร่วมงานครอบครัว งานเลี้ยง หรืองานสังคม', en: 'Escort to family gatherings or social events' },
    icon: 'Users',
    tone: 'rose',
    defaultDurationHours: 4,
  },
  {
    id: APPOINTMENT_EVENTS.DINING,
    label: { th: 'ทานข้าว', en: 'Dining' },
    fullLabel: { th: 'ร้านอาหาร / คาเฟ่', en: 'Restaurant / cafe' },
    shortDesc: { th: 'ดูแลมื้ออาหาร', en: 'Meal support' },
    helper: { th: 'ดูแลมื้ออาหาร', en: 'Meal support' },
    description: { th: 'ดูแลเรื่องอาหาร การเดินทาง และยาหลังอาหาร', en: 'Meal, transport, and post-meal medication support' },
    icon: 'Coffee',
    tone: 'amber',
    defaultDurationHours: 2,
  },
  {
    id: APPOINTMENT_EVENTS.HOME_VISIT,
    label: { th: 'เยี่ยมบ้าน', en: 'Home visit' },
    fullLabel: { th: 'เยี่ยมญาติ / เยี่ยมบ้าน', en: 'Home / family visit' },
    shortDesc: { th: 'เยี่ยมญาติ', en: 'Family visit' },
    helper: { th: 'เยี่ยมญาติ', en: 'Family visit' },
    description: { th: 'พาไปเยี่ยมญาติหรือสถานที่คุ้นเคย พร้อมดูแลการเดินทาง', en: 'Safe escort to family or familiar places' },
    icon: 'Home',
    tone: 'emerald',
    defaultDurationHours: 3,
  },
]);

export const caretakerRequirementOptions = Object.freeze([
  { id: CARETAKER_REQUIREMENTS.WHEELCHAIR_EXPERIENCE, label: { th: 'ชำนาญวีลแชร์', en: 'Wheelchair experience' }, shortLabel: { th: 'วีลแชร์', en: 'Wheelchair' } },
  { id: CARETAKER_REQUIREMENTS.HOSPITAL_ESCORT, label: { th: 'คุ้นเคยโรงพยาบาล', en: 'Hospital escort' }, shortLabel: { th: 'โรงพยาบาล', en: 'Hospital' } },
  { id: CARETAKER_REQUIREMENTS.MEDICATION_REMINDER, label: { th: 'ช่วยเตือนยา', en: 'Medication reminder' }, shortLabel: { th: 'เตือนยา', en: 'Meds' } },
  { id: CARETAKER_REQUIREMENTS.VITAL_SIGNS, label: { th: 'วัดความดัน/ชีพจรได้', en: 'Can check vitals' }, shortLabel: { th: 'วัดชีพจร', en: 'Vitals' } },
  { id: CARETAKER_REQUIREMENTS.FIRST_AID, label: { th: 'ผ่านปฐมพยาบาล', en: 'First-aid trained' }, shortLabel: { th: 'ปฐมพยาบาล', en: 'First aid' } },
  { id: CARETAKER_REQUIREMENTS.GENTLE_TRANSFER, label: { th: 'ช่วยลุกนั่งนุ่มนวล', en: 'Gentle transfer support' }, shortLabel: { th: 'ช่วยลุกนั่ง', en: 'Transfer' } },
  { id: CARETAKER_REQUIREMENTS.PATIENT_TEMPERAMENT, label: { th: 'ใจเย็นมาก', en: 'Very patient' }, shortLabel: { th: 'ใจเย็น', en: 'Patient' } },
  { id: CARETAKER_REQUIREMENTS.CLEAR_SPEECH, label: { th: 'พูดชัด อธิบายเก่ง', en: 'Clear communicator' }, shortLabel: { th: 'พูดชัด', en: 'Clear' } },
  { id: CARETAKER_REQUIREMENTS.THAI_LANGUAGE, label: { th: 'พูดไทยกลางชัด', en: 'Central Thai speaker' }, shortLabel: { th: 'ไทยกลาง', en: 'Central Thai' } },
  { id: CARETAKER_REQUIREMENTS.ISAN_LANGUAGE, label: { th: 'พูดอีสานได้', en: 'Isan speaker' }, shortLabel: { th: 'อีสาน', en: 'Isan' } },
  { id: CARETAKER_REQUIREMENTS.NORTHERN_LANGUAGE, label: { th: 'พูดเหนือได้', en: 'Northern Thai speaker' }, shortLabel: { th: 'เหนือ', en: 'Northern' } },
  { id: CARETAKER_REQUIREMENTS.SOUTHERN_LANGUAGE, label: { th: 'พูดใต้ได้', en: 'Southern Thai speaker' }, shortLabel: { th: 'ใต้', en: 'Southern' } },
  { id: CARETAKER_REQUIREMENTS.ENGLISH_LANGUAGE, label: { th: 'สื่อสารอังกฤษได้', en: 'English speaker' }, shortLabel: { th: 'อังกฤษ', en: 'English' } },
  { id: CARETAKER_REQUIREMENTS.NON_SMOKER, label: { th: 'ไม่สูบบุหรี่', en: 'Non-smoker' }, shortLabel: { th: 'ไม่สูบบุหรี่', en: 'Non-smoker' } },
  { id: CARETAKER_REQUIREMENTS.NO_STRONG_PERFUME, label: { th: 'หลีกเลี่ยงน้ำหอมแรง', en: 'Avoid strong perfume' }, shortLabel: { th: 'ไม่ฉุนน้ำหอม', en: 'No perfume' } },
  { id: CARETAKER_REQUIREMENTS.CAN_LIFT_SUPPORT, label: { th: 'ช่วยพยุงน้ำหนักได้', en: 'Can support body weight' }, shortLabel: { th: 'พยุงได้', en: 'Lift support' } },
  { id: CARETAKER_REQUIREMENTS.STAIR_ASSISTANCE, label: { th: 'ช่วยขึ้นลงบันได', en: 'Stair assistance' }, shortLabel: { th: 'บันได', en: 'Stairs' } },
  { id: CARETAKER_REQUIREMENTS.CAR_AVAILABLE, label: { th: 'มีรถรับส่ง', en: 'Has car' }, shortLabel: { th: 'มีรถ', en: 'Car' } },
  { id: CARETAKER_REQUIREMENTS.LARGE_CAR, label: { th: 'รถใส่วีลแชร์ได้', en: 'Wheelchair-friendly car' }, shortLabel: { th: 'รถใส่วีลแชร์', en: 'Large car' } },
  { id: CARETAKER_REQUIREMENTS.CAN_WAIT_LONG_QUEUE, label: { th: 'รอคิวนานได้', en: 'Can wait long queues' }, shortLabel: { th: 'รอคิว', en: 'Queue' } },
  { id: CARETAKER_REQUIREMENTS.DOCUMENT_HELP, label: { th: 'ช่วยเอกสารได้', en: 'Document assistance' }, shortLabel: { th: 'เอกสาร', en: 'Docs' } },
  { id: CARETAKER_REQUIREMENTS.PAYMENT_HELP, label: { th: 'ช่วยจ่ายเงิน/รับใบเสร็จ', en: 'Payment help' }, shortLabel: { th: 'จ่ายเงิน', en: 'Payment' } },
  { id: CARETAKER_REQUIREMENTS.FOOD_RESTRICTION_AWARE, label: { th: 'เข้าใจข้อจำกัดอาหาร', en: 'Diet restriction aware' }, shortLabel: { th: 'คุมอาหาร', en: 'Diet' } },
  { id: CARETAKER_REQUIREMENTS.DIABETES_AWARE, label: { th: 'เข้าใจเบาหวาน', en: 'Diabetes aware' }, shortLabel: { th: 'เบาหวาน', en: 'Diabetes' } },
  { id: CARETAKER_REQUIREMENTS.BLOOD_PRESSURE_AWARE, label: { th: 'เข้าใจความดัน', en: 'Blood pressure aware' }, shortLabel: { th: 'ความดัน', en: 'BP' } },
  { id: CARETAKER_REQUIREMENTS.DEMENTIA_AWARE, label: { th: 'เข้าใจภาวะหลงลืม', en: 'Dementia aware' }, shortLabel: { th: 'หลงลืม', en: 'Dementia' } },
  { id: CARETAKER_REQUIREMENTS.FALL_RISK_AWARE, label: { th: 'ระวังเสี่ยงล้ม', en: 'Fall-risk aware' }, shortLabel: { th: 'กันล้ม', en: 'Fall risk' } },
  { id: CARETAKER_REQUIREMENTS.QUIET_COMPANION, label: { th: 'ไม่ชวนคุยมาก', en: 'Quiet companion' }, shortLabel: { th: 'เงียบสุภาพ', en: 'Quiet' } },
  { id: CARETAKER_REQUIREMENTS.PHOTO_UPDATE, label: { th: 'ส่งรูปอัปเดตให้ลูกหลาน', en: 'Photo updates' }, shortLabel: { th: 'ส่งรูป', en: 'Photos' } },
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
export const caretakerRequirementById = toLookup(caretakerRequirementOptions);

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

export const getCaretakerRequirementMeta = (id) => caretakerRequirementById[id] || null;

export const getAppointmentEventMeta = (id) =>
  appointmentEventById[id] || appointmentEventById[APPOINTMENT_EVENTS.CUSTOM] || {
    id: APPOINTMENT_EVENTS.CUSTOM,
    label: { th: 'กิจกรรมอื่น', en: 'Other activity' },
    fullLabel: { th: 'กิจกรรมอื่น', en: 'Other activity' },
    shortDesc: { th: 'ระบุรายละเอียดเอง', en: 'Custom details' },
    helper: { th: 'ระบุรายละเอียดเอง', en: 'Custom details' },
    description: { th: 'กิจกรรมตามที่นัดหมาย', en: 'Custom appointment activity' },
    icon: 'HeartPulse',
    tone: 'slate',
    defaultDurationHours: 3,
  };

export const getAppointmentEventLabel = (id, language = 'th', key = 'label') =>
  getEnumLabel(getAppointmentEventMeta(id), language, key);
