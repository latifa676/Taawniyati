import { useState, type FormEvent } from "react";

const whatsappNumber = "21267371688";

const cities = [
  "الرباط",
  "الدار البيضاء",
  "مراكش",
  "فاس",
  "طنجة",
  "أكادير",
  "مكناس",
  "وجدة",
  "القنيطرة",
  "تطوان",
  "سلا",
  "تمارة",
  "آسفي",
  "الجديدة",
  "بني ملال",
  "الناظور",
  "تازة",
  "خريبكة",
  "سطات",
  "العرائش",
  "العيون",
  "الداخلة",
  "الحسيمة",
  "ورزازات",
  "الصويرة",
  "أخرى",
];

const sectors = [
  "الفلاحة",
  "الصناعة التقليدية",
  "المنتجات الغذائية",
  "النسيج",
  "التجميل والمنتجات الطبيعية",
  "العسل ومشتقاته",
  "زيت الزيتون",
  "النباتات الطبية والعطرية",
  "السياحة",
  "خدمات",
  "أخرى",
];

const fieldLabels = {
  cooperativeName: "إسم التعاونية",
  managerName: "إسم المسؤول",
  phone: "رقم الهاتف",
  city: "المدينة",
  sector: "مجال التعاونية",
  otherSector: "المجال الآخر",
} as const;

type FieldName = keyof typeof fieldLabels;
type FormValues = Record<FieldName, string>;
type FormErrors = Partial<Record<FieldName, string>>;

const initialValues: FormValues = {
  cooperativeName: "",
  managerName: "",
  phone: "",
  city: "",
  sector: "",
  otherSector: "",
};

function validateField(field: FieldName, value: string) {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    if (field === "otherSector") return "يرجى إدخال مجال التعاونية.";
    return field === "city" || field === "sector"
      ? `يرجى اختيار ${fieldLabels[field]}.`
      : `يرجى إدخال ${fieldLabels[field]}.`;
  }

  if (field === "cooperativeName") {
    if (trimmedValue.length < 2) return "يجب ألا يقل إسم التعاونية عن حرفين.";
    if (trimmedValue.length > 100) return "الحد الأقصى لإسم التعاونية هو 100 حرف.";
    if (!/\p{L}/u.test(trimmedValue)) return "لا يمكن أن يتكون إسم التعاونية من أرقام فقط.";
  }

  if (field === "managerName") {
    if (trimmedValue.length < 2) return "يجب ألا يقل إسم المسؤول عن حرفين.";
    if (trimmedValue.length > 80) return "الحد الأقصى لإسم المسؤول هو 80 حرفاً.";
    if (!/^[\p{Script=Arabic}\p{Script=Latin}\u064B-\u065F\u0670\s.'’-]+$/u.test(trimmedValue)) {
      return "يرجى إدخال الإسم بحروف عربية أو لاتينية فقط.";
    }
    if ((trimmedValue.match(/\p{L}/gu) ?? []).length < 2) return "يرجى إدخال إسم المسؤول.";
  }

  if (field === "phone") {
    const normalizedPhone = trimmedValue.replace(/[\s()-]/g, "");
    if (!/^(?:0[67]\d{8}|\+212[67]\d{8}|00212[67]\d{8})$/.test(normalizedPhone)) {
      return "يرجى إدخال رقم هاتف مغربي صالح.";
    }
  }

  return "";
}

function CooperativeForm() {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({});
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [whatsappUrl, setWhatsappUrl] = useState("");

  function updateField(field: FieldName, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    if (touched[field]) setErrors((current) => ({ ...current, [field]: validateField(field, value) }));
    if (field === "sector" && value !== "أخرى") {
      setTouched((current) => ({ ...current, otherSector: false }));
      setErrors((current) => ({ ...current, otherSector: "" }));
    }
    setSubmitted(false);
  }

  function markTouched(field: FieldName) {
    setTouched((current) => ({ ...current, [field]: true }));
    setErrors((current) => ({ ...current, [field]: validateField(field, values[field]) }));
  }

  function fieldClass(field: FieldName) {
    return `mt-2 min-h-12 w-full rounded-xl border bg-white px-4 py-3 text-right text-[16px] text-[#1f1f1f] outline-none transition-colors placeholder:text-[#9b96a5] focus:border-[#45238f] focus:ring-2 focus:ring-[#45238f]/10 ${
      errors[field] ? "border-red-500 focus:border-red-500 focus:ring-red-500/10" : "border-[#ded9e8]"
    }`;
  }

  function renderError(field: FieldName) {
    return errors[field] ? (
      <p id={`${field}-error`} className="mt-1.5 text-right text-sm text-red-700" role="alert">
        {errors[field]}
      </p>
    ) : null;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const activeFields = (Object.keys(fieldLabels) as FieldName[]).filter(
      (field) => field !== "otherSector" || values.sector === "أخرى",
    );
    const nextErrors = activeFields.reduce<FormErrors>((allErrors, field) => {
      const error = validateField(field, values[field]);
      if (error) allErrors[field] = error;
      return allErrors;
    }, {});

    setTouched({ cooperativeName: true, managerName: true, phone: true, city: true, sector: true, otherSector: values.sector === "أخرى" });
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const message = [
      "طلب تسجيل تعاونية عبر موقع تعاونيتي",
      `إسم التعاونية: ${values.cooperativeName.trim()}`,
      `إسم المسؤول: ${values.managerName.trim()}`,
      `رقم الهاتف: ${values.phone.trim()}`,
      `المدينة: ${values.city}`,
      `مجال التعاونية: ${values.sector === "أخرى" ? values.otherSector.trim() : values.sector}`,
    ].join("\n");

    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    setWhatsappUrl(url);
    setSubmitting(true);
    setSubmitted(false);
    window.open(url, "_blank", "noopener,noreferrer");
    window.setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 700);
  }

  return (
    <section id="contact-form" className="scroll-mt-28 bg-[#f7f5fa] px-5 py-16 md:px-8 md:py-20" dir="rtl">
      <div className="mx-auto max-w-[960px]">
        <div className="mb-8 text-right md:mb-10">
          <p className="mb-2 font-ibm-plex-arabic text-[17px] text-[#caa320]">خطوة نحو نمو تعاونيتكم</p>
          <h2 className="font-zain-title text-[32px] leading-tight text-[#45238f] md:text-[40px]">سجّلوا تعاونيتكم</h2>
          <p className="mt-3 max-w-[680px] font-ibm-plex-arabic text-[17px] leading-relaxed text-[#5e5274]">
            اتركوا بياناتكم وسيتواصل معكم فريق تعاونيتي لمناقشة احتياجاتكم.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="rounded-2xl border border-[#e5e0ed] bg-white p-5 shadow-[0_12px_36px_rgba(31,19,48,0.06)] md:p-9">
          <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">
            <div>
              <label htmlFor="cooperativeName" className="font-ibm-plex-arabic text-[16px] text-[#1f1f1f]">إسم التعاونية <span className="text-[#caa320]">*</span></label>
              <input id="cooperativeName" name="cooperativeName" autoComplete="organization" value={values.cooperativeName} onChange={(event) => updateField("cooperativeName", event.target.value)} onBlur={() => markTouched("cooperativeName")} maxLength={100} aria-invalid={Boolean(errors.cooperativeName)} aria-describedby={errors.cooperativeName ? "cooperativeName-error" : undefined} className={fieldClass("cooperativeName")} placeholder="مثال: تعاونية النور" />
              {renderError("cooperativeName")}
            </div>

            <div>
              <label htmlFor="managerName" className="font-ibm-plex-arabic text-[16px] text-[#1f1f1f]">إسم المسؤول <span className="text-[#caa320]">*</span></label>
              <input id="managerName" name="managerName" autoComplete="name" value={values.managerName} onChange={(event) => updateField("managerName", event.target.value)} onBlur={() => markTouched("managerName")} maxLength={80} aria-invalid={Boolean(errors.managerName)} aria-describedby={errors.managerName ? "managerName-error" : undefined} className={fieldClass("managerName")} placeholder="الإسم الكامل للمسؤول" />
              {renderError("managerName")}
            </div>

            <div>
              <label htmlFor="phone" className="font-ibm-plex-arabic text-[16px] text-[#1f1f1f]">رقم الهاتف <span className="text-[#caa320]">*</span></label>
              <input id="phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" dir="ltr" value={values.phone} onChange={(event) => updateField("phone", event.target.value)} onBlur={() => markTouched("phone")} maxLength={18} aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? "phone-error" : "phone-hint"} className={`${fieldClass("phone")} text-left`} placeholder="06XXXXXXXX أو +2126XXXXXXXX" />
              {renderError("phone")}
              {!errors.phone && <p id="phone-hint" className="mt-1.5 text-right text-sm text-[#777181]">مثال: 0612345678 أو +212612345678</p>}
            </div>

            <div>
              <label htmlFor="city" className="font-ibm-plex-arabic text-[16px] text-[#1f1f1f]">المدينة <span className="text-[#caa320]">*</span></label>
              <select id="city" name="city" value={values.city} onChange={(event) => updateField("city", event.target.value)} onBlur={() => markTouched("city")} aria-invalid={Boolean(errors.city)} aria-describedby={errors.city ? "city-error" : undefined} className={fieldClass("city")}>
                <option value="">اختر المدينة</option>
                {cities.map((city) => <option key={city} value={city}>{city}</option>)}
              </select>
              {renderError("city")}
            </div>

            <div className="md:col-span-2">
              <label htmlFor="sector" className="font-ibm-plex-arabic text-[16px] text-[#1f1f1f]">مجال التعاونية <span className="text-[#caa320]">*</span></label>
              <select id="sector" name="sector" value={values.sector} onChange={(event) => updateField("sector", event.target.value)} onBlur={() => markTouched("sector")} aria-invalid={Boolean(errors.sector)} aria-describedby={errors.sector ? "sector-error" : undefined} className={fieldClass("sector")}>
                <option value="">اختر مجال التعاونية</option>
                {sectors.map((sector) => <option key={sector} value={sector}>{sector}</option>)}
              </select>
              {renderError("sector")}
              {values.sector === "أخرى" && (
                <div className="mt-4">
                  <label htmlFor="otherSector" className="font-ibm-plex-arabic text-[16px] text-[#1f1f1f]">
                    يرجى تحديد المجال <span className="text-[#caa320">*</span>
                  </label>
                  <input
                    id="otherSector"
                    name="otherSector"
                    value={values.otherSector}
                    onChange={(event) => updateField("otherSector", event.target.value)}
                    onBlur={() => markTouched("otherSector")}
                    maxLength={100}
                    aria-invalid={Boolean(errors.otherSector)}
                    aria-describedby={errors.otherSector ? "otherSector-error" : undefined}
                    className={fieldClass("otherSector")}
                    placeholder="اكتب مجال التعاونية"
                  />
                  {renderError("otherSector")}
                </div>
              )}
            </div>
          </div>

          <div className="mt-7 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <button type="submit" disabled={submitting} className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-[#caa320] px-8 py-3 font-ibm-plex-arabic text-[18px] text-white transition duration-200 hover:-translate-y-0.5 hover:brightness-105 active:translate-y-0 active:scale-[0.98] disabled:cursor-wait disabled:opacity-65 sm:w-auto">
              {submitting ? "جاري الإرسال..." : "إرسال الطلب"}
            </button>
            {submitted && (
              <div role="status" className="text-right font-ibm-plex-arabic text-[#287a50]">
                <p>تم تجهيز طلبكم في واتساب</p>
                <p className="text-[15px]">اضغطوا على إرسال لإتمام الطلب.</p>
                <a href={whatsappUrl} target="_blank" rel="noreferrer" className="mt-1 inline-block text-[15px] text-[#45238f] underline underline-offset-2">
                  فتح واتساب
                </a>
              </div>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}

export default CooperativeForm;