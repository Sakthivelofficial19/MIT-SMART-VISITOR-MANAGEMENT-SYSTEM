import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  CalendarDays,
  Car,
  Camera,
  CheckCircle2,
  IdCard,
  Info,
  Mail,
  Phone,
  RotateCcw,
  UserRound,
} from "lucide-react";

import bannerImg from "@/assets/mit-entrance.jpg";
import {
  DEPARTMENTS,
  ID_TYPES,
  PURPOSES,
  STATES,
  VEHICLE_TYPES,
} from "@/components/vms/data";
import {
  FieldLabel,
  Hint,
  NoticeBox,
  SectionCard,
  SelectField,
  TextArea,
  TextField,
} from "@/components/vms/fields";
import { VisitorPass, type PassData } from "@/components/vms/VisitorPass";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Visitor Registration — MIT Chennai Visitor Management System" },
      {
        name: "description",
        content:
          "Register at the main gate of Madras Institute of Technology, Chrompet, Chennai. Enter visitor details, ID, photograph, purpose and vehicle information to receive a visitor pass.",
      },
      { property: "og:title", content: "Visitor Registration — MIT Chennai" },
      {
        property: "og:description",
        content:
          "Gate-side visitor registration for Madras Institute of Technology, Chennai. Complete the form to receive a printable visitor pass.",
      },
    ],
  }),
  component: VisitorRegistrationPage,
});

const MARQUEE =
  "★ Welcome to the Visitor Management System of MIT Chennai — Madras Institute of Technology, Chrompet ★ All visitors must carry a valid Government-issued photo ID ★ Registration is done at the main gate at the time of entry ★ Campus hours: 08:00 AM – 06:00 PM ★";

const IST = "Asia/Kolkata";

function todayISO() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: IST,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function formatTime(date: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: IST,
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

function formatDate(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

function maskId(idType: string, value: string) {
  const v = value.trim();
  if (idType === "Aadhaar Card" && v.replace(/\s/g, "").length >= 12) {
    const digits = v.replace(/\s/g, "");
    return `${digits.slice(0, 4)} XXXX XXXX`;
  }
  if (v.length > 4) return `${"X".repeat(Math.max(0, v.length - 4))}${v.slice(-4)}`;
  return v;
}

const emptyForm = {
  idType: "",
  idNumber: "",
  fullName: "",
  contact: "",
  email: "",
  address: "",
  city: "Chennai",
  state: "Tamil Nadu",
  pin: "",
  purpose: "",
  hostName: "",
  department: "",
  description: "",
  expectedExit: "",
  byVehicle: false,
  vehicleType: "",
  vehicleReg: "",
  vehicleModel: "",
};

function VisitorRegistrationPage() {
  const [form, setForm] = useState(emptyForm);
  const [photo, setPhoto] = useState<{ url: string; name: string } | null>(null);
  const [photoError, setPhotoError] = useState("");
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [visitDate, setVisitDate] = useState(todayISO);
  const [pass, setPass] = useState<PassData | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // Visit date is always "today" and refreshes on its own when the day rolls over.
  useEffect(() => {
    const id = window.setInterval(() => {
      setVisitDate((prev) => {
        const now = todayISO();
        return prev === now ? prev : now;
      });
    }, 30_000);
    return () => window.clearInterval(id);
  }, []);

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: false }));
  };

  const wordCount = useMemo(
    () => form.description.trim().split(/\s+/).filter(Boolean).length,
    [form.description],
  );

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setPhotoError("Only JPG, PNG or WEBP images are accepted.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setPhotoError("Photograph must be 5 MB or smaller.");
      return;
    }
    setPhotoError("");
    setPhoto({ url: URL.createObjectURL(file), name: file.name });
  };

  const clearForm = () => {
    setForm(emptyForm);
    setPhoto(null);
    setPhotoError("");
    setErrors({});
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const required: (keyof typeof form)[] = [
      "idType",
      "idNumber",
      "fullName",
      "contact",
      "address",
      "city",
      "state",
      "pin",
      "purpose",
      "department",
    ];
    if (form.byVehicle) required.push("vehicleType", "vehicleReg");

    const next: Record<string, boolean> = {};
    required.forEach((key) => {
      if (!String(form[key]).trim()) next[key] = true;
    });
    if (!/^[0-9]{10}$/.test(form.contact.replace(/\D/g, "").slice(-10))) next["contact"] = true;
    if (!/^[0-9]{6}$/.test(form.pin)) next["pin"] = true;
    setErrors(next);

    if (!photo) setPhotoError("Visitor photograph is required before submitting.");
    if (Object.keys(next).length > 0 || !photo) {
      document.getElementById("registration-form")?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    const now = new Date();
    setPass({
      passNo: `MIT/VP/${visitDate.replace(/-/g, "")}/${String(
        Math.floor(Math.random() * 9000) + 1000,
      )}`,
      fullName: form.fullName,
      idType: form.idType,
      idNumberMasked: maskId(form.idType, form.idNumber),
      contact: `+91 ${form.contact}`,
      email: form.email,
      address: form.address,
      city: form.city,
      state: form.state,
      pin: form.pin,
      purpose: form.purpose,
      hostName: form.hostName,
      department: form.department,
      description: form.description,
      visitDate: formatDate(visitDate),
      entryTime: formatTime(now),
      expectedExit: form.expectedExit
        ? formatTime(new Date(`${visitDate}T${form.expectedExit}:00+05:30`))
        : "Not declared",
      vehicle: form.byVehicle
        ? { type: form.vehicleType, reg: form.vehicleReg.toUpperCase(), model: form.vehicleModel }
        : null,
      photo: photo.url,
    });
  };

  return (
    <div className="min-h-screen bg-background print:bg-card">
      <div className="print:hidden">
        {/* Header banner */}
        <header className="relative">
          <img
            src={bannerImg}
            alt="Main entrance arch of Madras Institute of Technology, Chrompet, Chennai"
            width={1920}
            height={720}
            className="h-[240px] w-full object-cover sm:h-[300px] lg:h-[380px]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/85 via-foreground/25 to-transparent" />
          <div className="absolute inset-x-0 bottom-0">
            <div className="mx-auto flex max-w-6xl flex-wrap items-end justify-between gap-2 px-5 pb-5 text-card">
              <div>
                <p className="text-[11px] uppercase tracking-[0.25em] opacity-90">
                  Anna University Constituent College
                </p>
                <h1 className="text-3xl font-bold leading-tight sm:text-4xl">
                  Madras Institute of Technology
                </h1>
                <p className="text-sm opacity-90">Chrompet, Chennai — 600 044</p>
              </div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] opacity-90">
                Est. 1949
              </p>
            </div>
          </div>
        </header>

        {/* Horizontal scrolling notice */}
        <div className="overflow-hidden bg-brand py-2.5">
          <div className="flex w-max animate-marquee whitespace-nowrap">
            <span className="px-4 text-[15px] font-semibold text-brand-foreground">{MARQUEE}</span>
            <span className="px-4 text-[15px] font-semibold text-brand-foreground">{MARQUEE}</span>
          </div>
        </div>

        <main className="mx-auto max-w-6xl px-5 py-10">
          <div className="flex items-center gap-4">
            <span className="h-px flex-1 bg-border" />
            <span className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-bold uppercase tracking-wide text-brand-foreground">
              <UserRound className="size-4" /> Visitor Registration
            </span>
            <span className="h-px flex-1 bg-border" />
          </div>
          <p className="mt-5 text-center text-sm text-muted-foreground">
            Fields marked with <span className="font-semibold text-brand">*</span> are mandatory.
            Please present your original Government-issued photo ID to the security officer at the
            gate while registering.
          </p>

          <form id="registration-form" onSubmit={handleSubmit} className="mt-8 space-y-6">
            {/* Section 1 */}
            <SectionCard icon={<IdCard className="size-5" />} title="Section 1: Visitor Personal Information">
              <NoticeBox>
                <Info className="mt-0.5 size-4 shrink-0" />
                <p>
                  <span className="font-bold">ID Verification Note:</span> Aadhaar collection is
                  subject to UIDAI guidelines and applicable law. Alternatively, present any other
                  valid Government-issued photo identity document. The last 8 digits of Aadhaar will
                  be masked in records as per UIDAI data protection norms.
                </p>
              </NoticeBox>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <div>
                  <FieldLabel htmlFor="idType" required>
                    ID Type
                  </FieldLabel>
                  <SelectField
                    id="idType"
                    value={form.idType}
                    invalid={!!errors["idType"]}
                    onChange={(e) => set("idType", e.target.value)}
                  >
                    <option value="">— Select ID Type —</option>
                    {ID_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </SelectField>
                </div>
                <div>
                  <FieldLabel htmlFor="idNumber" required>
                    ID / Document Number
                  </FieldLabel>
                  <TextField
                    id="idNumber"
                    placeholder="ENTER ID NUMBER"
                    value={form.idNumber}
                    invalid={!!errors["idNumber"]}
                    onChange={(e) => set("idNumber", e.target.value.toUpperCase())}
                  />
                </div>
                <div>
                  <FieldLabel htmlFor="fullName" required>
                    Full Name (as on ID)
                  </FieldLabel>
                  <TextField
                    id="fullName"
                    placeholder="e.g. Ramesh Kumar"
                    value={form.fullName}
                    invalid={!!errors["fullName"]}
                    onChange={(e) => set("fullName", e.target.value)}
                  />
                </div>
                <div>
                  <FieldLabel htmlFor="contact" required>
                    Contact Number
                  </FieldLabel>
                  <div className="flex">
                    <span className="flex items-center rounded-l-md border border-r-0 border-border bg-muted px-3 text-sm font-medium text-muted-foreground">
                      +91
                    </span>
                    <TextField
                      id="contact"
                      inputMode="numeric"
                      maxLength={10}
                      className="rounded-l-none"
                      placeholder="98400 00000"
                      value={form.contact}
                      invalid={!!errors["contact"]}
                      onChange={(e) => set("contact", e.target.value.replace(/\D/g, ""))}
                    />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <FieldLabel htmlFor="email" optional>
                    Email Address
                  </FieldLabel>
                  <TextField
                    id="email"
                    type="email"
                    placeholder="ramesh.kumar@gmail.com"
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                  />
                </div>
                <div className="sm:col-span-2">
                  <FieldLabel htmlFor="address" required>
                    Residential Address
                  </FieldLabel>
                  <TextArea
                    id="address"
                    rows={3}
                    placeholder="Door No., Street Name, Area / Locality"
                    value={form.address}
                    invalid={!!errors["address"]}
                    onChange={(e) => set("address", e.target.value)}
                  />
                </div>
                <div>
                  <FieldLabel htmlFor="city" required>
                    City
                  </FieldLabel>
                  <TextField
                    id="city"
                    value={form.city}
                    invalid={!!errors["city"]}
                    onChange={(e) => set("city", e.target.value)}
                  />
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <FieldLabel htmlFor="state" required>
                      State
                    </FieldLabel>
                    <SelectField
                      id="state"
                      value={form.state}
                      invalid={!!errors["state"]}
                      onChange={(e) => set("state", e.target.value)}
                    >
                      {STATES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </SelectField>
                  </div>
                  <div>
                    <FieldLabel htmlFor="pin" required>
                      PIN Code
                    </FieldLabel>
                    <TextField
                      id="pin"
                      inputMode="numeric"
                      maxLength={6}
                      placeholder="600 044"
                      value={form.pin}
                      invalid={!!errors["pin"]}
                      onChange={(e) => set("pin", e.target.value.replace(/\D/g, ""))}
                    />
                  </div>
                </div>
              </div>
            </SectionCard>

            {/* Section 2 */}
            <SectionCard icon={<CalendarDays className="size-5" />} title="Section 2: Visit Details">
              <div className="grid gap-5 lg:grid-cols-3">
                <div>
                  <FieldLabel htmlFor="purpose" required>
                    Purpose of Visit
                  </FieldLabel>
                  <SelectField
                    id="purpose"
                    value={form.purpose}
                    invalid={!!errors["purpose"]}
                    onChange={(e) => set("purpose", e.target.value)}
                  >
                    <option value="">— Select Purpose —</option>
                    {PURPOSES.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </SelectField>
                </div>
                <div>
                  <FieldLabel htmlFor="hostName" optional>
                    Host Name (Person to Meet)
                  </FieldLabel>
                  <TextField
                    id="hostName"
                    placeholder="e.g. Dr. A. Krishnamurthy"
                    value={form.hostName}
                    onChange={(e) => set("hostName", e.target.value)}
                  />
                  <Hint>
                    Enter the name of the faculty, staff, or department head you are visiting now.
                  </Hint>
                </div>
                <div>
                  <FieldLabel htmlFor="department" required>
                    Department / Block
                  </FieldLabel>
                  <SelectField
                    id="department"
                    value={form.department}
                    invalid={!!errors["department"]}
                    onChange={(e) => set("department", e.target.value)}
                  >
                    <option value="">— Select Department / Block —</option>
                    {DEPARTMENTS.map((group) => (
                      <optgroup key={group.label} label={group.label}>
                        {group.options.map((o) => (
                          <option key={o} value={o}>
                            {o}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </SelectField>
                </div>
              </div>

              <div className="mt-5">
                <FieldLabel htmlFor="description" optional>
                  Brief Description of Purpose
                </FieldLabel>
                <TextArea
                  id="description"
                  rows={3}
                  placeholder="Provide any additional details about the purpose of your visit (max 30 words)."
                  value={form.description}
                  onChange={(e) => {
                    const words = e.target.value.trim().split(/\s+/).filter(Boolean);
                    if (words.length <= 30) set("description", e.target.value);
                  }}
                />
                <p className="mt-1.5 text-right text-xs text-muted-foreground">
                  {wordCount} / 30 words
                </p>
              </div>

              <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:w-2/3">
                <div>
                  <FieldLabel>Date of Visit</FieldLabel>
                  <div className="flex items-center gap-2 rounded-md border border-border bg-muted px-3 py-2.5 text-sm font-semibold text-foreground">
                    <CalendarDays className="size-4 text-brand" />
                    {formatDate(visitDate)}
                  </div>
                  <Hint>
                    Today's date is recorded automatically at the gate and cannot be edited.
                  </Hint>
                </div>
                <div>
                  <FieldLabel htmlFor="expectedExit" optional>
                    Expected Exit Time
                  </FieldLabel>
                  <TextField
                    id="expectedExit"
                    type="time"
                    value={form.expectedExit}
                    onChange={(e) => set("expectedExit", e.target.value)}
                  />
                  <Hint>Campus hours: 08:00 AM – 06:00 PM on working days.</Hint>
                </div>
              </div>
            </SectionCard>

            {/* Section 3 */}
            <SectionCard
              icon={<Camera className="size-5" />}
              title="Section 3: Visitor Photograph"
              aside="(Required)"
            >
              <div className="grid gap-5 lg:grid-cols-[1fr_20rem]">
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    handleFile(e.dataTransfer.files?.[0]);
                  }}
                  className="flex min-h-[15rem] flex-col items-center justify-center rounded-md border-2 border-dashed border-border bg-background/60 p-6 text-center transition hover:border-brand"
                >
                  {photo ? (
                    <>
                      <img
                        src={photo.url}
                        alt="Uploaded visitor photograph preview"
                        className="h-40 w-32 rounded-md border border-border object-cover"
                        width={128}
                        height={160}
                      />
                      <p className="mt-3 text-sm font-semibold text-foreground">{photo.name}</p>
                      <p className="text-xs text-muted-foreground">Click to replace photograph</p>
                    </>
                  ) : (
                    <>
                      <UserRound className="size-10 text-brand" />
                      <p className="mt-3 text-lg font-semibold text-foreground">
                        Upload Visitor Photograph
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Drag and drop or click to browse
                      </p>
                      <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                        {["JPG", "PNG", "WEBP"].map((f) => (
                          <span key={f} className="rounded bg-muted px-2 py-1 font-semibold">
                            {f}
                          </span>
                        ))}
                        <span>· Max 5 MB</span>
                      </div>
                    </>
                  )}
                </button>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(e) => handleFile(e.target.files?.[0])}
                />

                <NoticeBox tone="info">
                  <div>
                    <p className="flex items-center gap-2 font-semibold">
                      <Info className="size-4" /> Photo Guidelines
                    </p>
                    <ul className="mt-2 space-y-1.5">
                      {[
                        "Recent, clear face photograph",
                        "Plain white or light background",
                        "Face clearly visible, no mask",
                        "Passport-style or selfie format",
                        "Good lighting, no filters",
                        "File size: max 5 MB",
                      ].map((g) => (
                        <li key={g} className="flex gap-2">
                          <span className="text-brand">•</span>
                          {g}
                        </li>
                      ))}
                    </ul>
                    <p className="mt-3 text-xs">
                      A live photograph may also be captured by the security officer at the gate.
                    </p>
                  </div>
                </NoticeBox>
              </div>
              {photoError && (
                <p className="mt-3 flex items-center gap-2 text-sm font-medium text-brand">
                  <AlertTriangle className="size-4" /> {photoError}
                </p>
              )}
            </SectionCard>

            {/* Section 4 */}
            <SectionCard
              icon={<Car className="size-5" />}
              title="Section 4: Vehicle Information"
              aside="(Fill only if arriving by vehicle)"
            >
              <label className="flex cursor-pointer items-center gap-3">
                <span className="relative inline-flex h-6 w-11 shrink-0 items-center rounded-full bg-muted-foreground/30 transition has-[:checked]:bg-brand">
                  <input
                    type="checkbox"
                    className="peer sr-only"
                    checked={form.byVehicle}
                    onChange={(e) => set("byVehicle", e.target.checked)}
                  />
                  <span className="absolute left-1 size-4 rounded-full bg-card transition peer-checked:translate-x-5" />
                </span>
                <span className="text-sm font-medium text-foreground">
                  I have arrived by vehicle and require campus parking
                </span>
              </label>

              {form.byVehicle ? (
                <>
                  <div className="mt-5 grid gap-5 border-t border-border pt-5 lg:grid-cols-3">
                    <div>
                      <FieldLabel htmlFor="vehicleType" required>
                        Vehicle Type
                      </FieldLabel>
                      <SelectField
                        id="vehicleType"
                        value={form.vehicleType}
                        invalid={!!errors["vehicleType"]}
                        onChange={(e) => set("vehicleType", e.target.value)}
                      >
                        <option value="">— Select Vehicle Type —</option>
                        {VEHICLE_TYPES.map((v) => (
                          <option key={v} value={v}>
                            {v}
                          </option>
                        ))}
                      </SelectField>
                    </div>
                    <div>
                      <FieldLabel htmlFor="vehicleReg" required>
                        Vehicle Registration Number
                      </FieldLabel>
                      <TextField
                        id="vehicleReg"
                        placeholder="TN 01 AB 1234"
                        value={form.vehicleReg}
                        invalid={!!errors["vehicleReg"]}
                        onChange={(e) => set("vehicleReg", e.target.value.toUpperCase())}
                      />
                      <Hint>
                        As displayed on the registration certificate (RC). e.g. TN 01 AB 1234
                      </Hint>
                    </div>
                    <div>
                      <FieldLabel htmlFor="vehicleModel" optional>
                        Vehicle Make / Model
                      </FieldLabel>
                      <TextField
                        id="vehicleModel"
                        placeholder="e.g. Honda Activa, Maruti Swift"
                        value={form.vehicleModel}
                        onChange={(e) => set("vehicleModel", e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="mt-5">
                    <NoticeBox>
                      <Info className="mt-0.5 size-4 shrink-0" />
                      <p>
                        <span className="font-bold">Parking Notice:</span> Visitor parking is
                        available near the main gate on a first-come basis. Heavy vehicles (buses,
                        trucks) must park at the designated entry area. Campus speed limit is 15
                        km/h. Security staff will guide you to the parking zone.
                      </p>
                    </NoticeBox>
                  </div>
                </>
              ) : (
                <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                  <Car className="size-4 text-brand" /> Toggle the switch above if you have brought a
                  vehicle onto campus. Vehicle details will be recorded in the visitor log.
                </p>
              )}
            </SectionCard>

            {/* Submit bar */}
            <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
                  By submitting, you confirm that the information provided is accurate. Your entry
                  time is recorded automatically at the moment of submission.
                </p>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={clearForm}
                    className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground transition hover:bg-muted"
                  >
                    <RotateCcw className="size-4" /> Clear Form
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-md bg-brand px-6 py-3 text-sm font-bold text-brand-foreground transition hover:bg-brand-dark"
                  >
                    <CheckCircle2 className="size-5" /> Submit &amp; Generate Pass
                  </button>
                </div>
              </div>
            </div>

            {!photo && (
              <p className="flex items-center justify-center gap-2 text-sm font-medium text-notice-foreground">
                <AlertTriangle className="size-4" /> Visitor photograph is required before
                submitting.
              </p>
            )}
          </form>
        </main>

        {/* Footer */}
        <footer className="mt-6 bg-footer text-footer-foreground">
          <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 md:grid-cols-3">
            <div>
              <div className="border-l-4 border-brand pl-3">
                <p className="text-lg font-bold">Madras Institute of Technology</p>
                <p className="text-sm text-footer-muted">A Constituent College of Anna University</p>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-footer-muted">
                Chrompet, Chennai — 600 044
                <br />
                Tamil Nadu, India
              </p>
            </div>
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-footer-muted">
                Contact
              </h2>
              <ul className="mt-4 space-y-3 text-sm">
                <li className="flex items-center gap-2.5">
                  <Phone className="size-4 text-brand" />
                  <a href="tel:+914422516215" className="hover:underline">
                    +91 44 2251 6215
                  </a>
                </li>
                <li className="flex items-center gap-2.5">
                  <Mail className="size-4 text-brand" />
                  <a href="mailto:dean@mitindia.edu" className="hover:underline">
                    dean@mitindia.edu
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-footer-muted">
                Security Notice
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-footer-muted">
                All visitors are required to complete registration at the main gate and present a
                valid government-issued photo ID before entering the campus premises. Visitor passes
                are issued and verified at the security gate.
              </p>
            </div>
          </div>
          <div className="border-t border-card/10">
            <div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-2 px-5 py-5 text-xs text-footer-muted">
              <p>© {new Date().getFullYear()} Madras Institute of Technology, Chennai. All rights reserved.</p>
              <p>Visitor Management System — Campus Security Division</p>
            </div>
          </div>
        </footer>
      </div>

      {pass && <VisitorPass data={pass} onClose={() => setPass(null)} />}
    </div>
  );
}
