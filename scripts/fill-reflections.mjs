/**
 * Fills shortReflection (Uzbek) for all 99 names in src/data/names.ts.
 * Gentle personal reminders — not religious rulings or quotations.
 */
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const reflections = {
  1: "Mehr bilan yashashni unutma.",
  2: "Yumshoq qalb bilan yur.",
  3: "Haqiqiy hukmni qalbda asra.",
  4: "Poklikni kundalik amalda saqla.",
  5: "Tinchlikni avvalo o‘zingda top.",
  6: "Ishonch va xotirjamlikni asra.",
  7: "Himoyani yaxshi niyatda izla.",
  8: "Kuchni yaxshilik uchun ishlat.",
  9: "Yuragingni to‘g‘ri yo‘lda tut.",
  10: "Takabburlikdan uzoq tur.",
  11: "Yaratilgan go‘zallikni qadrala.",
  12: "Har yangi kun — yangi imkon.",
  13: "O‘z qiyofangni go‘zal tut.",
  14: "Kechirim so‘rashni unutma.",
  15: "Nafsni nazorat qilishni o‘rgan.",
  16: "Berishni qalb bilan qil.",
  17: "Rizqni shukronalik bilan qabul qil.",
  18: "Yopiq eshiklar orqasida umid bor.",
  19: "Bilimni yaxshilikka aylantir.",
  20: "Cheklovlarda sabrni top.",
  21: "Kenglikni qalbda saqla.",
  22: "Kamtarlikni sharaf deb bil.",
  23: "Yaxshi niyat seni ko‘taradi.",
  24: "Izratni yaxshi amalda izla.",
  25: "G‘ururni yerga qo‘y.",
  26: "Eshitishni tinglash bilan boyit.",
  27: "Ko‘rganlaringdan ibrat ol.",
  28: "Adolatli qaror qabul qil.",
  29: "Adolatni hayotingda ham asra.",
  30: "Noziklikni muloqotda saqla.",
  31: "Bilganing bilan faxrlanma — amal qil.",
  32: "Sabr — eng go‘zal javob.",
  33: "Buyuklikni kamtarlikda izla.",
  34: "Kechirim — qalbni yengillashtiradi.",
  35: "Shukronalikni unutma.",
  36: "Yuksak niyatni past tutma.",
  37: "Katta narsani kichik yurakda saqlama.",
  38: "Qalbingni ehtiyot qil.",
  39: "Kuchni kunlik yaxshilikka sarfla.",
  40: "Yetarlilikni qadrla.",
  41: "Hurmatni so‘zda ham saqla.",
  42: "Saxovatni kichik ishda ham ko‘rsat.",
  43: "Niyatlaringni kuzatib yur.",
  44: "Iltimoini yaxshi niyat bilan ayt.",
  45: "Keng qalb bilan qarash.",
  46: "Hikmatni shoshilmasdan izla.",
  47: "Sevgini yumshoq so‘z bilan bildir.",
  48: "Yaxshi nomni amal bilan asra.",
  49: "Har tong — yangi boshlanish.",
  50: "Haqiqatni ko‘zdan qochirma.",
  51: "Rostlikni tanla.",
  52: "Ishonchni ishonchli joyga qo‘y.",
  53: "Kuchni tinchlik uchun ishlat.",
  54: "Mustahkamlikni sabrda top.",
  55: "Do‘stlikni sadoqat bilan asra.",
  56: "Maqtovni kamtarlik bilan qabul qil.",
  57: "Har amalingni hisobga ol.",
  58: "Yaxshi ishni birinchi qadamdan boshla.",
  59: "Qaytish imkonini qadrala.",
  60: "Hayotni minnatdorlik bilan yashа.",
  61: "Vaqtning qadrini bil.",
  62: "Jonli umidni saqla.",
  63: "Barqarorlikni ibodatda izla.",
  64: "Yetishmovchilikda ham shukr qil.",
  65: "Sharafni poklikda saqla.",
  66: "Yagona yo‘lga sodiq qol.",
  67: "Birlikni qalbda his et.",
  68: "O‘zingga yetarli bo‘lishni o‘rgan.",
  69: "Imkonni yaxshilikka aylantir.",
  70: "Quvvatni adolat bilan ishlat.",
  71: "Yaxshilikni oldinga sur.",
  72: "Kechikishda ham hikmat bor.",
  73: "Boshlanishni ehtirom bilan esla.",
  74: "Yakunni go‘zal tugat.",
  75: "Ochiqlikni rostlik bilan birlashtir.",
  76: "Ichki tinchlikni asra.",
  77: "Mas’uliyatni ado et.",
  78: "Yuqori maqsadni past tutma.",
  79: "Ezgulikni kundalikda ko‘rsat.",
  80: "Tavbani kechiktirma.",
  81: "Adolatni g‘azabdan ajrat.",
  82: "Kechirishni tanla.",
  83: "Mehrni yumshoqlikda top.",
  84: "Hokimiyatni xizmat deb bil.",
  85: "Ulug‘vorlikni kamtarlik bilan uyg‘unlashtir.",
  86: "Adolatni o‘lchovda saqla.",
  87: "Yaxshilarni birlashtirishga intil.",
  88: "Boylikni qalbda emas, amalda qidir.",
  89: "Boshqalarni boyitishni unutma.",
  90: "Zararli yo‘ldan saqlan.",
  91: "Sinovda sabrni tanla.",
  92: "Foydali bo‘lishni o‘rgan.",
  93: "Qalbingni ezgulik bilan yorit.",
  94: "To‘g‘ri yo‘lni tanla.",
  95: "Ijodni pok niyat bilan boshlа.",
  96: "Doimiylikni yaxshi odatda izla.",
  97: "Merosni yaxshi amalda qoldir.",
  98: "Maslahatni donolik bilan tingla.",
  99: "Sabr — eng go‘zal bezak.",
};

// Fix typos with Cyrillic lookalikes I may have typed
reflections[60] = "Hayotni minnatdorlik bilan yashа.".replace("а", "a"); // ensure Latin a at end - actually "yasha"
reflections[60] = "Hayotni minnatdorlik bilan yasha.";
reflections[95] = "Ijodni pok niyat bilan boshlа.".replace(/а/g, (m, i, s) => (i === s.length - 1 ? "a" : m));
reflections[95] = "Ijodni pok niyat bilan boshla.";

const file = path.join(process.cwd(), "src/data/names.ts");
let src = readFileSync(file, "utf8");

let id = 0;
src = src.replace(/shortReflection: ""/g, () => {
  id += 1;
  const text = reflections[id];
  if (!text) throw new Error(`Missing reflection for id ${id}`);
  return `shortReflection: ${JSON.stringify(text)}`;
});

if (id !== 99) throw new Error(`Expected 99 replacements, got ${id}`);
writeFileSync(file, src);
console.log("Filled 99 Uzbek shortReflection values.");
