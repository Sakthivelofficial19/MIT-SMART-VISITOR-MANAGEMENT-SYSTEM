import { Printer, X } from "lucide-react";

export type PassData = {
  passNo: string;
  fullName: string;
  idType: string;
  idNumberMasked: string;
  contact: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pin: string;
  purpose: string;
  hostName: string;
  department: string;
  description: string;
  visitDate: string;
  entryTime: string;
  expectedExit: string;
  vehicle: { type: string; reg: string; model: string } | null;
  photo: string | null;
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-dashed border-border py-1.5">
      <dt className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </dt>
      <dd className="text-sm font-medium text-foreground">{value || "—"}</dd>
    </div>
  );
}

export function VisitorPass({ data, onClose }: { data: PassData; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-foreground/50 px-4 py-8 print:static print:bg-transparent print:p-0">
      <div className="mx-auto max-w-3xl">
        <div className="mb-3 flex items-center justify-between print:hidden">
          <p className="text-sm font-semibold text-card">
            Registration recorded. Print the pass and show it at the security gate.
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 rounded-md bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground transition hover:bg-brand-dark"
            >
              <Printer className="size-4" /> Print Pass
            </button>
            <button
              onClick={onClose}
              className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-muted"
            >
              <X className="size-4" /> Close
            </button>
          </div>
        </div>

        <div id="visitor-pass" className="rounded-lg border border-border bg-card">
          <div className="flex items-center justify-between gap-4 bg-brand px-5 py-4 text-brand-foreground">
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] opacity-90">
                Anna University Constituent College
              </p>
              <h2 className="text-lg font-bold leading-tight">Madras Institute of Technology</h2>
              <p className="text-xs opacity-90">Chrompet, Chennai — 600 044</p>
            </div>
            <div className="text-right">
              <p className="text-[11px] uppercase tracking-widest opacity-90">Visitor Pass</p>
              <p className="text-base font-bold">{data.passNo}</p>
            </div>
          </div>

          <div className="grid gap-5 p-5 sm:grid-cols-[7.5rem_1fr]">
            <div>
              {data.photo ? (
                <img
                  src={data.photo}
                  alt={`Photograph of ${data.fullName}`}
                  className="h-36 w-30 rounded-md border border-border object-cover"
                  width={120}
                  height={144}
                />
              ) : (
                <div className="h-36 w-30 rounded-md border border-dashed border-border" />
              )}
              <div className="mt-3 rounded-md border border-notice-border bg-notice p-2 text-center">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-notice-foreground">
                  Entry Time
                </p>
                <p className="text-sm font-bold text-notice-foreground">{data.entryTime}</p>
              </div>
            </div>

            <dl className="grid gap-x-6 sm:grid-cols-2">
              <Row label="Visitor Name" value={data.fullName} />
              <Row label="Contact Number" value={data.contact} />
              <Row label="ID Type" value={data.idType} />
              <Row label="ID / Document Number" value={data.idNumberMasked} />
              <Row label="Date of Visit" value={data.visitDate} />
              <Row label="Expected Exit Time" value={data.expectedExit} />
              <Row label="Purpose of Visit" value={data.purpose} />
              <Row label="Host / Person to Meet" value={data.hostName} />
              <Row label="Department / Block" value={data.department} />
              <Row label="Email Address" value={data.email} />
              <div className="sm:col-span-2">
                <Row
                  label="Address"
                  value={[data.address, data.city, data.state, data.pin]
                    .filter(Boolean)
                    .join(", ")}
                />
              </div>
              {data.description && (
                <div className="sm:col-span-2">
                  <Row label="Description of Purpose" value={data.description} />
                </div>
              )}
              {data.vehicle && (
                <div className="sm:col-span-2">
                  <Row
                    label="Vehicle"
                    value={[data.vehicle.type, data.vehicle.reg, data.vehicle.model]
                      .filter(Boolean)
                      .join(" · ")}
                  />
                </div>
              )}
            </dl>
          </div>

          <div className="flex flex-wrap items-end justify-between gap-6 border-t border-border px-5 py-4">
            <p className="max-w-md text-xs leading-relaxed text-muted-foreground">
              This pass is valid only for the date and time of issue. It must be carried inside the
              campus and surrendered at the security gate while exiting. Actual exit time will be
              recorded by the security officer at checkout.
            </p>
            <div className="text-center">
              <div className="h-10 w-40 border-b border-foreground/40" />
              <p className="mt-1 text-[10px] uppercase tracking-wide text-muted-foreground">
                Security Officer — Main Gate
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
