// Picks the All Care service illustration from the service's English name, so
// the picture always matches the service no matter where it sits in the list.
// Rules are checked in order: put more specific patterns before general ones
// (e.g. "computer training" before "computer", "building materials" before
// "construction"). Returns null when nothing matches; the caller shows a
// generic icon instead.

const ICON_DIR = "/images/all-care-services/services";

const ICON_RULES = [
  [/computer (training|course)|ms office/, 22],
  [/laptop|computer/, 12],
  [/\btv\b|television|electronics/, 9],
  [/electric|wiring/, 5],
  [/plumb/, 6],
  [/gas stove|kitchen hood|\bstove\b/, 7],
  [/fridge|refrigerator|washing machine/, 8],
  [/\bac\b|air ?condition/, 10],
  [/mobile|phone/, 11],
  [/internet|wi-?fi|broadband/, 13],
  [/\b(car|bike|motorbike|motorcycle|vehicle|garage)\b/, 14],
  [/shifting|movers?\b|relocation/, 15],
  [/cctv|security/, 16],
  [/admission/, 17],
  [/madrasa|quran|arabic/, 18],
  [/coaching|tutor/, 19],
  [/english|ielts|language/, 20],
  [/higher stud|study abroad/, 21],
  [/driving/, 23],
  [/tailor|fashion|dress/, 24],
  [/handyman|locksmith/, 25],
  [/pest|termite/, 27],
  [/floor|polish|mosaic/, 43],
  [/clean/, 26],
  [/pickup|truck/, 28],
  [/catering|event/, 29],
  [/community cent|venue|convention/, 30],
  [/\bgym\b|fitness/, 31],
  [/marketing/, 32],
  [/printing press|signboard/, 33],
  [/photocopy|print/, 4],
  [/bank|loan|finance/, 1],
  [/courier|parcel/, 2],
  [/legal|lawyer|advocate|documentation/, 3],
  [/material|crane/, 42],
  [/construction|builder/, 34],
  [/interior/, 35],
  [/tiles?\b|marble/, 36],
  [/mason|brick/, 37],
  [/glass|alumin/, 38],
  [/weld|grill/, 39],
  [/carpent|furniture/, 40],
  [/paint/, 41],
  [/\blift\b|generator|elevator/, 44],
  [/water filter|purifier/, 45],
];

export const getAllCareServiceIcon = (service) => {
  const name = String(service?.service_name_eng || "").toLowerCase();
  if (!name) return null;

  const rule = ICON_RULES.find(([pattern]) => pattern.test(name));
  return rule ? `${ICON_DIR}/services-${rule[1]}.png` : null;
};
