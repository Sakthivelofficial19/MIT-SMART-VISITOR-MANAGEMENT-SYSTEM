import type { ReactNode, SelectHTMLAttributes, InputHTMLAttributes, TextareaHTMLAttributes } from "react";

const fieldBase =
  "w-full rounded-md border border-border bg-card px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/70 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20 disabled:cursor-not-allowed";

export function FieldLabel({
  children,
  required,
  optional,
  htmlFor,
}: {
  children: ReactNode;
  required?: boolean;
  optional?: boolean;
  htmlFor?: string;
}) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-semibold text-foreground">
      {children}
      {required && <span className="ml-1 text-brand">*</span>}
      {optional && <span className="ml-1 font-normal text-muted-foreground">(Optional)</span>}
    </label>
  );
}

export function Hint({ children }: { children: ReactNode }) {
  return <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{children}</p>;
}

export function TextField({
  invalid,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }) {
  return <input {...props} className={`${fieldBase} ${invalid ? "border-brand" : ""}`} />;
}

export function TextArea({
  invalid,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { invalid?: boolean }) {
  return <textarea {...props} className={`${fieldBase} ${invalid ? "border-brand" : ""}`} />;
}

export function SelectField({
  invalid,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & { invalid?: boolean }) {
  return (
    <select
      {...props}
      className={`${fieldBase} appearance-none bg-[length:1.1rem] bg-[right_0.7rem_center] bg-no-repeat pr-9 ${
        invalid ? "border-brand" : ""
      }`}
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")",
      }}
    >
      {children}
    </select>
  );
}

export function SectionCard({
  icon,
  title,
  aside,
  children,
}: {
  icon: ReactNode;
  title: string;
  aside?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
      <header className="flex flex-wrap items-center justify-between gap-2 bg-brand px-5 py-3.5 text-brand-foreground">
        <h2 className="flex items-center gap-2.5 text-base font-semibold">
          {icon}
          {title}
        </h2>
        {aside && <span className="text-sm font-medium text-brand-foreground/90">{aside}</span>}
      </header>
      <div className="p-5 sm:p-6">{children}</div>
    </section>
  );
}

export function NoticeBox({
  tone = "notice",
  children,
}: {
  tone?: "notice" | "info";
  children: ReactNode;
}) {
  const cls =
    tone === "notice"
      ? "border-notice-border bg-notice text-notice-foreground"
      : "border-info-border bg-info text-info-foreground";
  return (
    <div className={`flex gap-2.5 rounded-md border p-3.5 text-sm leading-relaxed ${cls}`}>
      {children}
    </div>
  );
}
