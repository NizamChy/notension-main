// Demo data for the HEALTH_CARE backend (doctors, consultation centers,
// hospitals, diagnostic / eye / dental centers). The routes are in
// ../healthCare.js; apps/api seeds its database from this file.
//
// Image fields hold a path under public/demo/. Components build image URLs
// as `${HEALTH_CARE_IMAGES}/${file}`, and the /demo-images rewrite drops the
// "medical-service-provider-images" segment, so "health-care/x.webp" resolves
// to public/demo/health-care/x.webp.

import { DEMO_LOCATIONS } from "../../demoLocations";

const IMG = (file) => `health-care/${file}`;

const [DHAKA, CHITTAGONG] = DEMO_LOCATIONS;
const DHAKA_ID = DHAKA.districtId;
const CTG_ID = CHITTAGONG.districtId;

// 24-char lowercase hex ids: "6650" + 2-char kind + 18-digit number.
export const oid = (kind, n) => `6650${kind}${String(n).padStart(18, "0")}`;

// ---------------------------------------------------------------------------
// Banners
// ---------------------------------------------------------------------------

const banner = (n, file, title) => ({
  _id: oid("ba", n),
  file_name: IMG(file),
  title,
});

// Find doctor page: the first 3 are the slider, the last 2 the nav tiles
// (nearest doctor, consultation center). The nav tiles are illustrations with
// their label drawn in, because the tile shows nothing but the image.
export const FIND_DOCTOR_BANNER = [
  banner(1, "banner-find-doctor-1.webp", "Find the right doctor"),
  banner(2, "banner-find-doctor-2.webp", "Book a serial online"),
  banner(3, "banner-find-doctor-3.webp", "Specialists near you"),
  banner(4, "nav-nearest-doctor.svg", "Nearest doctor"),
  banner(5, "nav-consultation-center.svg", "Consultation center"),
];

// The slider shows all but the last one.
export const CONSULTATION_CENTER_BANNER = [
  banner(11, "banner-consultation-1.webp", "Consultation centers"),
  banner(12, "banner-consultation-2.webp", "Doctors by center"),
  banner(13, "banner-consultation-3.webp", "Consultation centers"),
];

export const NEAREST_DOCTOR_BANNER = [
  banner(21, "banner-nearest-doctor-1.webp", "Doctors near you"),
  banner(22, "banner-nearest-doctor-2.webp", "Evening chambers"),
];

export const CENTER_TYPE_BANNERS = {
  hospital_banner: [
    banner(31, "banner-hospital-1.webp", "Hospitals"),
    banner(32, "banner-hospital-2.webp", "24/7 emergency"),
    banner(33, "banner-hospital-1.webp", "Hospitals"),
  ],
  diagnostic_center_banner: [
    banner(41, "banner-diagnostic-1.webp", "Diagnostic centers"),
    banner(42, "banner-diagnostic-2.webp", "Lab tests and imaging"),
    banner(43, "banner-diagnostic-1.webp", "Diagnostic centers"),
  ],
  eye_care_center_banner: [
    banner(51, "banner-eye-1.webp", "Eye care centers"),
    banner(52, "banner-eye-2.webp", "Eye check-up"),
    banner(53, "banner-eye-1.webp", "Eye care centers"),
  ],
  deltal_care_center_banner: [
    banner(61, "banner-dental-1.webp", "Dental care centers"),
    banner(62, "banner-dental-2.webp", "Healthy smiles"),
    banner(63, "banner-dental-1.webp", "Dental care centers"),
  ],
};

// Medical services home: the first 4 are the slider, the last 4 the tiles.
export const MEDICAL_SERVICE_BANNER = [
  banner(71, "banner-medical-1.webp", "Medical services"),
  banner(72, "banner-medical-2.webp", "Doctor appointments"),
  banner(73, "banner-medical-3.webp", "Hospitals and clinics"),
  banner(74, "banner-medical-4.webp", "Diagnostics"),
  banner(75, "tile-doctor.webp", "Find Doctor"),
  banner(76, "tile-hospital.webp", "Hospital"),
  banner(77, "tile-diagnostic.webp", "Diagnostic Center"),
  banner(78, "tile-eye-dental.webp", "Eye and Dental Care"),
];

// ---------------------------------------------------------------------------
// Departments
// ---------------------------------------------------------------------------

const dept = (n, dept_name, slug, dept_name_bn) => ({
  _id: oid("de", n),
  slug,
  dept_name,
  dept_name_bn,
  // Illustrated tiles with the department name drawn in (the grid shows only
  // the image, so a photo would hide which department it is).
  banner_1: IMG(`dept-${slug}-1.svg`),
  banner_2: IMG(`dept-${slug}-2.svg`),
  serial: n,
  is_active: true,
});

export const DEMO_DEPARTMENTS = [
  dept(1, "Medicine", "medicine", "মেডিসিন"),
  dept(2, "Cardiology", "cardiology", "হৃদরোগ"),
  dept(3, "Pediatrics", "pediatrics", "শিশু রোগ"),
  dept(4, "Gynecology & Obstetrics", "gynecology", "গাইনি ও প্রসূতি"),
  dept(5, "Orthopedics", "orthopedics", "হাড় ও জোড়া"),
  dept(6, "Dermatology", "dermatology", "চর্ম ও যৌন"),
  dept(7, "ENT", "ent", "নাক, কান ও গলা"),
  dept(8, "Eye", "eye", "চক্ষু"),
  dept(9, "Dental", "dental", "দন্ত"),
  dept(10, "Neurology", "neurology", "স্নায়ু রোগ"),
  dept(11, "Gastroenterology", "gastroenterology", "পরিপাকতন্ত্র"),
  dept(12, "Endocrinology", "endocrinology", "ডায়াবেটিস ও হরমোন"),
  dept(13, "Urology", "urology", "মূত্ররোগ"),
  dept(14, "Psychiatry", "psychiatry", "মানসিক রোগ"),
  dept(15, "Nephrology", "nephrology", "কিডনি রোগ"),
  dept(16, "Physical Medicine", "physical-medicine", "ফিজিক্যাল মেডিসিন"),
];

const DEPT = Object.fromEntries(
  DEMO_DEPARTMENTS.map((d) => [d.slug, d]),
);

// ---------------------------------------------------------------------------
// Centers (hospitals, diagnostic, eye, dental and consultation centers)
// ---------------------------------------------------------------------------

const center = (n, districtId, center_type, center_name, slug, rest) => ({
  _id: oid("ce", n),
  center_name,
  center_type,
  district_id: districtId,
  medical_center_banner_app: IMG(`center-${slug}.webp`),
  is_active: true,
  ...rest,
});

export const DEMO_CENTERS = [
  // Dhaka: hospitals
  center(1, DHAKA_ID, "Hospital", "Gulshan Medicare Hospital", "gulshan-medicare", {
    address: "Plot 12, Road 71, Gulshan 2, Dhaka 1212",
    latitude: 23.7948,
    longitude: 90.4143,
    apointment_contact_1: "01711-450201",
    apointment_contact_2: "09610-450201",
  }),
  center(2, DHAKA_ID, "Hospital", "Dhaka Central Hospital", "dhaka-central", {
    address: "House 2, Green Road, Panthapath, Dhaka 1205",
    latitude: 23.7515,
    longitude: 90.387,
    apointment_contact_1: "01819-223344",
    apointment_contact_2: "02-9661551",
  }),
  center(3, DHAKA_ID, "Hospital", "Banani Specialized Hospital", "banani-specialized", {
    address: "House 54, Road 11, Banani, Dhaka 1213",
    latitude: 23.7937,
    longitude: 90.404,
    apointment_contact_1: "01730-118899",
  }),
  center(4, DHAKA_ID, "Hospital", "Bashundhara General Hospital", "bashundhara-general", {
    address: "Plot 81, Block E, Bashundhara R/A, Dhaka 1229",
    latitude: 23.8135,
    longitude: 90.4255,
    apointment_contact_1: "01755-662211",
    apointment_contact_2: "09678-662211",
  }),
  // Dhaka: diagnostic centres
  center(5, DHAKA_ID, "Diagnostic Centre", "Medilab Diagnostic Centre", "medilab", {
    address: "House 48, Road 27 (Old), Dhanmondi, Dhaka 1209",
    latitude: 23.7561,
    longitude: 90.374,
    apointment_contact_1: "01913-552200",
  }),
  center(6, DHAKA_ID, "Diagnostic Centre", "Prime Diagnostic & Imaging", "prime-diagnostic", {
    address: "House 31, Kemal Ataturk Avenue, Banani, Dhaka 1213",
    latitude: 23.794,
    longitude: 90.4005,
    apointment_contact_1: "01672-301030",
    apointment_contact_2: "01672-301031",
  }),
  center(7, DHAKA_ID, "Diagnostic Centre", "CityScan Diagnostic", "cityscan", {
    address: "Plot 6, Section 10, Mirpur, Dhaka 1216",
    latitude: 23.8069,
    longitude: 90.3687,
    apointment_contact_1: "01798-404040",
  }),
  // Dhaka: consultation centers
  center(8, DHAKA_ID, "Consultation Center", "Gulshan Doctors' Chamber", "gulshan-chamber", {
    address: "Level 3, Gulshan Avenue, Gulshan 1, Dhaka 1212",
    latitude: 23.7806,
    longitude: 90.4163,
    apointment_contact_1: "01700-778899",
  }),
  center(9, DHAKA_ID, "Consultation Center", "Uttara Family Health Point", "uttara-health-point", {
    address: "House 9, Road 12, Sector 7, Uttara, Dhaka 1230",
    latitude: 23.871,
    longitude: 90.398,
    apointment_contact_1: "01844-120120",
  }),
  center(10, DHAKA_ID, "Consultation Center", "Mohakhali Consultation Centre", "mohakhali-consultation", {
    address: "Bir Uttam AK Khandakar Road, Mohakhali, Dhaka 1212",
    latitude: 23.7781,
    longitude: 90.4006,
    apointment_contact_1: "01977-505050",
  }),
  // Dhaka: eye care centres
  center(11, DHAKA_ID, "Eye Care Centre", "Vision Eye Hospital", "vision-eye", {
    address: "Plot 4, Indira Road, Farmgate, Dhaka 1215",
    latitude: 23.7577,
    longitude: 90.3897,
    apointment_contact_1: "01711-202030",
  }),
  center(12, DHAKA_ID, "Eye Care Centre", "ClearSight Eye Care", "clearsight-eye", {
    address: "House 15, Road 90, Gulshan 2, Dhaka 1212",
    latitude: 23.7965,
    longitude: 90.4152,
    apointment_contact_1: "01755-909090",
  }),
  // Dhaka: dental care centres
  center(13, DHAKA_ID, "Deltal Care Centre", "SmileCraft Dental", "smilecraft-dental", {
    address: "House 3, Road 132, Gulshan 1, Dhaka 1212",
    latitude: 23.781,
    longitude: 90.417,
    apointment_contact_1: "01611-333222",
  }),
  center(14, DHAKA_ID, "Deltal Care Centre", "Dhanmondi Dental Studio", "dhanmondi-dental", {
    address: "House 21, Road 8, Dhanmondi, Dhaka 1205",
    latitude: 23.7445,
    longitude: 90.3775,
    apointment_contact_1: "01521-445566",
  }),
  // Chittagong
  center(15, CTG_ID, "Hospital", "Agrabad General Hospital", "agrabad-general", {
    address: "1420 Sk. Mujib Road, Agrabad C/A, Chattogram 4100",
    latitude: 22.326,
    longitude: 91.811,
    apointment_contact_1: "01819-301301",
    apointment_contact_2: "031-2510101",
  }),
  center(16, CTG_ID, "Hospital", "Port City Medical Point", "port-city-medical", {
    address: "GEC Circle, O.R. Nizam Road, Chattogram 4000",
    latitude: 22.359,
    longitude: 91.8215,
    apointment_contact_1: "01730-454545",
  }),
  center(17, CTG_ID, "Diagnostic Centre", "Chattogram Diagnostic Centre", "ctg-diagnostic", {
    address: "Badamtali Circle, Agrabad, Chattogram 4100",
    latitude: 22.3285,
    longitude: 91.8135,
    apointment_contact_1: "01811-787878",
  }),
  center(18, CTG_ID, "Consultation Center", "Nasirabad Consultation Centre", "nasirabad-consultation", {
    address: "Plot 5, Nasirabad Housing Society, Chattogram 4209",
    latitude: 22.3665,
    longitude: 91.824,
    apointment_contact_1: "01686-252525",
  }),
  center(19, CTG_ID, "Eye Care Centre", "Chattogram Eye Care", "ctg-eye-care", {
    address: "Panchlaish R/A, Road 1, Chattogram 4203",
    latitude: 22.363,
    longitude: 91.831,
    apointment_contact_1: "01712-660066",
  }),
  center(20, CTG_ID, "Deltal Care Centre", "Khulshi Dental Care", "khulshi-dental", {
    address: "Road 2, Khulshi R/A, Chattogram 4225",
    latitude: 22.3615,
    longitude: 91.807,
    apointment_contact_1: "01555-121212",
  }),
];

const C = (n) => DEMO_CENTERS[n - 1];

// ---------------------------------------------------------------------------
// Doctors
// ---------------------------------------------------------------------------

const doctor = (n, districtId, d, info) => ({
  _id: oid("d0", n),
  district_id: districtId,
  department: d._id,
  dept_name: d.dept_name,
  speciality: `${d.dept_name} Specialist`,
  is_active: true,
  ...info,
});

export const DEMO_DOCTORS = [
  doctor(1, DHAKA_ID, DEPT.medicine, {
    doctor_name: "Dr. Ahsan Habib",
    gender: "Male",
    speciality: "Medicine Specialist",
    qualifications: "MBBS, FCPS (Medicine), MD (Internal Medicine)",
    designation: "Associate Professor, Department of Medicine",
    experience_years: 15,
    bmdc_reg_no: "A-38214",
    consultation_fee: 1000,
    follow_up_fee: 600,
  }),
  doctor(2, DHAKA_ID, DEPT.gynecology, {
    doctor_name: "Dr. Farhana Akter",
    gender: "Female",
    speciality: "Gynecologist & Obstetrician",
    qualifications: "MBBS, FCPS (Gynae & Obs), MS (Obs & Gynae)",
    designation: "Senior Consultant, Gynecology & Obstetrics",
    experience_years: 14,
    bmdc_reg_no: "A-40127",
    consultation_fee: 1200,
    follow_up_fee: 700,
  }),
  doctor(3, DHAKA_ID, DEPT.cardiology, {
    doctor_name: "Dr. Mahmudul Hasan",
    gender: "Male",
    speciality: "Cardiologist",
    qualifications: "MBBS, MD (Cardiology), FACC (USA)",
    designation: "Professor, Department of Cardiology",
    experience_years: 20,
    bmdc_reg_no: "A-29871",
    consultation_fee: 1500,
    follow_up_fee: 1000,
  }),
  doctor(4, DHAKA_ID, DEPT.pediatrics, {
    doctor_name: "Dr. Nusrat Jahan",
    gender: "Female",
    speciality: "Child Specialist",
    qualifications: "MBBS, DCH, FCPS (Paediatrics)",
    designation: "Consultant, Paediatrics",
    experience_years: 10,
    bmdc_reg_no: "A-52340",
    consultation_fee: 1000,
    follow_up_fee: 500,
  }),
  doctor(5, DHAKA_ID, DEPT.orthopedics, {
    doctor_name: "Dr. Rafiqul Islam",
    gender: "Male",
    speciality: "Orthopedic Surgeon",
    qualifications: "MBBS, MS (Orthopaedic Surgery), AO Trauma Fellow",
    designation: "Associate Professor, Orthopaedics",
    experience_years: 16,
    bmdc_reg_no: "A-36552",
    consultation_fee: 1200,
    follow_up_fee: 700,
  }),
  doctor(6, DHAKA_ID, DEPT.dermatology, {
    doctor_name: "Dr. Sabrina Rahman",
    gender: "Female",
    speciality: "Dermatologist",
    qualifications: "MBBS, DDV, FCPS (Dermatology & Venereology)",
    designation: "Consultant, Skin & VD",
    experience_years: 9,
    bmdc_reg_no: "A-55418",
    consultation_fee: 1000,
    follow_up_fee: 600,
  }),
  doctor(7, DHAKA_ID, DEPT.ent, {
    doctor_name: "Dr. Kamrul Hossain",
    gender: "Male",
    speciality: "ENT Specialist & Head-Neck Surgeon",
    qualifications: "MBBS, FCPS (ENT), MS (Otolaryngology)",
    designation: "Assistant Professor, ENT",
    experience_years: 12,
    bmdc_reg_no: "A-44290",
    consultation_fee: 900,
    follow_up_fee: 500,
  }),
  doctor(8, DHAKA_ID, DEPT.eye, {
    doctor_name: "Dr. Tahmina Sultana",
    gender: "Female",
    speciality: "Eye Specialist",
    qualifications: "MBBS, DO, FCPS (Ophthalmology)",
    designation: "Consultant, Ophthalmology",
    experience_years: 11,
    bmdc_reg_no: "A-47731",
    consultation_fee: 800,
    follow_up_fee: 500,
  }),
  doctor(9, DHAKA_ID, DEPT.dental, {
    doctor_name: "Dr. Imran Chowdhury",
    gender: "Male",
    speciality: "Dental Surgeon",
    qualifications: "BDS, FCPS (Prosthodontics), PGT (Oral Surgery)",
    designation: "Chief Dental Surgeon",
    experience_years: 8,
    bmdc_reg_no: "D-6124",
    consultation_fee: 700,
    follow_up_fee: 400,
  }),
  doctor(10, DHAKA_ID, DEPT.neurology, {
    doctor_name: "Dr. Shirin Akhter",
    gender: "Female",
    speciality: "Neurologist",
    qualifications: "MBBS, MD (Neurology), FCPS (Medicine)",
    designation: "Associate Professor, Neurology",
    experience_years: 17,
    bmdc_reg_no: "A-33905",
    consultation_fee: 1500,
    follow_up_fee: 900,
  }),
  doctor(11, DHAKA_ID, DEPT.gastroenterology, {
    doctor_name: "Dr. Mizanur Rahman",
    gender: "Male",
    speciality: "Gastroenterologist & Liver Specialist",
    qualifications: "MBBS, FCPS (Medicine), MD (Gastroenterology)",
    designation: "Consultant, Gastroenterology",
    experience_years: 13,
    bmdc_reg_no: "A-41876",
    consultation_fee: 1200,
    follow_up_fee: 700,
  }),
  doctor(12, DHAKA_ID, DEPT.endocrinology, {
    doctor_name: "Dr. Anika Tabassum",
    gender: "Female",
    speciality: "Diabetes & Hormone Specialist",
    qualifications: "MBBS, FCPS (Medicine), MD (Endocrinology)",
    designation: "Consultant, Endocrinology",
    experience_years: 9,
    bmdc_reg_no: "A-56002",
    consultation_fee: 1000,
    follow_up_fee: 600,
  }),
  // Chittagong
  doctor(13, CTG_ID, DEPT.medicine, {
    doctor_name: "Dr. Abdul Mannan",
    gender: "Male",
    speciality: "Medicine Specialist",
    qualifications: "MBBS, FCPS (Medicine)",
    designation: "Associate Professor, Chattogram Medical College",
    experience_years: 18,
    bmdc_reg_no: "A-31450",
    consultation_fee: 800,
    follow_up_fee: 500,
  }),
  doctor(14, CTG_ID, DEPT.gynecology, {
    doctor_name: "Dr. Rokeya Begum",
    gender: "Female",
    speciality: "Gynecologist & Obstetrician",
    qualifications: "MBBS, FCPS (Gynae & Obs)",
    designation: "Consultant, Gynecology & Obstetrics",
    experience_years: 15,
    bmdc_reg_no: "A-37720",
    consultation_fee: 900,
    follow_up_fee: 500,
  }),
  doctor(15, CTG_ID, DEPT.cardiology, {
    doctor_name: "Dr. Shafiqul Alam",
    gender: "Male",
    speciality: "Cardiologist",
    qualifications: "MBBS, D-Card, MD (Cardiology)",
    designation: "Senior Consultant, Cardiology",
    experience_years: 19,
    bmdc_reg_no: "A-30318",
    consultation_fee: 1200,
    follow_up_fee: 800,
  }),
  doctor(16, CTG_ID, DEPT.pediatrics, {
    doctor_name: "Dr. Jannatul Ferdous",
    gender: "Female",
    speciality: "Child Specialist",
    qualifications: "MBBS, DCH, MD (Paediatrics)",
    designation: "Consultant, Paediatrics",
    experience_years: 8,
    bmdc_reg_no: "A-58841",
    consultation_fee: 800,
    follow_up_fee: 400,
  }),
  doctor(17, CTG_ID, DEPT.eye, {
    doctor_name: "Dr. Arif Uddin",
    gender: "Male",
    speciality: "Eye Specialist & Phaco Surgeon",
    qualifications: "MBBS, DO, MS (Ophthalmology)",
    designation: "Consultant, Ophthalmology",
    experience_years: 12,
    bmdc_reg_no: "A-45563",
    consultation_fee: 700,
    follow_up_fee: 400,
  }),
  doctor(18, CTG_ID, DEPT.dental, {
    doctor_name: "Dr. Sadia Islam",
    gender: "Female",
    speciality: "Dental Surgeon",
    qualifications: "BDS, PGT (Conservative Dentistry)",
    designation: "Dental Surgeon",
    experience_years: 6,
    bmdc_reg_no: "D-7810",
    consultation_fee: 600,
    follow_up_fee: 300,
  }),
];

const D = (n) => DEMO_DOCTORS[n - 1];
const deptById = (id) => DEMO_DEPARTMENTS.find((d) => d._id === id);

// ---------------------------------------------------------------------------
// Chambers (doctor x center) with weekly schedules
// ---------------------------------------------------------------------------

// Same weekday order the booking modal uses.
const WEEKDAYS = [
  "Saturday",
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
];

const CLOSED = { start: "00:00", end: "00:00" };

// Weekly schedule templates: which slots are open and the off days.
const SCHEDULES = {
  evening: {
    evening: { start: "05:00 PM", end: "09:00 PM" },
    off: ["Friday"],
  },
  morning: {
    morning: { start: "09:00 AM", end: "01:00 PM" },
    off: ["Friday"],
  },
  afternoon: {
    afternoon: { start: "03:00 PM", end: "06:00 PM" },
    off: ["Thursday", "Friday"],
  },
  morningEvening: {
    morning: { start: "10:00 AM", end: "12:30 PM" },
    evening: { start: "06:00 PM", end: "09:30 PM" },
    off: ["Friday"],
  },
  lateEvening: {
    evening: { start: "07:00 PM", end: "10:00 PM" },
    off: [],
  },
};

const dayRange = (days) => {
  if (days.length === 0) return "";
  if (days.length === 1) return days[0];
  const idx = days.map((d) => WEEKDAYS.indexOf(d));
  const contiguous = idx.every((v, i) => i === 0 || v === idx[i - 1] + 1);
  return contiguous ? `${days[0]} - ${days[days.length - 1]}` : days.join(", ");
};

const buildSchedule = (template) =>
  WEEKDAYS.map((day_name) => {
    const is_closed = template.off.includes(day_name);
    return {
      day_name,
      is_closed,
      morning: !is_closed && template.morning ? template.morning : CLOSED,
      afternoon: !is_closed && template.afternoon ? template.afternoon : CLOSED,
      evening: !is_closed && template.evening ? template.evening : CLOSED,
    };
  });

const buildSlotTexts = (template) => {
  const onDays = dayRange(WEEKDAYS.filter((d) => !template.off.includes(d)));
  const texts = ["morning", "afternoon", "evening"]
    .filter((key) => template[key])
    .map((key) => `${onDays}: ${template[key].start} - ${template[key].end}`);
  texts.push(
    template.off.length
      ? `Off day: ${template.off.join(", ")}`
      : "Open every day",
  );
  return texts;
};

const chamber = (n, doctorNo, centerNo, scheduleKey, extra = {}) => {
  const doctorInfo = D(doctorNo);
  const consultationCenterInfo = C(centerNo);
  const template = SCHEDULES[scheduleKey];
  const [slot1, slot2, slot3] = buildSlotTexts(template);
  return {
    _id: oid("c7", n),
    doctorInfo,
    consultationCenterInfo,
    deptInfo: deptById(doctorInfo.department),
    district_id: consultationCenterInfo.district_id,
    chamber_onDay_time_slot_1: slot1,
    chamber_onDay_time_slot_2: slot2,
    chamber_onDay_time_slot_3: slot3,
    chamber_schedule: buildSchedule(template),
    // The booking modal only accepts bookings between start_time and
    // end_time (compared with the current clock), so demo chambers take
    // serials around the clock.
    appointment_scheduling: {
      scheduling_type: "ScheduleForNextDay",
      start_time: "12:00 AM",
      end_time: "11:59 PM",
    },
    consultation_limit_per_slot: 30,
    consultation_fee: doctorInfo.consultation_fee,
    follow_up_fee: doctorInfo.follow_up_fee,
    room_no: `${100 + n}`,
    book_an_appointment: true,
    is_chamber_off: false,
    is_popular: false,
    ...extra,
  };
};

const POPULAR = { is_popular: true };

export const DEMO_CHAMBERS = [
  // Dhaka
  chamber(1, 1, 1, "evening", POPULAR),
  chamber(2, 1, 10, "morning"),
  chamber(3, 2, 2, "afternoon", POPULAR),
  chamber(4, 2, 8, "evening"),
  chamber(5, 3, 3, "morningEvening", POPULAR),
  chamber(6, 3, 5, "lateEvening"),
  chamber(7, 4, 9, "evening", POPULAR),
  chamber(8, 4, 1, "morning"),
  chamber(9, 5, 4, "afternoon", POPULAR),
  chamber(10, 5, 6, "lateEvening"),
  chamber(11, 6, 8, "morningEvening", POPULAR),
  chamber(12, 6, 7, "evening"),
  chamber(13, 7, 10, "evening", POPULAR),
  chamber(14, 7, 2, "morning"),
  chamber(15, 8, 11, "morning", POPULAR),
  chamber(16, 8, 12, "evening"),
  chamber(17, 9, 13, "morningEvening", POPULAR),
  chamber(18, 9, 14, "lateEvening"),
  chamber(19, 10, 3, "afternoon", POPULAR),
  chamber(20, 11, 5, "evening", POPULAR),
  chamber(21, 11, 4, "morning"),
  chamber(22, 12, 9, "lateEvening", POPULAR),
  chamber(23, 12, 7, "afternoon"),
  // Chittagong
  chamber(24, 13, 15, "evening", POPULAR),
  chamber(25, 13, 18, "morning"),
  chamber(26, 14, 16, "afternoon", POPULAR),
  chamber(27, 14, 17, "evening"),
  chamber(28, 15, 15, "morningEvening", POPULAR),
  chamber(29, 16, 18, "lateEvening", POPULAR),
  chamber(30, 16, 17, "morning"),
  chamber(31, 17, 19, "morning", POPULAR),
  chamber(32, 18, 20, "evening", POPULAR),
];

export const DEMO_MEDICAL_SERVICE_PROVIDERS = [
  {
    _id: oid("5e", 1),
    district_id: DHAKA_ID,
    service_type: "Ambulance",
    provider_name: "Rapid Care Ambulance Service",
    contact: "01700-999111",
    address: "Mohakhali, Dhaka 1212",
  },
  {
    _id: oid("5e", 2),
    district_id: DHAKA_ID,
    service_type: "Ambulance",
    provider_name: "Gulshan ICU Ambulance",
    contact: "01811-222333",
    address: "Gulshan 1, Dhaka 1212",
  },
  {
    _id: oid("5e", 3),
    district_id: CTG_ID,
    service_type: "Ambulance",
    provider_name: "Port City Ambulance",
    contact: "01712-444555",
    address: "Agrabad, Chattogram 4100",
  },
];
